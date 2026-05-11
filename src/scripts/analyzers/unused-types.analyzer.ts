import { Project, SyntaxKind } from 'ts-morph';
import { Issue, Analyzer, AnalysisContext, AnalyzerResult } from '../types/analyzer.types';

/**
 * UnusedTypesAnalyzer: Clean Code Guardian.
 * Detects exported types, interfaces, and enums that are never imported elsewhere.
 */
export class UnusedTypesAnalyzer implements Analyzer {
  public readonly name = 'Dead Type Analyzer';

  public analyze(context: AnalysisContext): AnalyzerResult {
    const startTime = Date.now();
    const issues = this.analyzeProject(context.project);
    
    return {
      analyzerName: this.name,
      issues,
      executionTimeMs: Date.now() - startTime
    };
  }

  public analyzeProject(project: Project): Issue[] {
    const issues: Issue[] = [];
    const sourceFiles = project.getSourceFiles();

    sourceFiles.forEach(sourceFile => {
      const filePath = sourceFile.getFilePath();
      // Skip generated or external files
      if (filePath.includes('node_modules') || filePath.includes('.next') || filePath.endsWith('.d.ts')) return;

      const declarations = [
        ...sourceFile.getInterfaces(),
        ...sourceFile.getTypeAliases(),
        ...sourceFile.getEnums(),
        ...sourceFile.getClasses()
      ];

      declarations.forEach(decl => {
        // Skip if not exported or if it's a known entry point
        if (!decl.isExported() || decl.getName() === 'default') return;

        const nameNode = decl.getNameNode();
        if (!nameNode) return;

        const name = nameNode.getText();

        // Use ts-morph's native reference finder (more accurate and faster)
        const references = nameNode.findReferencesAsNodes();

        // If the only reference is the declaration itself, it's unused
        // (ts-morph sometimes returns the name node itself as a reference)
        const externalReferences = references.filter(ref => ref !== nameNode);

        if (externalReferences.length === 0) {
          issues.push({
            file: filePath,
            line: decl.getStartLineNumber(),
            severity: 'MEDIUM',
            explanation: `Unused ${decl.getKindName()} "${name}" is declared but never used in the project.`,
            suggestion: `Remove the unused ${decl.getKindName().toLowerCase()} or ensure it is correctly imported and used.`,
            analyzer: 'UnusedTypesAnalyzer'
          });
        }
      });
    });

    return issues;
  }
}
