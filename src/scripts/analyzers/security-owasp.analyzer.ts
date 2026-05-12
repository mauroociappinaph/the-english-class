import { execSync } from 'child_process';
import { Issue, Analyzer, AnalysisContext, AnalyzerResult } from '../types/analyzer.types';
import { AuditVulnerability } from '../types/security.types';

/**

 * SecurityOwaspAnalyzer: The SCA Guardian.
 * Audits project dependencies for known vulnerabilities (CVEs) using npm audit.
 */
export class SecurityOwaspAnalyzer implements Analyzer {
  public readonly name = 'Security OWASP SCA Analyzer';
  public readonly isGlobal = true;

  public analyze(context: AnalysisContext): AnalyzerResult {
    const startTime = Date.now();
    const issues: Issue[] = [];

    try {
      let auditOutput: string;
      try {
        auditOutput = execSync('npm audit --json', { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] });
      } catch (err: unknown) {
        const error = err as { stdout?: string };
        auditOutput = error.stdout || '{}';
      }

      const auditData = JSON.parse(auditOutput);
      const vulnerabilities: Record<string, AuditVulnerability> = auditData.vulnerabilities || {};

      for (const [pkgName, vuln] of Object.entries(vulnerabilities)) {
        const severity = this.mapSeverity(vuln.severity);
        
        issues.push({
          file: 'package.json',
          line: 1,
          severity,
          explanation: `SCA Vulnerability: Package "${pkgName}" has a ${vuln.severity} risk. [${vuln.via?.[0]?.title || 'CVE'}]`,
          suggestion: `Run "npm audit fix" or upgrade "${pkgName}" to a secure version. Details: ${vuln.via?.[0]?.url || 'N/A'}`,
          analyzer: this.name
        });
      }

    } catch (error) {
      console.error('Failed to run npm audit:', error);
    }

    return {
      analyzerName: this.name,
      issues,
      executionTimeMs: Date.now() - startTime
    };
  }

  private mapSeverity(npmSeverity: string): 'HIGH' | 'MEDIUM' | 'LOW' {
    switch (npmSeverity) {
      case 'critical':
      case 'high':
        return 'HIGH';
      case 'moderate':
        return 'MEDIUM';
      default:
        return 'LOW';
    }
  }
}
