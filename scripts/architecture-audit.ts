import path from 'path';
import { FileScanner } from '../src/backend/infrastructure/file-scanner';
import { TSParser } from '../src/backend/infrastructure/ts-parser';
import { InterfaceLocationAnalyzer } from '../src/backend/infrastructure/analyzers/interface-location.analyzer';
import { NamingConventionAnalyzer } from '../src/backend/infrastructure/analyzers/naming-convention.analyzer';
import { UnusedTypesAnalyzer } from '../src/backend/infrastructure/analyzers/unused-types.analyzer';
import { AnyUsageAnalyzer } from '../src/backend/infrastructure/analyzers/any-usage.analyzer';
import { CircularDepsAnalyzer } from '../src/backend/infrastructure/analyzers/circular-deps.analyzer';
import { GiantInterfacesAnalyzer } from '../src/backend/infrastructure/analyzers/giant-interfaces.analyzer';
import { ReportGenerator } from '../src/backend/infrastructure/report-generator';
import { AnalyzerIssue } from '../src/backend/infrastructure/interfaces/analyzer';
import { auditConfig } from '../src/backend/infrastructure/config';

async function runAudit() {
  const projectRoot = path.join(__dirname, '..');
  const scanner = new FileScanner({ rootPath: projectRoot });
  const parser = new TSParser();
  const report = new ReportGenerator();
  
  const locationAnalyzer = new InterfaceLocationAnalyzer();
  const namingAnalyzer = new NamingConventionAnalyzer();
  const unusedAnalyzer = new UnusedTypesAnalyzer();
  const anyAnalyzer = new AnyUsageAnalyzer();
  const circularAnalyzer = new CircularDepsAnalyzer();
  const giantAnalyzer = new GiantInterfacesAnalyzer();

  const files = await scanner.scan();
  
  // Filter files based on ignorePaths from config
  const filteredFiles = files.filter(f => {
    const relativePath = path.relative(projectRoot, f.path);
    return !auditConfig.ignorePaths.some(ignore => relativePath.startsWith(ignore));
  });

  const allFilePaths = filteredFiles.map(f => f.path);
  const allIssues: AnalyzerIssue[] = [];
  
  // Phase 1: Global Loading
  console.log('\x1b[34m[ArchAudit]\x1b[0m Loading project context for semantic analysis...');
  parser.loadProject(allFilePaths);

  let violations = 0;
  console.log(`\x1b[34m[ArchAudit]\x1b[0m Starting Semantic Analysis on ${allFilePaths.length} files...`);

  for (const fileMetadata of filteredFiles) {
    const analysis = parser.parseFile(fileMetadata.path);
    if (!analysis) continue;

    const relativePath = path.relative(projectRoot, fileMetadata.path);

    // RULE 1: Layer Integrity
    if (relativePath.includes('src/frontend/')) {
      const hasInfraImport = analysis.imports.some(imp => 
        imp.module.startsWith('@/backend/infrastructure/')
      );
      if (hasInfraImport) {
        allIssues.push({
          file: fileMetadata.path,
          line: 1,
          severity: 'HIGH',
          explanation: `Layer Violation: ${relativePath} imports directly from infrastructure!`,
          suggestion: 'Frontend should only depend on Services or Types.',
          analyzer: 'LayerIntegrityAnalyzer'
        });
        violations++;
      }
    }

    // RULE 2: Naming Convention (Controllers)
    if (relativePath.includes('src/backend/controllers/')) {
      analysis.declarations
        .filter(d => d.kind === 'Class')
        .forEach(decl => {
          if (!decl.name.endsWith('Controller')) {
            allIssues.push({
              file: fileMetadata.path,
              line: decl.startLine,
              severity: 'HIGH',
              explanation: `Naming Violation: Class "${decl.name}" in ${relativePath} must end with "Controller".`,
              suggestion: 'Follow the [Domain]Controller naming convention.',
              analyzer: 'NamingIntegrityAnalyzer'
            });
            violations++;
          }
        });
    }

    // RULE 4: Contract Location
    const locationIssues = locationAnalyzer.analyze(analysis);
    allIssues.push(...locationIssues);
    locationIssues.forEach(issue => {
      if (issue.severity === 'HIGH') violations++;
    });

    // RULE 5: Naming Conventions
    const namingIssues = namingAnalyzer.analyze(analysis);
    allIssues.push(...namingIssues);
  }

  // Phase 2: Global Project Analysis (Unused Code)
  console.log('\x1b[34m[ArchAudit]\x1b[0m Running Global Dead Code Analysis...');
  const unusedIssues = unusedAnalyzer.analyzeProject(parser.project);
  allIssues.push(...unusedIssues);

  // Phase 3: Type Safety Analysis (Any Usage)
  console.log('\x1b[34m[ArchAudit]\x1b[0m Running Type Safety Audit (Zero-Any)...');
  const anyIssues = anyAnalyzer.analyzeProject(parser.project);
  allIssues.push(...anyIssues);
  anyIssues.forEach(issue => {
    if (issue.severity === 'HIGH') violations++;
  });

  // Phase 4: Dependency Graph Analysis
  console.log('\x1b[34m[ArchAudit]\x1b[0m Running Circular Dependency Analysis...');
  const circularIssues = circularAnalyzer.analyzeProject(parser.project);
  allIssues.push(...circularIssues);
  circularIssues.forEach(issue => {
    if (issue.severity === 'HIGH') violations++;
  });

  // Phase 5: Cohesion Analysis
  console.log('\x1b[34m[ArchAudit]\x1b[0m Running Cohesion Analysis (ISP)...');
  const giantIssues = giantAnalyzer.analyzeProject(parser.project);
  allIssues.push(...giantIssues);
  giantIssues.forEach(issue => {
    if (issue.severity === 'HIGH') violations++;
  });

  // FINAL: Report Generation
  report.addIssues(allIssues);
  report.generate(auditConfig.reporting.outputDir);

  if (violations > 0) {
    console.error(`\n\x1b[31m💥 Semantic Audit FAILED with ${violations} violations.\x1b[0m`);
    process.exit(1);
  } else {
    console.log('\x1b[32m✅ Semantic Audit passed. Project structure is healthy.\x1b[0m\n');
    process.exit(0);
  }
}

runAudit().catch(err => {
  console.error(err);
  process.exit(1);
});
