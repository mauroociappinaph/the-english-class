import path from 'path';
import { Project, SourceFile, Node } from 'ts-morph';

import { ParsedDeclaration, ParsedFile } from './interfaces/parser';

export class TSParser {
  public project: Project;

  constructor() {
    this.project = new Project({
      tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
      skipAddingFilesFromTsConfig: true
    });
  }

  /**
   * Load all relevant files into the project context for cross-file analysis
   */
  public loadProject(files: string[]) {
    this.project.addSourceFilesAtPaths(files);
    this.project.resolveSourceFileDependencies();
  }

  public parseFile(filePath: string): ParsedFile | null {
    try {
      const sourceFile = this.project.addSourceFileAtPath(filePath);
      return this.analyzeSourceFile(sourceFile);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`\x1b[31m[TSParser]\x1b[0m Error parsing file ${filePath}:`, msg);
      return null;
    }
  }

  private analyzeSourceFile(sourceFile: SourceFile): ParsedFile {
    const declarations: ParsedDeclaration[] = [];

    const addDecls = (nodes: Node[], kind: string) => {
      nodes.forEach(node => {
        // We use safe duck typing for ts-morph nodes
      const namedNode = node as Node & { getName?: () => string; isExported?: () => boolean };
      declarations.push({
        name: typeof namedNode.getName === 'function' ? namedNode.getName() : 'anonymous',
        kind,
        startLine: node.getStartLineNumber(),
        endLine: node.getEndLineNumber(),
        isExported: typeof namedNode.isExported === 'function' ? namedNode.isExported() : false
      });

      });
    };

    addDecls(sourceFile.getInterfaces() as unknown as Node[], 'Interface');
    addDecls(sourceFile.getTypeAliases() as unknown as Node[], 'TypeAlias');
    addDecls(sourceFile.getEnums() as unknown as Node[], 'Enum');
    addDecls(sourceFile.getClasses() as unknown as Node[], 'Class');
    addDecls(sourceFile.getFunctions() as unknown as Node[], 'Function');
    addDecls(sourceFile.getModules() as unknown as Node[], 'Namespace');
    
    // Extract Variables (for booleans and ambiguous names)
    sourceFile.getVariableDeclarations().forEach(node => {
      declarations.push({
        name: node.getName(),
        kind: 'Variable',
        startLine: node.getStartLineNumber(),
        endLine: node.getEndLineNumber(),
        isExported: node.getVariableStatement()?.isExported() || false
      });
    });

    const imports = sourceFile.getImportDeclarations().map(imp => ({
      module: imp.getModuleSpecifierValue(),
      named: imp.getNamedImports().map(ni => ni.getName())
    }));

    return {
      filePath: sourceFile.getFilePath(),
      declarations,
      imports
    };
  }

  public clearCache() {
    this.project.getSourceFiles().forEach(sf => this.project.removeSourceFile(sf));
  }
}
