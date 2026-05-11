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
