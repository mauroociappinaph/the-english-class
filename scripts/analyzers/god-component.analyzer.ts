import { BaseAnalyzer } from './base.analyzer';
import { AnalysisContext, Issue, SourceFile, SyntaxKind } from '../types/analyzer.types';

export class GodComponentAnalyzer extends BaseAnalyzer {
  public readonly name = 'God Component Detector';
  public readonly isGlobal = false;

  protected runAnalysis(context: AnalysisContext): Issue[] | Promise<Issue[]> {
    const issues: Issue[] = [];
    const sourceFiles = context.changedFiles
      ? context.changedFiles.map(f => context.project.getSourceFile(f)).filter((sf): sf is SourceFile => !!sf)
      : context.project.getSourceFiles();

    for (const sourceFile of sourceFiles) {
      const filePath = sourceFile.getFilePath();
      
      // Ignore non-React files and node_modules
      if (!filePath.endsWith('.tsx') && !filePath.endsWith('.jsx')) continue;
      if (filePath.includes('node_modules')) continue;
      if (context.ignorePaths && context.ignorePaths.some(p => filePath.includes(p))) continue;

      const lineCount = sourceFile.getEndLineNumber();
      const thresholds = { maxLines: 250, maxHooks: 8 };
      let hasIssue = false;
      let explanationParts: string[] = [];
      let suggestionParts: string[] = [];

      // 1. Check Line Count
      if (lineCount > thresholds.maxLines) {
        hasIssue = true;
        explanationParts.push(`File is too large (${lineCount} lines)`);
        suggestionParts.push('Extract UI sections into Presentational components.');
      }

      // 2. Check Hooks complexity
      const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
      const hookCalls = callExpressions.filter(c => {
        const expression = c.getExpression();
        const text = expression.getText();
        return text.startsWith('use') && text.length > 3 && text[3] === text[3].toUpperCase();
      });

      if (hookCalls.length > thresholds.maxHooks) {
        hasIssue = true;
        explanationParts.push(`Excessive hook usage (${hookCalls.length} hooks)`);
        suggestionParts.push('Move complex logic into custom hooks.');
      }

      if (hasIssue) {
        issues.push({
          file: filePath,
          line: 1,
          severity: lineCount > 400 || hookCalls.length > 12 ? 'HIGH' : 'MEDIUM',
          explanation: `God Component Detected: ${explanationParts.join(' | ')}`,
          suggestion: `Refactor using Container/Presentational pattern. ${suggestionParts.join(' ')}`,
          analyzer: this.name
        });
      }
    }

    return issues;
  }
}
