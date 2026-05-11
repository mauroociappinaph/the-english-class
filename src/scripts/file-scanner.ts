import fs from 'fs/promises';
import path from 'path';
import { Stats } from 'fs';
import { FileMetadata, ScannerConfig } from './types/scanner';


/**
 * Default enterprise-grade configuration
 */
const DEFAULT_CONFIG: Omit<ScannerConfig, 'rootPath'> = {
  ignorePaths: [
    'node_modules',
    '.next',
    'dist',
    'build',
    'coverage',
    '.git',
    '.atl',
    'openspec'
  ],
  extensions: ['.ts', '.tsx'],
  recursive: true
};

/**
 * FileScanner: Enterprise-grade utility for project analysis.
 */
export class FileScanner {
  private config: ScannerConfig;

  constructor(config: Partial<ScannerConfig> & { rootPath: string }) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config
    };
  }

  public async scan(): Promise<FileMetadata[]> {
    console.log(`\x1b[34m[FileScanner]\x1b[0m Starting scan at: ${this.config.rootPath}`);
    const start = performance.now();
    
    try {
      const results = await this.recursiveScan(this.config.rootPath);
      const end = performance.now();
      
      console.log(`\x1b[32m[FileScanner]\x1b[0m Scan completed. Found ${results.length} relevant files in ${Math.round(end - start)}ms.`);
      return results;
    } catch (error) {
      console.error(`\x1b[31m[FileScanner]\x1b[0m Fatal error during scan:`, error);
      throw error;
    }
  }

  private async recursiveScan(currentPath: string): Promise<FileMetadata[]> {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });
    const tasks: Promise<FileMetadata[] | FileMetadata | null>[] = [];

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      if (this.shouldIgnore(entry.name, fullPath)) continue;

      if (entry.isDirectory()) {
        if (this.config.recursive) {
          tasks.push(this.recursiveScan(fullPath));
        }
      } else {
        if (this.hasValidExtension(entry.name)) {
          tasks.push(this.extractMetadata(fullPath, entry.name));
        }
      }
    }

    const results = await Promise.all(tasks);
    return results.flat().filter((item): item is FileMetadata => item !== null);
  }

  private shouldIgnore(name: string, fullPath: string): boolean {
    return this.config.ignorePaths.some(ignore => 
      name === ignore || fullPath.includes(`${path.sep}${ignore}${path.sep}`)
    );
  }

  private hasValidExtension(name: string): boolean {
    return this.config.extensions.includes(path.extname(name));
  }

  private async extractMetadata(fullPath: string, name: string): Promise<FileMetadata> {
    const stats: Stats = await fs.stat(fullPath);
    const ext = path.extname(name);

    return {
      path: fullPath,
      name,
      size: stats.size,
      extension: ext,
      modifiedAt: stats.mtime,
      type: this.determineFileType(ext)
    };
  }

  private determineFileType(ext: string): FileMetadata['type'] {
    switch (ext) {
      case '.ts': return 'typescript';
      case '.tsx': return 'typescript-react';
      default: return 'other';
    }
  }
}
