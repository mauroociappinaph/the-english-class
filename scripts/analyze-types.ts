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
import { IssueUtils } from './utils/issue-utils';

// Analyzers
import { InterfaceLocationAnalyzer } from './analyzers/interface-location.analyzer';
import { NamingConventionAnalyzer } from './analyzers/naming-convention.analyzer';
import { getProjectAnalyzers } from './analyzers/registry';
import { QualityScoreCalculator } from './reporting/quality-score';
import { UI, COLORS } from './utils/ui';

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

  /**
   * Runs the audit.
   * @param filesToRefresh If provided, performs an incremental audit on these files only.
   */
  public async run(filesToRefresh?: string[]): Promise<Issue[]> {
    const startTime = Date.now();
    this.reporter.clearIssues();
    
    // 0. Type Check Gate
    // In pre-commit (incremental), we might want to skip this if it's too slow, 
    // but for now we keep it for safety.
    const typeErrors = this.runTypeCheck();
    if (typeErrors.length > 0) {
      logger.error('❌ Type Check failed. Project has compilation errors.');
    }

    try {
      // 1. Smart Scan & Load
      const allFiles = await this.scanner.scan(filesToRefresh);
      const filePaths = allFiles
        .filter(f => {
          const relativePath = path.relative(this.projectRoot, f.path);
          return !auditConfig.ignorePaths.some(ignore => relativePath.startsWith(ignore));
        })
        .map(f => f.path);
      
      this.parser.loadProject(filePaths);

      const loadedFilePaths = this.parser.project.getSourceFiles()
        .map(sf => sf.getFilePath())
        .filter(fp => !fp.includes('node_modules') && !fp.endsWith('.d.ts'));
      
      this.cache.load();

      // 3. Detect Changed Files
      const changedFiles: string[] = filesToRefresh || [];
      const cachedIssues: Issue[] = [];

      loadedFilePaths.forEach(fp => {
        // If we forced these files (e.g. staged), we MUST re-analyze them.
        if (filesToRefresh?.includes(fp)) {
          changedFiles.push(fp);
          return;
        }
        
        const hash = AuditCache.calculateHash(fp);
        const cached = this.cache.getCachedIssues(fp, hash);
        if (cached) cachedIssues.push(...cached);
        else changedFiles.push(fp);
      });

      if (!filesToRefresh) {
        logger.info(`🔄 Full Analysis: ${changedFiles.length} files changed/new, ${loadedFilePaths.length - changedFiles.length} reused from cache.`);
      } else {
        logger.info(`🚀 Incremental Analysis: Focusing on ${changedFiles.length} files.`);
      }

      const context: AnalysisContext = {
        project: this.parser.project,
        ignorePaths: auditConfig.ignorePaths,
        giantInterfaceRules: auditConfig.rules.giantInterfaces,
        anyUsageRules: auditConfig.rules.anyUsage,
        circularDepRules: auditConfig.rules.circularDeps,
        deduplicationRules: auditConfig.rules.deduplication,
        startTime,
        changedFiles: changedFiles.length > 0 ? changedFiles : loadedFilePaths,
        graph: new DependencyGraph(this.projectRoot)
      };

      context.graph.build(this.parser.project);

      // 4. Execute Modern Analyzers
      const allIssues: Issue[] = [...cachedIssues, ...typeErrors];
      const projectAnalyzers: Analyzer[] = getProjectAnalyzers();
      const newIssuesByFile = new Map<string, Issue[]>();

      projectAnalyzers.forEach(analyzer => {
        // Run global analyzers or if there are changed files for local analyzers
        if (analyzer.isGlobal || (context.changedFiles && context.changedFiles.length > 0)) {
          const result = analyzer.analyze(context);
          
          if (analyzer.isGlobal) {
            // Global analyzers return issues for many files or the project
            allIssues.push(...result.issues);
          } else {
            const grouped = IssueUtils.groupByFile(result.issues);
            grouped.forEach((issues, file) => {
              const existing = newIssuesByFile.get(file) || [];
              newIssuesByFile.set(file, [...existing, ...issues]);
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

        const mapToIssues = (legacy: Issue[]): Issue[] => legacy.map(l => ({
          ...l,
          file: fp,
          analyzer: l.analyzer || 'LegacyAnalyzer'
        }));

        fileIssues.push(...mapToIssues(locIssues));
        fileIssues.push(...mapToIssues(namingIssues));

        const existing = newIssuesByFile.get(fp) || [];
        newIssuesByFile.set(fp, [...existing, ...fileIssues]);
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
    const bold = COLORS.BOLD;
    const reset = COLORS.RESET;
    const gray = COLORS.GRAY;

    console.log(`\n  ${bold}${gray}┌──────────────────────────────────────────────────┐${reset}`);
    console.log(`  ${bold}${gray}│${reset}            ${bold}ARCHITECTURAL HEALTH CHECK${reset}            ${bold}${gray}│${reset}`);
    console.log(`  ${bold}${gray}├──────────────────────────────────────────────────┤${reset}`);
    
    const qualityBar = UI.progressBar(stats.score, 100, 24);
    console.log(`  ${bold}${gray}│${reset}  ${bold}Quality:${reset}  ${qualityBar}${' '.repeat(13 - stats.score.toString().length)}${bold}${gray}│${reset}`);
    
    console.log(`  ${bold}${gray}├──────────────────────────────────────────────────┤${reset}`);
    
    const critColor = stats.criticals > 0 ? COLORS.ERROR : COLORS.SUCCESS;
    const warnColor = stats.warnings > 0 ? COLORS.WARN : COLORS.SUCCESS;

    console.log(`  ${bold}${gray}│${reset}  ${gray}Issues:${reset}   ${bold}${stats.total}${reset}${' '.repeat(34 - stats.total.toString().length)}${bold}${gray}│${reset}`);
    console.log(`  ${bold}${gray}│${reset}  ${gray}Critical:${reset} ${critColor}${stats.criticals}${reset}${' '.repeat(34 - stats.criticals.toString().length)}${bold}${gray}│${reset}`);
    console.log(`  ${bold}${gray}│${reset}  ${gray}Warnings:${reset} ${warnColor}${stats.warnings}${reset}${' '.repeat(34 - stats.warnings.toString().length)}${bold}${gray}│${reset}`);
    
    console.log(`  ${bold}${gray}├──────────────────────────────────────────────────┤${reset}`);
    
    const duration = UI.formatDuration(stats.durationMs);
    console.log(`  ${bold}${gray}│${reset}  ${gray}Engine Latency:${reset} ${duration}${' '.repeat(30 - stats.durationMs.toString().length)}${bold}${gray}│${reset}`);
    console.log(`  ${bold}${gray}└──────────────────────────────────────────────────┘${reset}\n`);
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
