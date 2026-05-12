import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { logger } from '../logger';

export const FORBIDDEN_PATTERNS = [
  /\.DS_Store$/,
  /tsconfig\.tsbuildinfo$/,
  /^reports\//,
  /\.audit-report\.(html|json|md)$/,
  /\.audit-cache\.json$/
];

export const DIRECTORIES_TO_CLEAN = [
  '.next',
  'reports',
  'dist',
  'coverage'
];

export class Cleaner {
  /**
   * Checks if any of the provided files match forbidden patterns.
   * Returns the list of forbidden files found.
   */
  public static check(files: string[]): string[] {
    return files.filter(file => 
      FORBIDDEN_PATTERNS.some(pattern => pattern.test(file))
    );
  }

  /**
   * Physically removes forbidden files and directories.
   */
  public static sweep() {
    logger.info('🧹 Starting project cleanup...');
    let count = 0;

    // 1. Clean Directories
    DIRECTORIES_TO_CLEAN.forEach(dir => {
      const fullPath = path.join(process.cwd(), dir);
      if (fs.existsSync(fullPath)) {
        logger.info(`   🗑️  Removing directory: ${dir}`);
        fs.rmSync(fullPath, { recursive: true, force: true });
        count++;
      }
    });

    // 2. Find and remove specific forbidden files (like .DS_Store)
    try {
      // Using find for efficiency on Unix systems
      const filesToRemove = execSync('find . -name ".DS_Store" -o -name "tsconfig.tsbuildinfo"', { encoding: 'utf8' })
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0 && !f.includes('node_modules'));

      filesToRemove.forEach(file => {
        const fullPath = path.join(process.cwd(), file);
        if (fs.existsSync(fullPath)) {
          logger.info(`   🗑️  Removing file: ${file}`);
          fs.unlinkSync(fullPath);
          count++;
        }
      });
    } catch (e) {
      // Fallback if find fails
    }

    if (count > 0) {
      logger.info(`✨ Cleanup finished! ${count} items removed.`);
    } else {
      logger.info('✨ Project is already clean.');
    }
  }
}

// If run directly
if (require.main === module) {
  Cleaner.sweep();
}
