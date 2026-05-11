import path from 'path';
import { Project, SourceFile } from 'ts-morph';

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
    } catch (error: any) {
      console.error(`\x1b[31m[TSParser]\x1b[0m Error parsing file ${filePath}:`, error.message);
      return null;
    }
  }

  private analyzeSourceFile(sourceFile: SourceFile): ParsedFile {
    const declarations: ParsedDeclaration[] = [];

    const addDecls = (nodes: any[], kind: string) => {
      nodes.forEach(node => {
        declarations.push({
          name: node.getName() || 'anonymous',
          kind,
          startLine: node.getStartLineNumber(),
          endLine: node.getEndLineNumber(),
          isExported: typeof node.isExported === 'function' ? node.isExported() : false
        });
      });
    };

    addDecls(sourceFile.getInterfaces(), 'Interface');
    addDecls(sourceFile.getTypeAliases(), 'TypeAlias');
    addDecls(sourceFile.getEnums(), 'Enum');
    addDecls(sourceFile.getClasses(), 'Class');
    addDecls(sourceFile.getFunctions(), 'Function');
    addDecls(sourceFile.getModules(), 'Namespace');
    
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
