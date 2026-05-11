import { ParsedFile, ParsedDeclaration } from '../interfaces/parser';
import { AnalyzerIssue } from '../interfaces/analyzer';

/**
 * NamingConventionAnalyzer: Enforces linguistic and stylistic discipline.
 * Ensuring consistency across interfaces, types, enums, hooks, and variables.
 */
export class NamingConventionAnalyzer {
  private readonly AMBIGUOUS_NAMES = ['data', 'item', 'temp', 'obj', 'list', 'val'];
  private readonly BOOLEAN_PREFIXES = ['is', 'has', 'can', 'should', 'must', 'did', 'will'];

  public analyze(parsedFile: ParsedFile): AnalyzerIssue[] {
    const issues: AnalyzerIssue[] = [];

    parsedFile.declarations.forEach(decl => {
      this.checkPascalCase(decl, issues, parsedFile.filePath);
      this.checkSuffixes(decl, issues, parsedFile.filePath);
      this.checkHooks(decl, issues, parsedFile.filePath);
      this.checkAmbiguousNames(decl, issues, parsedFile.filePath);
      // Note: Boolean check requires type info which is complex without full compiler symbols,
      // but we can check common patterns in variable names.
      this.checkBooleanPatterns(decl, issues, parsedFile.filePath);
    });

    return issues;
  }

  private checkPascalCase(decl: ParsedDeclaration, issues: AnalyzerIssue[], file: string) {
    if (['Interface', 'TypeAlias', 'Class', 'Enum'].includes(decl.kind)) {
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(decl.name)) {
        issues.push(this.createIssue(file, decl, 'PascalCase violation', `Rename to "${this.toPascalCase(decl.name)}"`));
      }
    }
  }

  private checkSuffixes(decl: ParsedDeclaration, issues: AnalyzerIssue[], file: string) {
    // Props suffix
    if (decl.kind === 'Interface' && decl.name.endsWith('Props') === false && file.includes('components')) {
      // If it's the main interface in a component file
      if (decl.name.includes(this.getFileBaseName(file))) {
        issues.push(this.createIssue(file, decl, 'Missing "Props" suffix', `Rename to "${decl.name}Props"`));
      }
    }

    // DTO suffix (if in a DTO directory or following pattern)
    if (decl.name.toLowerCase().includes('dto') && !decl.name.endsWith('Dto')) {
      issues.push(this.createIssue(file, decl, 'Incorrect DTO suffix', `Rename to "${decl.name.replace(/dto/i, '')}Dto"`));
    }

    // Enum suffix
    if (decl.kind === 'Enum' && !decl.name.endsWith('Enum')) {
      issues.push(this.createIssue(file, decl, 'Missing "Enum" suffix', `Rename to "${decl.name}Enum"`));
    }
  }

  private checkHooks(decl: ParsedDeclaration, issues: AnalyzerIssue[], file: string) {
    if ((decl.kind === 'Function' || decl.kind === 'Variable') && file.includes('use') && !decl.name.startsWith('use')) {
      // Only check if it seems like a hook file
      if (decl.isExported) {
         issues.push(this.createIssue(file, decl, 'Hook naming violation', `Hooks must start with "use". Suggestion: "use${this.toPascalCase(decl.name)}"`));
      }
    }
  }

  private checkAmbiguousNames(decl: ParsedDeclaration, issues: AnalyzerIssue[], file: string) {
    if (this.AMBIGUOUS_NAMES.includes(decl.name.toLowerCase())) {
      issues.push(this.createIssue(file, decl, 'Ambiguous naming', 'Use a more descriptive name that reflects the domain intent (e.g., "expressionData" instead of "data").'));
    }
  }

  private checkBooleanPatterns(decl: ParsedDeclaration, issues: AnalyzerIssue[], file: string) {
    // Check if variable name starts with common boolean markers but doesn't follow prefix rule
    // This is a heuristic since we don't have full type info here
    const lowerName = decl.name.toLowerCase();
    const isLikelyBoolean = lowerName.startsWith('loading') || lowerName.startsWith('active') || lowerName.endsWith('enabled') || lowerName.endsWith('visible');
    
    if (isLikelyBoolean && !this.BOOLEAN_PREFIXES.some(p => lowerName.startsWith(p))) {
       issues.push(this.createIssue(file, decl, 'Boolean naming violation', `Boolean variables should start with a prefix like "is", "has", or "can". Suggestion: "is${this.toPascalCase(decl.name)}"`));
    }
  }

  private createIssue(file: string, decl: ParsedDeclaration, explanation: string, suggestion: string): AnalyzerIssue {
    return {
      file,
      line: decl.startLine,
      severity: 'LOW',
      explanation: `${explanation}: "${decl.name}"`,
      suggestion
    };
  }

  private toPascalCase(str: string): string {
    return str.replace(/(^\w|-\w)/g, (m) => m.replace(/-/, "").toUpperCase());
  }

  private getFileBaseName(file: string): string {
    return path.basename(file, path.extname(file));
  }
}
