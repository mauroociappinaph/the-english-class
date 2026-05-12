import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { Issue, CacheEntry } from '../types/analyzer.types';

export class AuditCache {

  private cachePath: string;
  private data: Record<string, CacheEntry> = {};

  constructor(projectRoot: string) {
    this.cachePath = path.join(projectRoot, '.audit-cache.json');
  }

  public load(): void {
    try {
      if (fs.existsSync(this.cachePath)) {
        const content = fs.readFileSync(this.cachePath, 'utf8');
        this.data = JSON.parse(content);
      }
    } catch (error) {
      console.warn('⚠️ Failed to load audit cache, starting fresh.');
      this.data = {};
    }
  }

  public save(): void {
    try {
      fs.writeFileSync(this.cachePath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('❌ Failed to save audit cache:', error);
    }
  }

  public getCachedIssues(filePath: string): Issue[] | null {
    try {
      const entry = this.data[filePath];
      if (!entry) return null;

      const stats = fs.statSync(filePath);
      if (entry.mtime === stats.mtimeMs) {
        return entry.issues;
      }

      // If mtime changed, we still check the hash as a fallback (content might be same)
      const currentHash = AuditCache.calculateHash(filePath);
      if (entry.hash === currentHash) {
        // Update mtime so next time we skip hash
        entry.mtime = stats.mtimeMs;
        return entry.issues;
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  public update(filePath: string, issues: Issue[]): void {
    const stats = fs.statSync(filePath);
    const hash = AuditCache.calculateHash(filePath);
    
    this.data[filePath] = {
      hash,
      issues,
      mtime: stats.mtimeMs
    };
  }

  public static calculateHash(filePath: string): string {
    const content = fs.readFileSync(filePath, 'utf8');
    return crypto.createHash('md5').update(content).digest('hex');
  }

  public clear(): void {
    this.data = {};
    if (fs.existsSync(this.cachePath)) {
      fs.unlinkSync(this.cachePath);
    }
  }
}
