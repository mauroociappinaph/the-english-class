import path from 'path';
import { ParsedFile } from '../ts-parser';

/**
 * Standard Issue format for all architectural analyzers
 */
export interface AnalyzerIssue {
  file: string;
  line: number;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  explanation: string;
  suggestion: string;
}

/**
 * InterfaceLocationAnalyzer: Enforces structural discipline for data contracts.
 * Rule: Interfaces and Types must reside in designated /types, /interfaces or /domain directories.
 */
export class InterfaceLocationAnalyzer {
  // Configurable exceptions and allowed patterns
  private readonly ALLOWED_FOLDERS = ['types', 'interfaces', 'domain'];

  /**
   * Analyzes a parsed file for location violations
   */
  public analyze(parsedFile: ParsedFile): AnalyzerIssue[] {
    const issues: AnalyzerIssue[] = [];
    const filePath = parsedFile.filePath.toLowerCase();
    
    // 1. Check if the file is already in an allowed architectural layer
    const isInAllowedFolder = this.ALLOWED_FOLDERS.some(folder => 
      filePath.includes(`${path.sep}${folder}${path.sep}`) || 
      filePath.endsWith(`${path.sep}${folder}.ts`) ||
      filePath.endsWith(`${path.sep}${folder}.tsx`)
    );

    if (isInAllowedFolder) return [];

    // 2. Scan for Interface or TypeAlias declarations in unauthorized files
    const violations = parsedFile.declarations.filter(d => 
      d.kind === 'Interface' || d.kind === 'TypeAlias'
    );

    violations.forEach(decl => {
      issues.push({
        file: parsedFile.filePath,
        line: decl.startLine,
        severity: 'MEDIUM',
        explanation: `Violation: ${decl.kind} "${decl.name}" found in a logic file.`,
        suggestion: `Move this contract to a dedicated file inside a "/types" or "/interfaces" directory to ensure SRP and modularity.`
      });
    });

    return issues;
  }
}
