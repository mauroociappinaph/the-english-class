import { watch } from 'node:fs';
import { SemanticAuditSuite } from '../analyze-types';
import { logger } from '../logger';
import path from 'path';

/**
 * WatchMode: Real-time architectural sentinel.
 */
class WatchMode {
  private suite: SemanticAuditSuite;
  private projectRoot: string;
  private isRunning: boolean = false;
  private pendingFiles: Set<string> = new Set();
  private debounceTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.projectRoot = process.cwd();
    this.suite = new SemanticAuditSuite();
  }

  public async start() {
    console.clear();
    logger.info('👁️  Architecture Sentinel is watching for changes...');
    
    // Initial run
    await this.suite.run();

    const watchPath = path.join(this.projectRoot, 'src');
    
    watch(watchPath, { recursive: true }, (event, filename) => {
      if (!filename) return;
      if (!filename.endsWith('.ts') && !filename.endsWith('.tsx')) return;

      const fullPath = path.join(watchPath, filename);
      this.pendingFiles.add(fullPath);
      this.triggerAnalysis();
    });
  }

  private triggerAnalysis() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    
    this.debounceTimer = setTimeout(async () => {
      if (this.isRunning) {
        // If already running, try again in 100ms
        this.triggerAnalysis();
        return;
      }

      const files = Array.from(this.pendingFiles);
      this.pendingFiles.clear();

      if (files.length === 0) return;

      this.isRunning = true;
      console.clear();
      logger.info(`🔄 Changes detected in ${files.length} files. Re-analyzing...`);
      
      try {
        await this.suite.run(files);
      } catch (err) {
        logger.error('Analysis failed', err);
      } finally {
        this.isRunning = false;
        logger.info('👁️  Sentinel is watching...');
      }
    }, 200); // 200ms debounce
  }
}

const watcher = new WatchMode();
watcher.start();
