import fs from 'fs/promises';
import path from 'path';
import { Stats } from 'fs';

/**
 * Metadata contract for scanned files
 */
export interface FileMetadata {
  path: string;
  name: string;
  size: number;
  extension: string;
  modifiedAt: Date;
  type: 'typescript' | 'typescript-react' | 'other';
}

/**
 * Configuration for the FileScanner
 */
export interface ScannerConfig {
  rootPath: string;
  ignorePaths: string[];
  extensions: string[];
  recursive: boolean;
}

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
 * Follows SRP (Single Responsibility Principle) and is prepared for AST extensions.
 */
export class FileScanner {
  private config: ScannerConfig;

  constructor(config: Partial<ScannerConfig> & { rootPath: string }) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config
    };
  }

  /**
   * Main entry point for scanning
   */
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

  /**
   * Recursive implementation with performance optimization
   */
  private async recursiveScan(currentPath: string): Promise<FileMetadata[]> {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });
    const tasks: Promise<FileMetadata[] | FileMetadata | null>[] = [];

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      // Check if path should be ignored
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
    // Flatten and filter nulls
    return results.flat().filter((item): item is FileMetadata => item !== null);
  }

  /**
   * Logical check for ignore patterns (SRP)
   */
  private shouldIgnore(name: string, fullPath: string): boolean {
    return this.config.ignorePaths.some(ignore => 
      name === ignore || fullPath.includes(`${path.sep}${ignore}${path.sep}`)
    );
  }

  /**
   * Extension filtering
   */
  private hasValidExtension(name: string): boolean {
    return this.config.extensions.includes(path.extname(name));
  }

  /**
   * Metadata extraction using fs.stat
   */
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

  /**
   * Mapping extension to logical types
   */
  private determineFileType(ext: string): FileMetadata['type'] {
    switch (ext) {
      case '.ts': return 'typescript';
      case '.tsx': return 'typescript-react';
      default: return 'other';
    }
  }
}

// Example usage if run directly (via tsx)
if (require.main === module) {
  const scanner = new FileScanner({ rootPath: path.join(process.cwd(), 'src') });
  scanner.scan().then(files => {
    // console.log(files);
  });
}
