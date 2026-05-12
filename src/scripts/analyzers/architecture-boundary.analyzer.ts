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
  private readonly FORBIDDEN_IN_CORE = ['@prisma/client', 'groq-sdk', 'better-sqlite3', 'fs', 'path'];

  public analyze(context: AnalysisContext): AnalyzerResult {
    const startTime = Date.now();
    const issues: Issue[] = [];

    const nodes = context.graph.getNodes();

    nodes.forEach((node: GraphNode) => {

      const filePath = node.path;
      const relativePath = path.relative(this.projectRoot, filePath);

      // Layer identification
      const isDomain = relativePath.includes('/domain/');
      const isApplication = relativePath.includes('/services/') || relativePath.includes('/use-cases/');
      const isInfrastructure = relativePath.includes('/infrastructure/') || relativePath.includes('/controllers/') || relativePath.includes('/adapters/');

      // 1. Domain Purity Rules
      if (isDomain) {
        node.imports.forEach((impPath: string) => {

          const impRelPath = path.relative(this.projectRoot, impPath);
          
          // Domain cannot depend on Application or Infrastructure
          if (impRelPath.includes('/services/') || impRelPath.includes('/infrastructure/') || impRelPath.includes('/controllers/')) {
            issues.push(this.createViolation(filePath, impPath, 'Domain', 'External Layers'));
          }

          // Domain cannot depend on Infrastructure Libraries
          if (this.FORBIDDEN_IN_CORE.some(lib => impPath.includes(lib))) {
             issues.push(this.createViolation(filePath, impPath, 'Domain', `Infrastructure Library (${impPath})`));
          }
        });
      }

      // 2. Application/Service Isolation Rules
      if (isApplication) {
        node.imports.forEach((impPath: string) => {

          const impRelPath = path.relative(this.projectRoot, impPath);

          // Services cannot depend on Infrastructure directly (must use interfaces)
          if (impRelPath.includes('/infrastructure/') || impRelPath.includes('/controllers/') || impRelPath.includes('/adapters/')) {
            issues.push({
              file: filePath,
              line: 1,
              severity: 'HIGH',
              explanation: `Architectural Breach: Service layer "${relativePath}" imports directly from Infrastructure!`,
              suggestion: 'Use Repository interfaces defined in Domain and inject implementation via DI.',
              analyzer: 'ArchitectureBoundaryAnalyzer'
            });
          }

          // Services cannot depend on low-level Infra libraries
          if (this.FORBIDDEN_IN_CORE.some(lib => impPath.includes(lib))) {
            issues.push(this.createViolation(filePath, impPath, 'Application', `Infrastructure Library (${impPath})`));
          }
        });
      }

      // 3. Infrastructure Rules (Adapters)
      if (isInfrastructure) {
        // Infrastructure is allowed to import from Domain and Application (Orchestration)
        // But we could add rules here later if needed.
      }

      // 4. Frontend vs Infrastructure Boundary
      if (relativePath.includes('src/frontend/')) {
        node.imports.forEach((impPath: string) => {

           if (impPath.includes('/infrastructure/') || impPath.includes('/adapters/')) {
             issues.push({
               file: filePath,
               line: 1,
               severity: 'HIGH',
               explanation: `Front-to-Back Breach: Frontend module "${relativePath}" imports directly from Infrastructure!`,
               suggestion: 'Frontend should only depend on Shared Types or API Services.',
               analyzer: 'ArchitectureBoundaryAnalyzer'
             });
           }
        });
      }

      // 5. Controller Naming Integrity (Structural Rule)
      if (relativePath.includes('/controllers/')) {
        const sourceFile = context.project.getSourceFile(filePath);
        sourceFile?.getClasses().forEach(cls => {
          const name = cls.getName();
          if (name && !name.endsWith('Controller')) {
            issues.push({
              file: filePath,
              line: cls.getStartLineNumber(),
              severity: 'HIGH',
              explanation: `Naming Boundary Violation: Class "${name}" in ${relativePath} must end with "Controller".`,
              suggestion: 'Ensure all controllers follow the [Domain]Controller suffix convention.',
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
      suggestion: `Ensure ${layer} remains decoupled. Use interfaces and dependency injection.`,
      analyzer: 'ArchitectureBoundaryAnalyzer'
    };
  }
}
