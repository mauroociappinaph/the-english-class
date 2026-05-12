import path from 'path';
import { FileScanner } from './file-scanner';
import { TSParser } from './ts-parser';
import { ReportGenerator } from './reporting/report-generator';
import { auditConfig } from './config';
import { Issue, Analyzer, AnalysisContext } from './types/analyzer.types';
import { logger } from './logger';
import { ParsedFile, ParsedDeclaration } from './types/parser';
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

  constructor() {
    this.projectRoot = process.cwd();
    this.scanner = new FileScanner({ rootPath: this.projectRoot });
    this.parser = new TSParser();
    this.reporter = new ReportGenerator();
    this.cache = new AuditCache(this.projectRoot);
  }

  private readonly cache: AuditCache;


  public async run(filesToRefresh?: string[]): Promise<Issue[]> {
    const startTime = Date.now();
    
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


      // 3. Detect Changed Files (for caching logic)
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

      // 3.5 Build Graph
      context.graph.build(this.parser.project);

      // 4. Execute Analyzers
      const allIssues: Issue[] = [...cachedIssues];
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

      // File-by-File Analyzers & Inline Rules
      const locationAnalyzer = new InterfaceLocationAnalyzer();
      const namingAnalyzer = new NamingConventionAnalyzer();

      changedFiles.forEach(filePath => {
        const analysis = this.parser.parseFile(filePath);
        if (!analysis) return;

        const currentFileIssues: Issue[] = [];
        currentFileIssues.push(...locationAnalyzer.analyze(analysis));
        currentFileIssues.push(...namingAnalyzer.analyze(analysis));

        const otherIssues = newIssuesByFile.get(filePath) || [];
        const totalIssues = [...currentFileIssues, ...otherIssues];
        allIssues.push(...currentFileIssues);
        
        this.cache.update(filePath, AuditCache.calculateHash(filePath), totalIssues);
      });

      newIssuesByFile.forEach((issues, filePath) => {
        if (!changedFiles.includes(filePath)) allIssues.push(...issues);
      });

      this.cache.save();
      this.reporter.addIssues(allIssues);
      this.reporter.generate(auditConfig.reporting.outputDir);
      this.showSummary(allIssues, startTime);

      return allIssues;
    } catch (error) {

      const err = error as Error;
      logger.error('❌ Global Audit Error:', { message: err.message, stack: err.stack });
      process.exit(1);
    }
  }


  private showSummary(issues: Issue[], startTime: number): void {

    const duration = Date.now() - startTime;
    const criticals = issues.filter(i => i.severity === 'HIGH').length;
    const warnings = issues.filter(i => i.severity === 'MEDIUM').length;
    
    const calculator = new QualityScoreCalculator();
    const score = calculator.calculate(issues).total;
    const scoreColor = score > 90 ? '\x1b[32m' : score > 70 ? '\x1b[33m' : '\x1b[31m';

    console.log('\n' + '='.repeat(50));
    console.log(`📊 AUDIT SUMMARY (${duration}ms)`);
    console.log('='.repeat(50));
    console.log(`Quality Score:   ${scoreColor}${score}/100\x1b[0m`);
    console.log(`Total Issues:    ${issues.length}`);
    console.log(`Critical (HIGH): \x1b[31m${criticals}\x1b[0m`);
    console.log(`Warnings (MED):  \x1b[33m${warnings}\x1b[0m`);
    console.log('='.repeat(50) + '\n');

  }
}

if (require.main === module) {
  const suite = new SemanticAuditSuite();
  suite.run().then(issues => {
    const criticals = issues.filter(i => i.severity === 'HIGH').length;
    process.exit(criticals > 0 ? 1 : 0);
  }).catch(() => process.exit(1));
}

