import { Node } from 'ts-morph';
import { AnalysisContext, Issue, DeduplicationRules } from '../types/analyzer.types';
import { NormalizationEngine } from '../utils/normalization-engine';
import { BaseAnalyzer } from './base.analyzer';

export class DuplicateLogicAnalyzer extends BaseAnalyzer {
  name = 'Duplicate Logic Detector';
  isGlobal = true;

  protected runAnalysis(context: AnalysisContext): Issue[] {
    const startTime = Date.now();
    const issues: Issue[] = [];
    const hashes: Map<string, { file: string; line: number; text: string }[]> = new Map();

    const rules: DeduplicationRules = context.deduplicationRules;
    const { minLines } = rules;

    // Scan all source files
    context.project.getSourceFiles().forEach(sourceFile => {
      if (context.ignorePaths.some(p => sourceFile.getFilePath().includes(p))) return;

      sourceFile.forEachDescendant(node => {
        // We look for functions and blocks
        if (Node.isFunctionDeclaration(node) || Node.isArrowFunction(node) || Node.isMethodDeclaration(node)) {
          
          const lineCount = node.getEndLineNumber() - node.getStartLineNumber() + 1;
          if (lineCount < minLines) return;

          const hash = NormalizationEngine.getStructuralHash(node);
          if (!hash) return;

          const existing = hashes.get(hash) || [];
          existing.push({
            file: sourceFile.getFilePath(),
            line: node.getStartLineNumber(),
            text: node.getText().substring(0, 100) + '...'
          });
          hashes.set(hash, existing);
        }
      });
    });

    // Generate issues for duplicates
    hashes.forEach((instances, hash) => {
      if (instances.length > 1) {
        const primary = instances[0];
        const others = instances.slice(1);

        others.forEach(instance => {
          issues.push({
            file: instance.file,
            line: instance.line,
            severity: 'MEDIUM',
            analyzer: this.name,
            explanation: `Detected logic highly similar to ${primary.file}:${primary.line}. Structural Hash: ${hash}`,
            suggestion: `Consider extracting this logic into a shared helper or utility. Found ${instances.length} occurrences.`
          });
        });
      }
    });

    return issues;
  }
}
