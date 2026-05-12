import { Issue, AnalysisContext } from '../types/analyzer.types';
import { ProjectUtils } from '../utils/project-utils';
import { BaseAnalyzer } from './base.analyzer';

/**
 * CircularDepsAnalyzer: Guardian of modularity.
 * Detects circular dependencies and architectural layer violations.
 */
export class CircularDepsAnalyzer extends BaseAnalyzer {
  public readonly name = 'Circular Dependency Analyzer';
  public readonly isGlobal = true;

  private projectRoot: string = process.cwd();


  /**
   * Main entry point for dependency analysis
   */
  protected runAnalysis(context: AnalysisContext): Issue[] {
    const issues: Issue[] = [];
    const sourceFiles = ProjectUtils.getRelevantSourceFiles(context.project);

    // Graph is already built by the orchestrator




    // 2. Detect Cycles
    sourceFiles.forEach(sourceFile => {
      const cycle = context.graph.findCycle(sourceFile.getFilePath());
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

    return issues;
  }


  // Removed buildGraph and findCycle as they are now in DependencyGraph

}

