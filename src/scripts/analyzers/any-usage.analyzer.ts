import { Project, SyntaxKind, SourceFile } from 'ts-morph';

import { Issue, Analyzer, AnalysisContext, AnalyzerResult } from '../types/analyzer.types';

/**
 * AnyUsageAnalyzer: Enforcement of the "Zero-Any" policy.
 * Detects usage of 'any', 'as any', and unhandled types that break type safety.
 */
export class AnyUsageAnalyzer implements Analyzer {
  public readonly name = 'Zero-Any Analyzer';
  public readonly isGlobal = false;


  public analyze(context: AnalysisContext): AnalyzerResult {
    const startTime = Date.now();
    const issues = this.analyzeProject(context.project, context.anyUsageRules.allowTypeAssertions, context.changedFiles);


    
    return {
      analyzerName: this.name,
      issues,
      executionTimeMs: Date.now() - startTime
    };
  }

  public analyzeProject(project: Project, allowAssertions: boolean = false, filesToAnalyze?: string[]): Issue[] {
    const issues: Issue[] = [];
    const sourceFiles = filesToAnalyze 
      ? filesToAnalyze.map(f => project.getSourceFile(f)).filter((sf): sf is SourceFile => !!sf)
      : project.getSourceFiles();



    sourceFiles.forEach(sourceFile => {
      const filePath = sourceFile.getFilePath();
      if (filePath.includes('node_modules')) return;

      // 1. Detect explicit 'any' type references
      sourceFile.getDescendantsOfKind(SyntaxKind.AnyKeyword).forEach(node => {
        // Skip if inside a type assertion and they are allowed
        if (allowAssertions && node.getFirstAncestorByKind(SyntaxKind.AsExpression)) {
          return;
        }

        issues.push({
          file: filePath,
          line: node.getStartLineNumber(),
          severity: 'MEDIUM',
          explanation: `Found usage of "any" in: ${node.getParent()?.getText().substring(0, 50)}...`,
          suggestion: 'Replace with "unknown", a generic, or a specific interface.',
          analyzer: 'AnyUsageAnalyzer'
        });
      });

      // 2. Detect 'as any' type assertions
      if (!allowAssertions) {
        sourceFile.getDescendantsOfKind(SyntaxKind.AsExpression).forEach(node => {
          if (node.getType().isAny()) {
            issues.push({
              file: filePath,
              line: node.getStartLineNumber(),
              severity: 'HIGH',
              explanation: `Critical Type Safety Breach: "as any" assertion detected.`,
              suggestion: 'Avoid unsafe casting. If necessary, use "as unknown as Type" with a proper explanation.',
              analyzer: 'AnyUsageAnalyzer'
            });
          }
        });
      }
    });

    return issues;
  }
}
