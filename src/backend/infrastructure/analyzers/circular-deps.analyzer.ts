import { Project, SourceFile, Node } from 'ts-morph';
import { AnalyzerIssue } from '../interfaces/analyzer';
import path from 'path';

/**
 * CircularDepsAnalyzer: Guardian of modularity.
 * Detects circular dependencies and architectural layer violations.
 */
export class CircularDepsAnalyzer {
  private dependencyGraph: Map<string, string[]> = new Map();
  private projectRoot: string = process.cwd();

  /**
   * Main entry point for dependency analysis
   */
  public analyzeProject(project: Project): AnalyzerIssue[] {
    const issues: AnalyzerIssue[] = [];
    const sourceFiles = project.getSourceFiles();

    // 1. Build the Dependency Graph
    this.dependencyGraph.clear();
    sourceFiles.forEach(file => {
      const filePath = file.getFilePath();
      const imports = file.getImportDeclarations()
        .map(imp => imp.getModuleSpecifierSourceFile()?.getFilePath())
        .filter((fp): fp is string => !!fp && !fp.includes('node_modules'));
      
      this.dependencyGraph.set(filePath, imports);
    });

    // 2. Detect Cycles using DFS
    const visited = new Set<string>();
    const recStack = new Set<string>();

    for (const file of this.dependencyGraph.keys()) {
      const cyclePath: string[] = [];
      if (this.hasCycle(file, visited, recStack, cyclePath)) {
        issues.push(this.createCycleIssue(cyclePath));
        // Reset recStack for next search to find different cycles
        recStack.clear();
      }
    }

    // 3. Layer Violation Audit
    sourceFiles.forEach(file => {
      issues.push(...this.checkLayerViolations(file));
    });

    return issues;
  }

  private hasCycle(node: string, visited: Set<string>, recStack: Set<string>, pathStack: string[]): boolean {
    if (recStack.has(node)) {
      pathStack.push(node);
      return true;
    }
    if (visited.has(node)) return false;

    visited.add(node);
    recStack.add(node);
    pathStack.push(node);

    const neighbors = this.dependencyGraph.get(node) || [];
    for (const neighbor of neighbors) {
      if (this.hasCycle(neighbor, visited, recStack, pathStack)) {
        return true;
      }
    }

    recStack.delete(node);
    pathStack.pop();
    return false;
  }

  private checkLayerViolations(file: SourceFile): AnalyzerIssue[] {
    const issues: AnalyzerIssue[] = [];
    const filePath = file.getFilePath();
    const imports = file.getImportDeclarations();

    imports.forEach(imp => {
      const targetFile = imp.getModuleSpecifierSourceFile();
      if (!targetFile) return;

      const targetPath = targetFile.getFilePath();

      // Rule: Domain/Entities should NEVER import Services or Infrastructure
      if (filePath.includes('/domain/') && (targetPath.includes('/services/') || targetPath.includes('/infrastructure/'))) {
        issues.push({
          file: filePath,
          line: imp.getStartLineNumber(),
          severity: 'HIGH',
          explanation: `Architectural Violation: Domain entities should be pure and not depend on services or infrastructure.`,
          suggestion: `Use Dependency Inversion (Interfaces) or move logic to a service/orchestrator.`
        });
      }

      // Rule: DTOs should not import Services
      if (filePath.includes('/dto/') && targetPath.includes('/services/')) {
        issues.push({
          file: filePath,
          line: imp.getStartLineNumber(),
          severity: 'MEDIUM',
          explanation: `DTO Violation: Data Transfer Objects should be simple data structures, not depend on services.`,
          suggestion: `Refactor the DTO to be a pure data structure.`
        });
      }
    });

    return issues;
  }

  private createCycleIssue(cycle: string[]): AnalyzerIssue {
    const formattedPath = cycle
      .map(p => path.relative(this.projectRoot, p))
      .join(' -> ');

    return {
      file: cycle[0],
      line: 1,
      severity: 'HIGH',
      explanation: `Circular Dependency Detected: ${formattedPath}`,
      suggestion: `Break the cycle by extracting shared logic into a new module or using Dependency Inversion.`
    };
  }
}
