import { Node, Project, SourceFile, SyntaxKind, FunctionDeclaration, ArrowFunction, MethodDeclaration, RefactorResult, StructuralTemplate } from '../types/analyzer.types';
import { NormalizationEngine } from './normalization-engine';
import path from 'path';

/**
 * RefactorEngine: The automated architect.
 * Handles complex AST transformations for deduplication.
 */
export class RefactorEngine {
  constructor(private project: Project) {}

  public async refactorCluster(nodes: Node[]): Promise<RefactorResult> {
    if (nodes.length < 2) return { success: false, message: 'Need at least 2 nodes', filesChanged: [] };

    try {
      const templates = nodes.map(n => {
        const body = this.getFunctionBody(n);
        return NormalizationEngine.getTemplate(body || n);
      });

      const params = this.identifyParameters(templates);
      const helperName = `sharedHelper_${templates[0].hash.substring(0, 6).replace(/-/g, '_')}`;
      
      const files = new Set(nodes.map(n => n.getSourceFile().getFilePath()));
      const filesChanged: string[] = [];

      // 1. Create a "Template Source File" to generate the helper
      const firstBody = this.getFunctionBody(nodes[0]) || nodes[0];
      const tempFile = this.project.createSourceFile('temp_refactor.ts', firstBody.getText(), { overwrite: true });
      const tempNode = tempFile.getChildAtIndex(0);

      const sortedIndices = [...params].sort((a, b) => b - a);
      sortedIndices.forEach(idx => {
        const token = templates[0].tokens[idx];
        const relativePos = token.pos - firstBody.getStart();
        const nodeToReplace = tempFile.getDescendantAtPos(relativePos);
        if (nodeToReplace) {
          nodeToReplace.replaceWithText(`param${idx}`);
        }
      });

      let helperBody = tempFile.getText();
      if (Node.isBlock(firstBody)) {
        helperBody = helperBody.substring(1, helperBody.length - 1).trim();
      }
      this.project.removeSourceFile(tempFile);

      const sourceFile = nodes[0].getSourceFile();
      const paramNames = params.map(idx => `param${idx}`);

      // 2. Add helper
      sourceFile.addFunction({
        name: helperName,
        parameters: paramNames.map(name => ({ name, type: 'any' })), // V1 uses any
        statements: helperBody,
        isExported: false
      });

      // 3. Replace bodies
      nodes.forEach((node, i) => {
        const body = this.getFunctionBody(node);
        const args = params.map(idx => templates[i].tokens[idx].value);
        const call = `${helperName}(${args.join(', ')})`;
        
        if (body) {
          body.replaceWithText(`{ ${call}; }`);
        } else {
          node.replaceWithText(call);
        }
      });
      
      filesChanged.push(sourceFile.getFilePath());
      return { success: true, message: `Successfully extracted ${helperName}`, filesChanged };
    } catch (error: any) {
      return { success: false, message: error.message, filesChanged: [] };
    }
  }

  private getFunctionBody(node: Node): Node | undefined {
    if (Node.isFunctionDeclaration(node) || Node.isMethodDeclaration(node)) {
      return node.getBody();
    }
    if (Node.isArrowFunction(node)) {
      return node.getBody();
    }
    return undefined;
  }

  private identifyParameters(templates: StructuralTemplate[]): number[] {
    const paramIndices: number[] = [];
    const tokenCount = templates[0].tokens.length;

    for (let i = 0; i < tokenCount; i++) {
      const values = templates.map(t => t.tokens[i].value);
      if (new Set(values).size > 1) {
        paramIndices.push(i);
      }
    }
    return paramIndices;
  }
}
