import { Project, Node, SyntaxKind } from 'ts-morph';
import { AnalyzerIssue } from '../interfaces/analyzer';

/**
 * AnyUsageAnalyzer: Specialist in Type Safety enforcement.
 * Detects and discourages the use of 'any', promoting 'unknown' or strong typing.
 */
export class AnyUsageAnalyzer {
  
  public analyzeProject(project: Project): AnalyzerIssue[] {
    const issues: AnalyzerIssue[] = [];
    const sourceFiles = project.getSourceFiles();

    sourceFiles.forEach(sourceFile => {
      const filePath = sourceFile.getFilePath();
      if (filePath.includes('node_modules')) return;

      // 1. Find all explicit 'any' type references
      sourceFile.getDescendantsOfKind(SyntaxKind.AnyKeyword).forEach(node => {
        // Avoid duplicates if multiple nodes point to the same usage
        issues.push(this.createIssue(filePath, node, 'EXPLICIT_ANY'));
      });

      // 2. Find Type Assertions using 'any' (as any)
      sourceFile.getDescendantsOfKind(SyntaxKind.AsExpression).forEach(node => {
        if (node.getType().getText() === 'any') {
          issues.push(this.createIssue(filePath, node, 'TYPE_ASSERTION_ANY'));
        }
      });
    });

    return issues;
  }

  private createIssue(file: string, node: Node, type: 'EXPLICIT_ANY' | 'TYPE_ASSERTION_ANY'): AnalyzerIssue {
    const parent = node.getParent();
    const context = parent ? parent.getText().substring(0, 40) + '...' : 'unknown';
    
    let severity: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
    let explanation = `Found usage of "any" in: ${node.getText().substring(0, 50)}...`;
    let suggestion = 'Replace with "unknown", a generic, or a specific interface.';

    if (type === 'TYPE_ASSERTION_ANY') {
      severity = 'HIGH';
      explanation = `Dangerous type assertion "as any" detected: ${context}`;
      suggestion = 'Avoid "as any". Refactor code to use proper type guards or intermediate interfaces.';
    }

    return {
      file,
      line: node.getStartLineNumber(),
      severity,
      explanation,
      suggestion,
      analyzer: 'AnyUsageAnalyzer'
    };

  }
}
