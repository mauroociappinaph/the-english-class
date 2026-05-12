import { AnalysisContext, Analyzer, AnalyzerResult, Issue } from '../types/analyzer.types';

/**
 * BaseAnalyzer: Implements the boilerplate for execution time tracking.
 */
export abstract class BaseAnalyzer implements Analyzer {
  abstract name: string;
  abstract isGlobal: boolean;

  analyze(context: AnalysisContext): AnalyzerResult {
    const startTime = Date.now();
    const issues = this.runAnalysis(context);

    return {
      analyzerName: this.name,
      issues,
      executionTimeMs: Date.now() - startTime
    };
  }

  /**
   * Actual analysis logic to be implemented by children.
   */
  protected abstract runAnalysis(context: AnalysisContext): Issue[];
}
