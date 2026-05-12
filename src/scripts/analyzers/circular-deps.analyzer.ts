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

  private projectRoot: string = process.cwd();


  public analyze(context: AnalysisContext): AnalyzerResult {
    const startTime = Date.now();
    const issues = this.analyzeProject(context);

    
    return {
      analyzerName: this.name,
      issues,
      executionTimeMs: Date.now() - startTime
    };
  }

  /**
   * Main entry point for dependency analysis
   */
  public analyzeProject(context: AnalysisContext): Issue[] {
    const issues: Issue[] = [];
    const sourceFiles = context.project.getSourceFiles().filter(sf => {
      const path = sf.getFilePath();
      return !path.includes('node_modules') && !path.endsWith('.d.ts') && !path.endsWith('.d.mts');
    });

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

