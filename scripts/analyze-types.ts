import path from 'path';
import { FileScanner } from './file-scanner';
import { TSParser } from './ts-parser';
import { execSync, exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);
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
  private readonly graph: DependencyGraph;

  constructor() {
    this.projectRoot = process.cwd();
    this.scanner = new FileScanner({ rootPath: this.projectRoot });
    this.parser = new TSParser();
    this.reporter = new ReportGenerator();
    this.cache = new AuditCache(this.projectRoot);
    this.graph = new DependencyGraph(this.projectRoot);
  }

  /**
   * Runs the audit.
   * @param filesToRefresh If provided, performs an incremental audit on these files only.
   */
  public async run(filesToRefresh?: string[]): Promise<Issue[]> {
    const startTime = Date.now();
    this.reporter.clearIssues();
    
    try {
      const t0 = Date.now();
      
      if (filesToRefresh && filesToRefresh.length > 0) {
        // Smart refresh
        await this.parser.refreshFiles(filesToRefresh);
      } else {
        // 0. Smart Scan & Load
        const allFiles = await this.scanner.scan(filesToRefresh);
        const filePaths = allFiles
          .filter(f => {
            const relativePath = path.relative(this.projectRoot, f.path);
            return !auditConfig.ignorePaths.some(ignore => relativePath.startsWith(ignore));
          })
          .map(f => f.path);
        
        this.parser.loadProject(filePaths);
      }
      logger.info(`⏱️ Load Project: ${Date.now() - t0}ms`);

      const loadedFilePaths = this.parser.project.getSourceFiles()
        .map(sf => sf.getFilePath())
        .filter(fp => !fp.includes('node_modules') && !fp.endsWith('.d.ts'));
      
      this.cache.load();

      // 1. Type Check Gate (Lazy) - Handled in Parallel below
      this.cache.load();

      // 2. Detect Changed Files
      const changedFiles: string[] = [];
      const cachedIssues: Issue[] = [];

      loadedFilePaths.forEach(fp => {
        if (filesToRefresh?.includes(fp)) {
          changedFiles.push(fp);
          return;
        }
        
        const cached = this.cache.getCachedIssues(fp);
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
        changedFiles: changedFiles,
        graph: this.graph
      };

      const t2 = Date.now();
      this.graph.build(this.parser.project);
      logger.info(`⏱️ Build Graph: ${Date.now() - t2}ms`);

      // 3. Execute Modern Analyzers & Type Check (Parallel)
      const t3 = Date.now();
      const projectAnalyzers: Analyzer[] = getProjectAnalyzers();
      const newIssuesByFile = new Map<string, Issue[]>();

      const typeCheckTask = !filesToRefresh 
        ? this.runTypeCheckAsync() 
        : Promise.resolve([] as Issue[]);

      const analyzerTasks = projectAnalyzers.map(async analyzer => {
        if (analyzer.isGlobal || (context.changedFiles && context.changedFiles.length > 0)) {
          const result = await analyzer.analyze(context);
          return { analyzer, result };
        }
        return null;
      });

      const [typeErrors, results] = await Promise.all([
        typeCheckTask,
        Promise.all(analyzerTasks)
      ]);
      
      logger.info(`⏱️ Run Parallel Engine (Analyzers + TypeCheck): ${Date.now() - t3}ms`);

      const allIssues: Issue[] = [...cachedIssues, ...typeErrors];

      results.forEach(item => {
        if (!item) return;
        const { analyzer, result } = item;
        
        if (analyzer.isGlobal) {
          allIssues.push(...result.issues);
        } else {
          const grouped = IssueUtils.groupByFile(result.issues);
          grouped.forEach((issues, file) => {
            const existing = newIssuesByFile.get(file) || [];
            newIssuesByFile.set(file, [...existing, ...issues]);
          });
        }
      });

      // 4. File-by-File Analyzers (Legacy Format - Parallel)
      const locationAnalyzer = new InterfaceLocationAnalyzer();
      const namingAnalyzer = new NamingConventionAnalyzer();

      const legacyTasks = changedFiles.map(async fp => {
        const parsedFile = this.parser.parseFile(fp);
        if (!parsedFile) return null;

        const locIssues = await locationAnalyzer.analyze(parsedFile);
        const namingIssues = await namingAnalyzer.analyze(parsedFile);

        const mapToIssues = (legacy: Issue[]): Issue[] => legacy.map(l => ({
          ...l,
          file: fp,
          analyzer: l.analyzer || 'LegacyAnalyzer'
        }));

        return {
          file: fp,
          issues: [...mapToIssues(locIssues), ...mapToIssues(namingIssues)]
        };
      });

      const legacyResults = await Promise.all(legacyTasks);
      legacyResults.forEach(res => {
        if (!res) return;
        const existing = newIssuesByFile.get(res.file) || [];
        newIssuesByFile.set(res.file, [...existing, ...res.issues]);
      });

      // 5. Update Cache
      newIssuesByFile.forEach((issues, fp) => {
        this.cache.update(fp, issues);
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

  private async runTypeCheckAsync(): Promise<Issue[]> {
    try {
      await execAsync('npx tsc --noEmit');
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
  const filesToRefresh = process.argv.slice(2).filter(arg => !arg.startsWith('--'));
  suite.run(filesToRefresh.length > 0 ? filesToRefresh : undefined).catch(() => process.exit(1));
}
