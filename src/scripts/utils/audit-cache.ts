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

  public getCachedIssues(filePath: string, currentHash: string): Issue[] | null {
    const entry = this.data[filePath];
    if (entry && entry.hash === currentHash) {
      return entry.issues;
    }
    return null;
  }

  public update(filePath: string, hash: string, issues: Issue[]): void {
    this.data[filePath] = {
      hash,
      issues,
      mtime: fs.statSync(filePath).mtimeMs
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
