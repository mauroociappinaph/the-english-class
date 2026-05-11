import path from 'path';
import { ParsedFile } from '../interfaces/parser';
import { AnalyzerIssue } from '../interfaces/analyzer';

/**
 * InterfaceLocationAnalyzer: Enforces structural discipline for data contracts.
 * Rule: Interfaces and Types must reside in designated /types, /interfaces or /domain directories.
 */
export class InterfaceLocationAnalyzer {
  private readonly ALLOWED_FOLDERS = ['types', 'interfaces', 'domain'];

  public analyze(parsedFile: ParsedFile): AnalyzerIssue[] {
    const issues: AnalyzerIssue[] = [];
    const filePath = parsedFile.filePath.toLowerCase();
    
    const isInAllowedFolder = this.ALLOWED_FOLDERS.some(folder => 
      filePath.includes(`${path.sep}${folder}${path.sep}`) || 
      filePath.endsWith(`${path.sep}${folder}.ts`) ||
      filePath.endsWith(`${path.sep}${folder}.tsx`)
    );

    if (isInAllowedFolder) return [];

    const violations = parsedFile.declarations.filter(d => 
      d.kind === 'Interface' || d.kind === 'TypeAlias'
    );

    violations.forEach(decl => {
      issues.push({
        file: parsedFile.filePath,
        line: decl.startLine,
        severity: 'MEDIUM',
        explanation: `Violation: ${decl.kind} "${decl.name}" found in a logic file.`,
        suggestion: `Move this contract to a dedicated file inside a "/types" or "/interfaces" directory to ensure SRP and modularity.`,
        analyzer: 'InterfaceLocationAnalyzer'
      });
    });

    return issues;
  }
}
