import { Issue, Analyzer, AnalysisContext, AnalyzerResult } from '../types/analyzer.types';
import fs from 'fs';
import path from 'path';

/**
 * SecurityEnvLeakAnalyzer: The DevSecOps Guardian.
 * Detects accidental exposure of secrets and sensitive configuration.
 */
export class SecurityEnvLeakAnalyzer implements Analyzer {
  public readonly name = 'Security Env Leak Analyzer';
  public readonly isGlobal = true;

  private readonly projectRoot: string = process.cwd();

  private readonly PATTERNS = [
    { name: 'OpenAI API Key', regex: /sk-[a-zA-Z0-9]{48}/g },
    { name: 'Stripe Secret Key', regex: /sk_(live|test)_[0-9a-zA-Z]{24}/g },
    { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/g },
    { name: 'Database Connection String', regex: /(mongodb(?:\+srv)?|postgres(?:ql)?|mysql):\/\/[^:]+:[^@]+@[^/]+\/[^?\s]+/g },
    { name: 'Generic Secret Assignment', regex: /(password|secret|token|key|api_key|auth_token)\s*[:=]\s*['"`][a-zA-Z0-9_\-]{12,}['"`]/gi }
  ];

  public analyze(context: AnalysisContext): AnalyzerResult {
    const startTime = Date.now();
    const issues: Issue[] = [];

    // 1. Scan Source Files (using AST for better precision)
    context.project.getSourceFiles().forEach(sf => {
      const filePath = sf.getFilePath();
      if (filePath.includes('node_modules')) return;

      const content = sf.getFullText();
      this.scanContent(content, filePath, issues);

      // Special Next.js Check: NEXT_PUBLIC_ leakage
      this.checkNextPublicLeaks(content, filePath, issues);
    });

    // 2. Scan sensitive files not typically in the TS project (e.g., .env)
    const extraFiles = ['.env', '.env.local', '.env.production', '.env.example', 'Dockerfile', 'docker-compose.yml'];
    extraFiles.forEach(file => {
      const fullPath = path.join(this.projectRoot, file);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        this.scanContent(content, fullPath, issues);
      }
    });

    return {
      analyzerName: this.name,
      issues,
      executionTimeMs: Date.now() - startTime
    };
  }

  private scanContent(content: string, filePath: string, issues: Issue[]) {
    this.PATTERNS.forEach(pattern => {
      const matches = content.matchAll(pattern.regex);
      for (const match of matches) {
        // Avoid matching .env.example values (usually placeholders)
        if (filePath.endsWith('.env.example')) continue;

        const line = content.substring(0, match.index!).split('\n').length;
        const matchedText = match[0];
        const masked = this.maskSecret(matchedText);

        issues.push({
          file: filePath,
          line,
          severity: 'HIGH',
          explanation: `Security Leak: Detected potential ${pattern.name} hardcoded in source! (Value: ${masked})`,
          suggestion: 'Move this sensitive value to a .env file and ensure it is in .gitignore. Use a Secret Manager in production.',
          analyzer: 'SecurityEnvLeakAnalyzer'
        });
      }
    });
  }

  private checkNextPublicLeaks(content: string, filePath: string, issues: Issue[]) {
    // Check for NEXT_PUBLIC_ variables that might contain secrets based on their names
    const nextPublicRegex = /NEXT_PUBLIC_(SECRET|KEY|TOKEN|PASSWORD|AUTH|PRIVATE|PRISMA|DB)\s*[:=]/gi;
    const matches = content.matchAll(nextPublicRegex);
    
    for (const match of matches) {
      const line = content.substring(0, match.index!).split('\n').length;
      issues.push({
        file: filePath,
        line,
        severity: 'HIGH',
        explanation: `Insecure Public Variable: Variable "${match[0]}" is exposed to the browser via NEXT_PUBLIC_ prefix!`,
        suggestion: 'Remove the NEXT_PUBLIC_ prefix if this variable is only needed on the server side. Sensitive data should NEVER be public.',
        analyzer: 'SecurityEnvLeakAnalyzer'
      });
    }
  }

  private maskSecret(secret: string): string {
    if (secret.length <= 8) return '********';
    return `${secret.substring(0, 4)}...${secret.substring(secret.length - 4)}`;
  }
}
