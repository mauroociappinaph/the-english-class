import path from 'path';
import { Issue, Analyzer, AnalysisContext, AnalyzerResult } from '../types/analyzer.types';
import { GraphNode } from '../types/graph.types';

/**
 * ArchitectureBoundaryAnalyzer: The guardian of Hexagonal/Clean Architecture.
 * Enforces strict layer boundaries and domain purity.
 */
export class ArchitectureBoundaryAnalyzer implements Analyzer {
  public readonly name = 'Architecture Boundary Analyzer';
  public readonly isGlobal = true;

  private readonly projectRoot: string = process.cwd();
  
  // Infrastructure libraries that should NEVER touch the Domain/Core
  private readonly FORBIDDEN_IN_CORE = [
    '@prisma/client', 
    'groq-sdk', 
    'openai', 
    'better-sqlite3', 
    'fs', 
    'path', 
    'express', 
    'langchain',
    'zod-to-json-schema'
  ];

  public async analyze(context: AnalysisContext): Promise<AnalyzerResult> {
    const startTime = Date.now();
    const issues: Issue[] = [];
    const nodes = context.graph.getNodes();

    nodes.forEach((node: GraphNode) => {
      const filePath = node.path;
      const relativePath = path.relative(this.projectRoot, filePath);

      // Layer identification using normalized paths
      const isDomain = relativePath.includes('src/backend/domain') || relativePath.includes('/domain/');
      const isApplication = relativePath.includes('src/backend/services') || relativePath.includes('/use-cases/');
      const isInfrastructure = relativePath.includes('src/backend/infrastructure') || 
                               relativePath.includes('/controllers/') || 
                               relativePath.includes('/adapters/') ||
                               relativePath.includes('src/backend/api');
      const isFrontend = relativePath.includes('src/frontend/');
      const isShared = relativePath.includes('src/shared/');

      // 1. Domain Purity Rules: Domain is the core. It depends on NOTHING but Shared.
      if (isDomain) {
        node.imports.forEach((impPath: string) => {
          const impRelPath = path.relative(this.projectRoot, impPath);
          
          // Domain cannot depend on Application or Infrastructure
          if ((impRelPath.includes('src/backend/services') || 
               impRelPath.includes('src/backend/infrastructure') || 
               impRelPath.includes('src/backend/api')) && !impRelPath.includes('src/shared/')) {
            issues.push(this.createViolation(filePath, impPath, 'Domain', 'External Layers (Infrastructure/Application)'));
          }

          // Domain cannot depend on Infrastructure Libraries (External node_modules)
          if (impPath.includes('node_modules')) {
            const isForbidden = this.FORBIDDEN_IN_CORE.some(lib => {
              // Exact match for the package name or path
              return impPath.includes(`/node_modules/${lib}/`) || impPath.endsWith(`/node_modules/${lib}`);
            });

            if (isForbidden) {
               issues.push(this.createViolation(filePath, impPath, 'Domain', `Infrastructure Library (${impPath})`));
            }
          }
        });
      }

      // 2. Application/Service Isolation Rules: Depends only on Domain (and Shared).
      if (isApplication) {
        node.imports.forEach((impPath: string) => {
          const impRelPath = path.relative(this.projectRoot, impPath);

          // Services cannot depend on Infrastructure directly (must use interfaces from Domain)
          if ((impRelPath.includes('src/backend/infrastructure') || 
               impRelPath.includes('src/backend/api')) && !impRelPath.includes('src/shared/')) {
            issues.push({
              file: filePath,
              line: 1,
              severity: 'HIGH',
              explanation: `Architectural Breach: Service layer "${relativePath}" imports directly from Infrastructure!`,
              suggestion: 'Services must remain infrastructure-agnostic. Use Repository interfaces defined in Domain.',
              analyzer: 'ArchitectureBoundaryAnalyzer'
            });
          }

          // Services cannot depend on low-level Infra libraries in node_modules
          if (impPath.includes('node_modules')) {
             const isForbidden = this.FORBIDDEN_IN_CORE.some(lib => {
               return impPath.includes(`/node_modules/${lib}/`) || impPath.endsWith(`/node_modules/${lib}`);
             });
             if (isForbidden) {
               issues.push(this.createViolation(filePath, impPath, 'Application', `Infrastructure Library (${impPath})`));
             }
          }
        });
      }

      // 3. Frontend Boundary Rules: Frontend must not leak into Backend logic.
      if (isFrontend) {
        node.imports.forEach((impPath: string) => {
           const impRelPath = path.relative(this.projectRoot, impPath);

           // Frontend cannot import from Infrastructure or internal Backend folders
           // Exception: shared folder is allowed
           if (impRelPath.includes('src/backend/') && !impRelPath.includes('src/shared/')) {
             issues.push({
               file: filePath,
               line: 1,
               severity: 'HIGH',
               explanation: `Front-to-Back Breach: Frontend module "${relativePath}" imports directly from Backend Infrastructure/Logic!`,
               suggestion: 'Frontend should only depend on Shared Types or access data via API calls. Do not share server-side logic with the client.',
               analyzer: 'ArchitectureBoundaryAnalyzer'
             });
           }
        });
      }

      // 4. Controller Naming Integrity (Structural Rule)
      if (relativePath.includes('/controllers/') || relativePath.includes('src/backend/api')) {
        const sourceFile = context.project.getSourceFile(filePath);
        if (relativePath.endsWith('index.ts') || relativePath.includes('.routes.')) return;

        sourceFile?.getClasses().forEach(cls => {
          const name = cls.getName();
          if (name && !name.endsWith('Controller') && !name.endsWith('Handler')) {
            issues.push({
              file: filePath,
              line: cls.getStartLineNumber(),
              severity: 'HIGH',
              explanation: `Naming Boundary Violation: Class "${name}" in ${relativePath} does not follow naming conventions.`,
              suggestion: 'Controllers should end with "Controller", Handlers with "Handler".',
              analyzer: 'ArchitectureBoundaryAnalyzer'
            });
          }
        });
      }
    });

    return {
      analyzerName: this.name,
      issues,
      executionTimeMs: Date.now() - startTime
    };
  }

  private createViolation(file: string, imp: string, layer: string, target: string): Issue {
    return {
      file,
      line: 1,
      severity: 'HIGH',
      explanation: `Boundary Violation: ${layer} layer is leaking! It imports from ${target}.`,
      suggestion: `Ensure ${layer} remains pure. External dependencies must be inverted via interfaces and injected at runtime.`,
      analyzer: 'ArchitectureBoundaryAnalyzer'
    };
  }
}
