import { Node, Project, SourceFile, SyntaxKind, FunctionDeclaration, ArrowFunction, MethodDeclaration, RefactorResult, StructuralTemplate } from '../types/analyzer.types';
import { NormalizationEngine } from './normalization-engine';
import path from 'path';

/**
 * RefactorEngine: The automated architect.
 * Handles complex AST transformations for deduplication.
 * V2: Includes Free Variable Analysis for safe extraction.
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

      // 1. Identify Structural Parameters (where tokens differ)
      const structuralParams = this.identifyStructuralParameters(templates);
      
      // 2. Identify Shared Free Variables (defined outside ALL parent functions)
      const freeVars = this.identifySharedFreeVariables(nodes);
      
      const helperName = `sharedHelper_${templates[0].hash.substring(0, 6).replace(/-/g, '_')}`;
      const filesChanged: string[] = [];

      // 3. Create a "Template Source File" to generate the helper
      const firstBody = this.getFunctionBody(nodes[0]) || nodes[0];
      const tempFile = this.project.createSourceFile('temp_refactor.ts', firstBody.getText(), { overwrite: true });
      
      const sortedIndices = [...structuralParams].sort((a, b) => b - a);
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

      // 4. Prepare Parameter List
      const helperParams = [
        ...freeVars.map(v => ({ name: v, type: 'any' })),
        ...structuralParams.map(idx => ({ name: `param${idx}`, type: 'any' }))
      ];

      const sourceFile = nodes[0].getSourceFile();
      
      // 5. Add helper
      sourceFile.addFunction({
        name: helperName,
        parameters: helperParams,
        statements: helperBody,
        isExported: false
      });

      // 6. Replace bodies and update call sites
      nodes.forEach((node, i) => {
        const body = this.getFunctionBody(node);
        const args = [
          ...freeVars,
          ...structuralParams.map(idx => templates[i].tokens[idx].value)
        ];
        const call = `${helperName}(${args.join(', ')})`;
        
        if (body) {
          body.replaceWithText(`{ ${call}; }`);
        } else {
          node.replaceWithText(call);
        }
      });
      
      filesChanged.push(sourceFile.getFilePath());
      return { success: true, message: `Successfully extracted ${helperName} with ${freeVars.length} free variables`, filesChanged };
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

  private identifyStructuralParameters(templates: StructuralTemplate[]): number[] {
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

  private identifySharedFreeVariables(nodes: Node[]): string[] {
    // A shared free variable must be:
    // 1. Used in ALL nodes.
    // 2. Defined outside ALL nodes' parent function scope.
    
    const nodeVars = nodes.map(node => this.findFreeVariablesInNode(node));
    
    // Intersection of all sets
    const shared = nodeVars.reduce((acc, current) => {
      return new Set([...acc].filter(x => current.has(x)));
    });

    return Array.from(shared);
  }

  private findFreeVariablesInNode(node: Node): Set<string> {
    const freeVars = new Set<string>();
    const body = this.getFunctionBody(node) || node;
    const identifiers = body.getDescendantsOfKind(SyntaxKind.Identifier);
    
    const internalDecls = new Set<string>();
    body.getDescendants().forEach(desc => {
      if (Node.isVariableDeclaration(desc) || Node.isParameterDeclaration(desc) || Node.isFunctionDeclaration(desc)) {
        const name = (desc as any).getName?.();
        if (name) internalDecls.add(name);
      }
    });

    // Parent function parameters are NOT free variables, they are structural context
    const parentParams = new Set<string>();
    if (Node.isFunctionLikeDeclaration(node)) {
      node.getParameters().forEach(p => parentParams.add(p.getName()));
    }

    identifiers.forEach(id => {
      const name = id.getText();
      if (internalDecls.has(name) || parentParams.has(name)) return;

      const parent = id.getParent();
      if (Node.isPropertyAccessExpression(parent) && parent.getNameNode() === id) return;
      if (Node.isPropertyAssignment(parent) && parent.getNameNode() === id) return;

      const symbol = id.getSymbol();
      if (!symbol) {
        if (/^[a-z_][a-z0-9_]*$/i.test(name) && !['console', 'Math', 'JSON', 'Object', 'Array'].includes(name)) {
          freeVars.add(name);
        }
        return;
      }

      const declarations = symbol.getDeclarations();
      const isExternal = declarations.every(decl => {
        // Must be outside the PARENT function to be a truly "free" variable
        return decl.getStart() < node.getStart() || decl.getEnd() > node.getEnd();
      });

      if (isExternal) {
        freeVars.add(name);
      }
    });

    return freeVars;
  }
}
