import { Issue, AuditStats, Report } from '../types/analyzer.types';


/**
 * JsonReporter: Specialist in machine-readable architectural data.
 * Designed for CI/CD integration and automated dashboard ingestion.
 */
export class JsonReporter {
  private readonly SCHEMA_VERSION = '1.1.0';

  public generate(stats: AuditStats, issues: Issue[]): string {
    const report: Report = {
      schemaVersion: this.SCHEMA_VERSION,
      metadata: {
        generatedAt: new Date().toISOString(),
        project: 'TheEnglishClass',
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
      },
      stats,
      results: [], // Placeholder for future per-analyzer granular results
      allIssues: this.sanitizeIssues(issues),
    };

    return JSON.stringify(report, null, 2);
  }

  /**
   * Ensures data is safe for serialization and consistent
   */
  private sanitizeIssues(issues: Issue[]): Issue[] {
    return issues.map(issue => ({
      ...issue,
      // Normalize paths to be relative to project root for portability in CI
      file: this.normalizePath(issue.file),
    }));
  }

  private normalizePath(filePath: string): string {
    const projectRoot = process.cwd();
    return filePath.replace(projectRoot, '').replace(/^\//, '');
  }
}
