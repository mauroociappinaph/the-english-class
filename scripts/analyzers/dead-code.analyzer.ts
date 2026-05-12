import { Node } from 'ts-morph';
import { Issue, Analyzer, AnalysisContext, AnalyzerResult } from '../types/analyzer.types';
import path from 'path';

/**
 * DeadCodeAnalyzer: The Cleanup Surgeon.
 * Detects unused declarations (types, functions, classes) and orphan files.
 */
export class DeadCodeAnalyzer implements Analyzer {
  public readonly name = 'Dead Code Analyzer';
  public readonly isGlobal = true;

  private readonly ENTRY_POINTS = [
    'src/app/page.tsx',
    'src/app/layout.tsx',
    'src/app/globals.css',
    'src/app/favicon.ico',
    'src/scripts/analyze-types.ts',
    'src/scripts/utils/watch-mode.ts',
    'src/scripts/utils/git-hooks.ts'
  ];

  public async analyze(context: AnalysisContext): Promise<AnalyzerResult> {
    const startTime = Date.now();
    const issues: Issue[] = [];
    const projectRoot = process.cwd();

    const sourceFiles = context.project.getSourceFiles();

    sourceFiles.forEach(sourceFile => {
      const filePath = sourceFile.getFilePath();
      const relativePath = path.relative(projectRoot, filePath);

      if (filePath.includes('node_modules') || filePath.includes('.next') || filePath.endsWith('.d.ts')) return;

      const node = context.graph.getNode(filePath);
      const isEntryPoint = this.ENTRY_POINTS.includes(relativePath) || relativePath.includes('src/app/') && (relativePath.endsWith('page.tsx') || relativePath.endsWith('layout.tsx') || relativePath.endsWith('route.ts'));
      
      if (node && node.ca === 0 && !isEntryPoint) {
        issues.push({
          file: filePath,
          line: 1,
          severity: 'HIGH',
          explanation: `Orphan Module: File "${relativePath}" is never imported by any other file in the project.`,
          suggestion: 'This file is dead code. Verify if it is needed or remove it safely.',
          analyzer: this.name
        });
        return;
      }

      const declarations = [
        ...sourceFile.getInterfaces(),
        ...sourceFile.getTypeAliases(),
        ...sourceFile.getEnums(),
        ...sourceFile.getClasses(),
        ...sourceFile.getFunctions(),
        ...sourceFile.getVariableDeclarations()
      ];

      declarations.forEach(decl => {
        if (!decl.isExported()) return;
        if (decl.isDefaultExport()) return;

        const reservedNames = ['metadata', 'viewport', 'generateMetadata', 'revalidate', 'dynamic', 'fetchCache'];
        
        let nameNode: Node | undefined;
        if (Node.isVariableDeclaration(decl) || Node.isFunctionDeclaration(decl) || Node.isClassDeclaration(decl) || Node.isInterfaceDeclaration(decl) || Node.isEnumDeclaration(decl) || Node.isTypeAliasDeclaration(decl)) {
          nameNode = decl.getNameNode();
        }

        if (!nameNode) return;
        const name = nameNode.getText();
        if (reservedNames.includes(name)) return;

        if (!Node.isIdentifier(nameNode)) return;

        const references = nameNode.findReferencesAsNodes();
        const externalReferences = references.filter((ref: Node) => {

          const refSourceFile = ref.getSourceFile();
          return refSourceFile.getFilePath() !== filePath;
        });

        if (externalReferences.length === 0) {
          issues.push({
            file: filePath,
            line: decl.getStartLineNumber(),
            severity: 'MEDIUM',
            explanation: `Dead Export: ${decl.getKindName()} "${name}" is exported but never used outside this module.`,
            suggestion: `Remove the export or the entire declaration if it's not used locally either.`,
            analyzer: this.name
          });
        }
      });
    });

    return {
      analyzerName: this.name,
      issues,
      executionTimeMs: Date.now() - startTime
    };
  }
}
