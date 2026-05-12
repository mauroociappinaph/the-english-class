import { Node, Project, SourceFile, SyntaxKind, FunctionDeclaration, ArrowFunction, MethodDeclaration, RefactorResult, StructuralTemplate } from '../types/analyzer.types';
import { NormalizationEngine } from './normalization-engine';
import path from 'path';

/**
 * RefactorEngine: The automated architect.
 * Handles complex AST transformations for deduplication.
 * V3: Cross-file extraction and automatic import management.
 */
export class RefactorEngine {
  private readonly SHARED_HELPERS_REL_PATH = 'src/scripts/generated/shared-helpers';

  constructor(private project: Project) {}

  public async refactorCluster(nodes: Node[]): Promise<RefactorResult> {
    if (nodes.length < 2) return { success: false, message: 'Need at least 2 nodes', filesChanged: [] };

    try {
      const templates = nodes.map(n => {
        const body = this.getFunctionBody(n);
        return NormalizationEngine.getTemplate(body || n);
      });

      const structuralParams = this.identifyStructuralParameters(templates);
      const freeVars = this.identifySharedFreeVariables(nodes);
      
      const helperName = `sharedHelper_${templates[0].hash.substring(0, 6).replace(/-/g, '_')}`;
      const filesChanged = new Set<string>();

      // 1. Create a "Template Source File" to generate the helper
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

      // 2. Prepare Parameter List
      const helperParams = [
        ...freeVars.map(v => ({ name: v, type: 'any' })),
        ...structuralParams.map(idx => ({ name: `param${idx}`, type: 'any' }))
      ];

      // 3. Add helper to SHARED file (V3)
      const sharedFile = this.getSharedHelpersFile();
      if (!sharedFile.getFunction(helperName)) {
        sharedFile.addFunction({
          name: helperName,
          parameters: helperParams,
          statements: helperBody,
          isExported: true
        });
        filesChanged.add(sharedFile.getFilePath());
      }

      // 4. Replace bodies and update call sites in original files
      nodes.forEach((node, i) => {
        const sourceFile = node.getSourceFile();
        const body = this.getFunctionBody(node);
        const args = [
          ...freeVars,
          ...structuralParams.map(idx => templates[i].tokens[idx].value)
        ];
        const call = `${helperName}(${args.join(', ')})`;
        
        // Update imports
        this.addImportToSourceFile(sourceFile, helperName);
        
        if (body) {
          body.replaceWithText(`{ ${call}; }`);
        } else {
          node.replaceWithText(call);
        }
        
        filesChanged.add(sourceFile.getFilePath());
      });
      
      return { 
        success: true, 
        message: `Successfully extracted ${helperName} to shared library.`, 
        filesChanged: Array.from(filesChanged) 
      };
    } catch (error: any) {
      return { success: false, message: error.message, filesChanged: [] };
    }
  }

  private getSharedHelpersFile(): SourceFile {
    const fullPath = path.join(process.cwd(), this.SHARED_HELPERS_REL_PATH + '.ts');
    return this.project.getSourceFile(fullPath) || this.project.addSourceFileAtPath(fullPath);
  }

  private addImportToSourceFile(sourceFile: SourceFile, helperName: string) {
    const sharedPath = path.join(process.cwd(), this.SHARED_HELPERS_REL_PATH);
    if (sourceFile.getFilePath() === sharedPath + '.ts') return;

    const sourceDir = path.dirname(sourceFile.getFilePath());
    let relativePath = path.relative(sourceDir, sharedPath);
    
    if (!relativePath.startsWith('.')) {
      relativePath = './' + relativePath;
    }

    const existingImport = sourceFile.getImportDeclaration(d => d.getModuleSpecifierValue() === relativePath);
    if (existingImport) {
      if (!existingImport.getNamedImports().some(n => n.getName() === helperName)) {
        existingImport.addNamedImport(helperName);
      }
    } else {
      sourceFile.addImportDeclaration({
        namedImports: [helperName],
        moduleSpecifier: relativePath
      });
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
    const nodeVars = nodes.map(node => this.findFreeVariablesInNode(node));
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
        return decl.getStart() < node.getStart() || decl.getEnd() > node.getEnd();
      });

      if (isExternal) {
        freeVars.add(name);
      }
    });

    return freeVars;
  }
}
