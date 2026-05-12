import { Project, SourceFile } from 'ts-morph';

/**
 * Common utilities for project-wide AST analysis.
 */
export class ProjectUtils {
  /**
   * Filters source files to exclude node_modules and declaration files.
   */
  static getRelevantSourceFiles(project: Project): SourceFile[] {
    return project.getSourceFiles().filter(sf => {
      const path = sf.getFilePath();
      return !path.includes('node_modules') && 
             !path.endsWith('.d.ts') && 
             !path.endsWith('.d.mts') &&
             !path.endsWith('.d.cts');
    });
  }
}
