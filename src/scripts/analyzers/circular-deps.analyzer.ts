import { Project, SourceFile } from 'ts-morph';
import { Issue, Analyzer, AnalysisContext, AnalyzerResult } from '../types/analyzer.types';
import path from 'path';

/**
 * CircularDepsAnalyzer: Guardian of modularity.
 * Detects circular dependencies and architectural layer violations.
 */
export class CircularDepsAnalyzer implements Analyzer {
  public readonly name = 'Circular Dependency Analyzer';
  public readonly isGlobal = true;

  private dependencyGraph: Map<string, string[]> = new Map();
  private projectRoot: string = process.cwd();

  public analyze(context: AnalysisContext): AnalyzerResult {
    const startTime = Date.now();
    const issues = this.analyzeProject(context.project);
    
    return {
      analyzerName: this.name,
      issues,
      executionTimeMs: Date.now() - startTime
    };
  }

  /**
   * Main entry point for dependency analysis
   */
  public analyzeProject(project: Project): Issue[] {
    const issues: Issue[] = [];
    const sourceFiles = project.getSourceFiles().filter(sf => {
      const path = sf.getFilePath();
      return !path.includes('node_modules') && !path.endsWith('.d.ts') && !path.endsWith('.d.mts');
    });

    // 1. Build Dependency Graph
    this.buildGraph(sourceFiles);



    // 2. Detect Cycles
    sourceFiles.forEach(sourceFile => {
      const cycle = this.findCycle(sourceFile.getFilePath());
      if (cycle) {
        issues.push({
          file: sourceFile.getFilePath(),
          line: 1,
          severity: 'HIGH',
          explanation: `Circular Dependency Detected: ${cycle.join(' -> ')}`,
          suggestion: 'Break the cycle by extracting shared logic to a common module or using dependency injection.',
          analyzer: 'CircularDepsAnalyzer'
        });
      }
    });

    // 3. Layer Integrity Check (Domain vs Infra)
    issues.push(...this.checkLayerIntegrity(sourceFiles));

    return issues;
  }

  private buildGraph(sourceFiles: SourceFile[]) {
    this.dependencyGraph.clear();
    sourceFiles.forEach(sourceFile => {
      const filePath = sourceFile.getFilePath();
      const imports: string[] = sourceFile.getImportDeclarations()
        .map(imp => imp.getModuleSpecifierSourceFile()?.getFilePath() as string | undefined)
        .filter((fp): fp is string => !!fp);
      
      this.dependencyGraph.set(filePath, imports);
    });
  }

  private findCycle(startNode: string): string[] | null {
    const visited = new Set<string>();
    const stack = new Set<string>();
    const pathTrace: string[] = [];

    const visit = (node: string): string[] | null => {
      if (stack.has(node)) {
        const cycleIndex = pathTrace.indexOf(node);
        return [...pathTrace.slice(cycleIndex), node];
      }
      if (visited.has(node)) return null;

      visited.add(node);
      stack.add(node);
      pathTrace.push(node);

      const neighbors = this.dependencyGraph.get(node) || [];
      for (const neighbor of neighbors) {
        const cycle = visit(neighbor);
        if (cycle) return cycle;
      }

      stack.delete(node);
      pathTrace.pop();
      return null;
    };

    return visit(startNode);
  }

  private checkLayerIntegrity(sourceFiles: SourceFile[]): Issue[] {
    const issues: Issue[] = [];
    const forbiddenExternalInCore = ['@prisma/client', 'groq-sdk', 'better-sqlite3'];

    sourceFiles.forEach(sourceFile => {
      const filePath = sourceFile.getFilePath();
      const relativePath = path.relative(this.projectRoot, filePath);
      const imports = sourceFile.getImportDeclarations();

      // --- Rule: Domain Purity ---
      if (relativePath.includes('/domain/')) {
        imports.forEach(imp => {
          const modulePath = imp.getModuleSpecifierValue();
          
          // 1. No Infra or Services in Domain
          if (modulePath && (modulePath.includes('/infrastructure/') || modulePath.includes('@/infrastructure') || modulePath.includes('/services/') || modulePath.includes('@/services'))) {
            issues.push(this.createLayerViolation(filePath, imp, 'Domain', 'Infrastructure/Services'));
          }

          // 2. No external implementation libraries in Domain
          if (forbiddenExternalInCore.some(lib => modulePath.includes(lib))) {
            issues.push(this.createExternalViolation(filePath, imp, 'Domain', modulePath));
          }
        });
      }

      // --- Rule: Service Orchestration ---
      if (relativePath.includes('/services/')) {
        imports.forEach(imp => {
          const modulePath = imp.getModuleSpecifierValue();

          // 1. Services should not depend on Infrastructure directly (Goal: Decoupling)
          if (modulePath && (modulePath.includes('/infrastructure/') || modulePath.includes('@/infrastructure'))) {
            issues.push({
              file: filePath,
              line: imp.getStartLineNumber(),
              severity: 'HIGH',
              explanation: `Architectural Violation: Service layer "${relativePath}" imports directly from Infrastructure!`,
              suggestion: 'Use the Service Facade pattern or Repository interfaces defined in Domain.',
              analyzer: 'CircularDepsAnalyzer'
            });
          }

          // 2. No external implementation libraries in Services
          if (forbiddenExternalInCore.some(lib => modulePath.includes(lib))) {
            issues.push(this.createExternalViolation(filePath, imp, 'Service', modulePath));
          }
        });
      }

      // --- Rule: DTOs Purity ---
      if (relativePath.includes('.dto.ts') || relativePath.includes('/dtos/')) {
        if (imports.length > 5) {
          issues.push({
            file: filePath,
            line: 1,
            severity: 'MEDIUM',
            explanation: `DTO Complexity Warning: "${relativePath}" has too many dependencies (${imports.length}).`,
            suggestion: 'DTOs should be simple data structures. Consider flattening the object.',
            analyzer: 'CircularDepsAnalyzer'
          });
        }
      }
    });
    return issues;
  }

  private createLayerViolation(file: string, imp: import('ts-morph').ImportDeclaration, layer: string, target: string): Issue {
    return {
      file,
      line: imp.getStartLineNumber(),
      severity: 'HIGH',
      explanation: `Architectural Violation: ${layer} layer imports from ${target}!`,
      suggestion: `Ensure the ${layer} layer remains pure. Use interfaces and dependency injection.`,
      analyzer: 'CircularDepsAnalyzer'
    };
  }

  private createExternalViolation(file: string, imp: import('ts-morph').ImportDeclaration, layer: string, lib: string): Issue {
    return {
      file,
      line: imp.getStartLineNumber(),
      severity: 'HIGH',
      explanation: `Infrastructure Leak: ${layer} layer depends on external library "${lib}"!`,
      suggestion: `Abstract "${lib}" behind an interface in the Domain layer and implement it in Infrastructure.`,
      analyzer: 'CircularDepsAnalyzer'
    };
  }
}
