import path from 'path';
import { FileScanner } from './file-scanner';
import { TSParser } from './ts-parser';
import { ReportGenerator } from './reporting/report-generator';
import { auditConfig } from './config';
import { Issue, Analyzer, AnalysisContext } from './types/analyzer.types';
import { logger } from './logger';
import { ParsedFile, ParsedDeclaration } from './types/parser';
import { AuditCache } from './utils/audit-cache';



// Analyzers
import { InterfaceLocationAnalyzer } from './analyzers/interface-location.analyzer';
import { NamingConventionAnalyzer } from './analyzers/naming-convention.analyzer';
import { UnusedTypesAnalyzer } from './analyzers/unused-types.analyzer';
import { AnyUsageAnalyzer } from './analyzers/any-usage.analyzer';
import { CircularDepsAnalyzer } from './analyzers/circular-deps.analyzer';
import { GiantInterfacesAnalyzer } from './analyzers/giant-interfaces.analyzer';
import { CouplingMetricsAnalyzer } from './analyzers/coupling-metrics.analyzer';

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


  public async run(): Promise<void> {
    const startTime = Date.now();
    logger.info('🚀 Starting Semantic Architecture Audit...');

    try {
      // 1. Scan & Filter
      const allFiles = await this.scanner.scan();
      const filteredFiles = allFiles.filter(f => {
        const relativePath = path.relative(this.projectRoot, f.path);
        return !auditConfig.ignorePaths.some(ignore => relativePath.startsWith(ignore));
      });

      const filePaths = filteredFiles.map(f => f.path);
      logger.info(`📦 Loaded ${filePaths.length} files for analysis.`);

      // 2. Load Project
      this.parser.loadProject(filePaths);
      this.cache.load();

      // 3. Detect Changed Files
      const changedFiles: string[] = [];
      const cachedIssues: Issue[] = [];

      filePaths.forEach(fp => {
        const hash = AuditCache.calculateHash(fp);
        const cached = this.cache.getCachedIssues(fp, hash);
        if (cached) {
          cachedIssues.push(...cached);
        } else {
          changedFiles.push(fp);
        }
      });

      logger.info(`🔄 Incremental: ${changedFiles.length} files changed, ${filePaths.length - changedFiles.length} reused from cache.`);

      const context: AnalysisContext = {
        project: this.parser.project,
        ignorePaths: auditConfig.ignorePaths,
        giantInterfaceRules: auditConfig.rules.giantInterfaces,
        anyUsageRules: auditConfig.rules.anyUsage,
        circularDepRules: auditConfig.rules.circularDeps,
        startTime,
        changedFiles: changedFiles.length > 0 ? changedFiles : undefined
      };


      // 4. Execute Analyzers
      const allIssues: Issue[] = [...cachedIssues];
      
      const projectAnalyzers: Analyzer[] = [
        new UnusedTypesAnalyzer(),
        new AnyUsageAnalyzer(),
        new CircularDepsAnalyzer(),
        new GiantInterfacesAnalyzer(),
        new CouplingMetricsAnalyzer()
      ];

      // Map to track issues found in this run to update cache
      const newIssuesByFile = new Map<string, Issue[]>();

      projectAnalyzers.forEach(analyzer => {
        if (analyzer.isGlobal || changedFiles.length > 0) {
          logger.info(`🔍 Running ${analyzer.name}...`);
          const result = analyzer.analyze(context);
          
          if (analyzer.isGlobal) {
            allIssues.push(...result.issues);
          } else {
            // Local analyzer: record results for cache
            result.issues.forEach(issue => {
              const fileIssues = newIssuesByFile.get(issue.file) || [];
              fileIssues.push(issue);
              newIssuesByFile.set(issue.file, fileIssues);
            });
          }
        }
      });

      // File-by-File Analyzers & Inline Rules (Only for changed files)
      const locationAnalyzer = new InterfaceLocationAnalyzer();
      const namingAnalyzer = new NamingConventionAnalyzer();

      changedFiles.forEach(filePath => {
        const analysis = this.parser.parseFile(filePath);
        if (!analysis) return;

        const currentFileIssues: Issue[] = [];
        this.checkLayerIntegrity(filePath, analysis, currentFileIssues);
        this.checkControllerNaming(filePath, analysis, currentFileIssues);
        
        currentFileIssues.push(...locationAnalyzer.analyze(analysis));
        currentFileIssues.push(...namingAnalyzer.analyze(analysis));

        // Merge with issues from local project analyzers
        const otherIssues = newIssuesByFile.get(filePath) || [];
        const totalIssues = [...currentFileIssues, ...otherIssues];
        
        allIssues.push(...currentFileIssues); // Add current loop issues to total
        
        // Update Cache for this file
        this.cache.update(filePath, AuditCache.calculateHash(filePath), totalIssues);
      });

      // Special case: if a local analyzer found issues but the file wasn't in changedFiles (shouldn't happen with logic above)
      newIssuesByFile.forEach((issues, filePath) => {
        if (!changedFiles.includes(filePath)) {
          allIssues.push(...issues);
        }
      });

      this.cache.save();

      // 5. Generate Reports
      this.reporter.addIssues(allIssues);

      this.reporter.generate(auditConfig.reporting.outputDir);

      // 5. Final Summary
      this.showSummary(allIssues, startTime);

      const criticals = allIssues.filter(i => i.severity === 'HIGH').length;
      process.exit(criticals > 0 ? 1 : 0);

    } catch (error) {
      const err = error as Error;
      logger.error('❌ Global Audit Error:', { message: err.message, stack: err.stack });
      process.exit(1);
    }

  }

  private checkLayerIntegrity(filePath: string, analysis: ParsedFile, issues: Issue[]): void {
    const relativePath = path.relative(this.projectRoot, filePath);
    if (relativePath.includes('src/frontend/')) {
      const hasInfraImport = analysis.imports.some((imp) => 
        imp.module.startsWith('@/backend/infrastructure/')
      );
      if (hasInfraImport) {
        issues.push({
          file: filePath,
          line: 1,
          severity: 'HIGH',
          explanation: `Layer Violation: ${relativePath} imports directly from infrastructure!`,
          suggestion: 'Frontend should only depend on Services or Types.',
          analyzer: 'LayerIntegrityAnalyzer'
        });
      }
    }
  }

  private checkControllerNaming(filePath: string, analysis: ParsedFile, issues: Issue[]): void {
    const relativePath = path.relative(this.projectRoot, filePath);
    if (relativePath.includes('src/backend/controllers/')) {
      analysis.declarations
        .filter((d: ParsedDeclaration) => d.kind === 'Class')
        .forEach((decl: ParsedDeclaration) => {
          if (!decl.name.endsWith('Controller')) {
            issues.push({
              file: filePath,
              line: decl.startLine,
              severity: 'HIGH',
              explanation: `Naming Violation: Class "${decl.name}" in ${relativePath} must end with "Controller".`,
              suggestion: 'Follow the [Domain]Controller naming convention.',
              analyzer: 'NamingIntegrityAnalyzer'
            });
          }
        });
    }
  }

  private showSummary(issues: Issue[], startTime: number): void {
    const duration = Date.now() - startTime;
    const criticals = issues.filter(i => i.severity === 'HIGH').length;
    const warnings = issues.filter(i => i.severity === 'MEDIUM').length;

    console.log('\n' + '='.repeat(50));
    console.log(`📊 AUDIT SUMMARY (${duration}ms)`);
    console.log('='.repeat(50));
    console.log(`Total Issues:    ${issues.length}`);
    console.log(`Critical (HIGH): \x1b[31m${criticals}\x1b[0m`);
    console.log(`Warnings (MED):  \x1b[33m${warnings}\x1b[0m`);
    console.log('='.repeat(50) + '\n');
  }
}

if (require.main === module) {
  const suite = new SemanticAuditSuite();
  suite.run();
}
