import { Project, Node, SyntaxKind } from 'ts-morph';
import { AnalyzerIssue } from '../interfaces/analyzer';

/**
 * UnusedTypesAnalyzer: Specialist in dead code elimination.
 * Identifies interfaces, types, and enums that are declared but never consumed.
 */
export class UnusedTypesAnalyzer {
  // Files that act as entry points where exports are required by the framework
  private readonly ENTRY_POINTS = ['page.tsx', 'layout.tsx', 'actions.ts', 'route.ts', 'loading.tsx', 'error.tsx'];

  /**
   * Performs a global analysis of the project to find unused symbols
   * Note: This requires the project to be fully loaded via TSParser.loadProject()
   */
  public analyzeProject(project: Project): AnalyzerIssue[] {
    const issues: AnalyzerIssue[] = [];
    const sourceFiles = project.getSourceFiles();

    sourceFiles.forEach(sourceFile => {
      const filePath = sourceFile.getFilePath();
      const fileName = sourceFile.getBaseName();
      
      // Skip node_modules and entry points
      if (filePath.includes('node_modules') || this.ENTRY_POINTS.includes(fileName)) return;


      // 1. Check Interfaces
      sourceFile.getInterfaces().forEach(node => {
        if (this.isUnused(node)) {
          issues.push(this.createIssue(sourceFile.getFilePath(), node, 'Unused Interface'));
        }
      });

      // 2. Check Type Aliases
      sourceFile.getTypeAliases().forEach(node => {
        if (this.isUnused(node)) {
          issues.push(this.createIssue(sourceFile.getFilePath(), node, 'Unused Type Alias'));
        }
      });

      // 3. Check Enums
      sourceFile.getEnums().forEach(node => {
        if (this.isUnused(node)) {
          issues.push(this.createIssue(sourceFile.getFilePath(), node, 'Unused Enum'));
        }
      });
    });

    return issues;
  }

  /**
   * Heuristic to determine if a node is unused in the entire project
   */
  private isUnused(node: Node): boolean {
    // If it's not exported, check local references
    // If it is exported, we need to check if anything imports it
    
    // ts-morph helper to find all references
    const references = (node as any).findReferencesAsNodes?.() || [];
    
    // If there are zero references, it's definitely unused
    if (references.length === 0) return true;

    // If there are references, check if they are all within the same declaration
    // (e.g., self-referencing types or just the declaration itself)
    const externalReferences = references.filter((ref: Node) => {
      const nodeStart = node.getStart();
      const nodeEnd = node.getEnd();
      const refStart = ref.getStart();
      const refEnd = ref.getEnd();
      
      // If the reference is outside the start/end of the declaration, it's an external usage
      return refStart < nodeStart || refEnd > nodeEnd;
    });


    return externalReferences.length === 0;
  }

  private createIssue(file: string, node: Node, type: string): AnalyzerIssue {
    const name = (node as any).getName?.() || 'anonymous';
    return {
      file,
      line: node.getStartLineNumber(),
      severity: 'LOW',
      explanation: `${type} "${name}" is declared but never used in the project.`,
      suggestion: `Remove the unused ${type.toLowerCase()} or ensure it is correctly imported and used.`
    };
  }
}
