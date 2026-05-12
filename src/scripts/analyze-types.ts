import path from 'path';
import { FileScanner } from './file-scanner';
import { TSParser } from './ts-parser';
import { execSync } from 'child_process';
import { ReportGenerator } from './reporting/report-generator';
import { auditConfig } from './config';
import { Issue, Analyzer, AnalysisContext, AuditStats, SummaryStats } from './types/analyzer.types';
import { logger } from './logger';
import { AuditCache } from './utils/audit-cache';
import { DependencyGraph } from './utils/dependency-graph';

// Analyzers
import { InterfaceLocationAnalyzer } from './analyzers/interface-location.analyzer';
import { NamingConventionAnalyzer } from './analyzers/naming-convention.analyzer';
import { getProjectAnalyzers } from './analyzers/registry';
import { QualityScoreCalculator } from './reporting/quality-score';

/**
 * SemanticAuditSuite: The orchestrator of architectural governance.
 */

export class SemanticAuditSuite {
  private readonly projectRoot: string;
  private readonly scanner: FileScanner;
  private readonly parser: TSParser;
  private readonly reporter: ReportGenerator;
  private readonly cache: AuditCache;

  constructor() {
    this.projectRoot = process.cwd();
    this.scanner = new FileScanner({ rootPath: this.projectRoot });
    this.parser = new TSParser();
    this.reporter = new ReportGenerator();
    this.cache = new AuditCache(this.projectRoot);
  }

  public async run(filesToRefresh?: string[]): Promise<Issue[]> {
    const startTime = Date.now();
    
    // 0. Type Check Gate
    const typeErrors = this.runTypeCheck();
    if (typeErrors.length > 0) {
      logger.error('❌ Type Check failed. Project has compilation errors.');
    }

    try {
      // 1. Scan & Refresh
      if (filesToRefresh) {
        filesToRefresh.forEach(fp => {
          const sf = this.parser.project.getSourceFile(fp);
          if (sf) sf.refreshFromFileSystemSync();
          else this.parser.project.addSourceFileAtPath(fp);
        });
      } else {
        const allFiles = await this.scanner.scan();
        const filePaths = allFiles
          .filter(f => {
            const relativePath = path.relative(this.projectRoot, f.path);
            return !auditConfig.ignorePaths.some(ignore => relativePath.startsWith(ignore));
          })
          .map(f => f.path);
        
        this.parser.loadProject(filePaths);
      }

      const filePaths = this.parser.project.getSourceFiles()
        .map(sf => sf.getFilePath())
        .filter(fp => {
          return !fp.includes('node_modules') && !fp.endsWith('.d.ts');
        });
      
      this.cache.load();

      // 3. Detect Changed Files
      const changedFiles: string[] = filesToRefresh || [];
      const cachedIssues: Issue[] = [];

      filePaths.forEach(fp => {
        if (changedFiles.includes(fp)) return;
        
        const hash = AuditCache.calculateHash(fp);
        const cached = this.cache.getCachedIssues(fp, hash);
        if (cached) cachedIssues.push(...cached);
        else changedFiles.push(fp);
      });

      if (!filesToRefresh) {
        logger.info(`🔄 Initial Analysis: ${changedFiles.length} files changed, ${filePaths.length - changedFiles.length} reused from cache.`);
      }

      const context: AnalysisContext = {
        project: this.parser.project,
        ignorePaths: auditConfig.ignorePaths,
        giantInterfaceRules: auditConfig.rules.giantInterfaces,
        anyUsageRules: auditConfig.rules.anyUsage,
        circularDepRules: auditConfig.rules.circularDeps,
        startTime,
        changedFiles: changedFiles.length > 0 ? changedFiles : undefined,
        graph: new DependencyGraph(this.projectRoot)
      };

      context.graph.build(this.parser.project);

      // 4. Execute Modern Analyzers
      const allIssues: Issue[] = [...cachedIssues, ...typeErrors];
      const projectAnalyzers: Analyzer[] = getProjectAnalyzers();
      const newIssuesByFile = new Map<string, Issue[]>();

      projectAnalyzers.forEach(analyzer => {
        if (analyzer.isGlobal || changedFiles.length > 0) {
          const result = analyzer.analyze(context);
          
          if (analyzer.isGlobal) {
            allIssues.push(...result.issues);
          } else {
            result.issues.forEach(issue => {
              const fileIssues = newIssuesByFile.get(issue.file) || [];
              fileIssues.push(issue);
              newIssuesByFile.set(issue.file, fileIssues);
            });
          }
        }
      });

      // File-by-File Analyzers (Legacy Format)
      const locationAnalyzer = new InterfaceLocationAnalyzer();
      const namingAnalyzer = new NamingConventionAnalyzer();

      changedFiles.forEach(fp => {
        const parsedFile = this.parser.parseFile(fp);
        if (!parsedFile) return;

        const fileIssues: Issue[] = [];
        
        const locIssues = locationAnalyzer.analyze(parsedFile);
        const namingIssues = namingAnalyzer.analyze(parsedFile);

        // Map Legacy Issues to Modern Issue Format
        const mapToIssues = (legacy: Issue[]): Issue[] => legacy.map(l => ({
          ...l,
          file: fp,
          analyzer: l.analyzer || 'LegacyAnalyzer'
        }));

        fileIssues.push(...mapToIssues(locIssues));
        fileIssues.push(...mapToIssues(namingIssues));

        newIssuesByFile.set(fp, fileIssues);
      });

      // 5. Update Cache
      newIssuesByFile.forEach((issues, fp) => {
        const hash = AuditCache.calculateHash(fp);
        this.cache.update(fp, hash, issues);
        allIssues.push(...issues);
      });

      this.cache.save();

      // 6. Final Report
      const stats = this.calculateSummaryStats(allIssues, startTime);
      
      this.reporter.addIssues(allIssues);
      this.reporter.generate();
      
      this.printSummary(stats);

      return allIssues;
    } catch (error) {
      logger.error('❌ Global Audit Error:', error);
      throw error;
    }
  }

  private calculateSummaryStats(issues: Issue[], startTime: number): SummaryStats {
    const criticals = issues.filter(i => i.severity === 'HIGH').length;
    const warnings = issues.filter(i => i.severity === 'MEDIUM').length;
    const score = new QualityScoreCalculator().calculate(issues).total;

    return {
      score,
      total: issues.length,
      criticals,
      warnings,
      durationMs: Date.now() - startTime
    };
  }

  private printSummary(stats: SummaryStats): void {
    console.log('\n' + '='.repeat(50));
    console.log(`📊 AUDIT SUMMARY (${stats.durationMs}ms)`);
    console.log('='.repeat(50));
    console.log(`Quality Score:   ${stats.score}/100`);
    console.log(`Total Issues:    ${stats.total}`);
    console.log(`Critical (HIGH): ${stats.criticals}`);
    console.log(`Warnings (MED):  ${stats.warnings}`);
    console.log('='.repeat(50) + '\n');
  }

  private runTypeCheck(): Issue[] {
    try {
      execSync('npx tsc --noEmit', { stdio: 'ignore' });
      return [];
    } catch (error) {
      return [{
        file: 'Project Root',
        line: 1,
        severity: 'HIGH',
        explanation: 'Critical Type Error: The project does not compile. Semantic analysis may be inaccurate.',
        suggestion: 'Run "npx tsc --noEmit" to identify and fix compilation errors.',
        analyzer: 'TypeCheckGate'
      }];
    }
  }
}

if (require.main === module) {
  const suite = new SemanticAuditSuite();
  suite.run().catch(() => process.exit(1));
}
