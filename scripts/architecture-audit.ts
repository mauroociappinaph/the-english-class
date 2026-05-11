import path from 'path';
import { FileScanner } from '../src/backend/infrastructure/file-scanner';
import { TSParser } from '../src/backend/infrastructure/ts-parser';
import { InterfaceLocationAnalyzer } from '../src/backend/infrastructure/analyzers/interface-location.analyzer';
import { NamingConventionAnalyzer } from '../src/backend/infrastructure/analyzers/naming-convention.analyzer';
import { UnusedTypesAnalyzer } from '../src/backend/infrastructure/analyzers/unused-types.analyzer';
import { AnyUsageAnalyzer } from '../src/backend/infrastructure/analyzers/any-usage.analyzer';
import { CircularDepsAnalyzer } from '../src/backend/infrastructure/analyzers/circular-deps.analyzer';
import { Project } from 'ts-morph';





async function runAudit() {
  const projectRoot = path.join(__dirname, '..');
  const scanner = new FileScanner({ rootPath: projectRoot });
  const parser = new TSParser();
  const locationAnalyzer = new InterfaceLocationAnalyzer();
  const namingAnalyzer = new NamingConventionAnalyzer();
  const unusedAnalyzer = new UnusedTypesAnalyzer();
  const anyAnalyzer = new AnyUsageAnalyzer();
  const circularAnalyzer = new CircularDepsAnalyzer();

  const files = await scanner.scan();

  const allFilePaths = files.map(f => f.path);
  
  // Phase 1: Global Loading (Needed for cross-file analysis)
  console.log('\x1b[34m[ArchAudit]\x1b[0m Loading project context for semantic analysis...');
  parser.loadProject(allFilePaths);

  let violations = 0;
  console.log('\x1b[34m[ArchAudit]\x1b[0m Starting Semantic Analysis (AST-Powered)...');


  for (const fileMetadata of files) {
    const analysis = parser.parseFile(fileMetadata.path);
    if (!analysis) continue;

    const relativePath = path.relative(projectRoot, fileMetadata.path);

    // RULE 1: Layer Integrity (Frontend -> Infrastructure forbidden)
    if (relativePath.includes('src/frontend/')) {
      const hasInfraImport = analysis.imports.some(imp => 
        imp.module.startsWith('@/backend/infrastructure/')
      );
      if (hasInfraImport) {
        console.error(`\x1b[31m❌ [Layer Violation]:\x1b[0m ${relativePath} imports directly from infrastructure!`);
        violations++;
      }
    }

    // RULE 2: Naming Convention (Controllers must end with 'Controller')
    if (relativePath.includes('src/backend/controllers/')) {
      analysis.declarations
        .filter(d => d.kind === 'Class')
        .forEach(decl => {
          if (!decl.name.endsWith('Controller')) {
            console.error(`\x1b[31m❌ [Naming Violation]:\x1b[0m Class "${decl.name}" in ${relativePath} must end with "Controller".`);
            violations++;
          }
        });
    }

    // RULE 3: Encapsulation (Services must be exported)
    if (relativePath.includes('src/backend/services/')) {
      analysis.declarations
        .filter(d => d.kind === 'Class')
        .forEach(decl => {
          if (!decl.isExported) {
            console.error(`\x1b[31m❌ [Encapsulation Violation]:\x1b[0m Class "${decl.name}" in ${relativePath} is not exported!`);
            violations++;
          }
        });
    }

    // RULE 4: Contract Location (Interfaces/Types must be in /types or /interfaces)
    const locationIssues = locationAnalyzer.analyze(analysis);
    locationIssues.forEach(issue => {
      console.error(`\x1b[31m❌ [Location Violation]:\x1b[0m ${relativePath}:${issue.line} - ${issue.explanation}`);
      console.error(`   👉 ${issue.suggestion}`);
      violations++;
    });

    // RULE 5: Naming Conventions (PascalCase, Suffixes, Prefixes)
    const namingIssues = namingAnalyzer.analyze(analysis);
    namingIssues.forEach(issue => {
      console.warn(`\x1b[33m⚠️  [Naming Warning]:\x1b[0m ${relativePath}:${issue.line} - ${issue.explanation}`);
      console.warn(`   👉 ${issue.suggestion}`);
      // Severity LOW doesn't break the build by default, but we count it
      // violations++; // Descomentar si querés que los warnings de nombres también rompan el push
    });
  }

  // Phase 2: Global Project Analysis (Unused Code)
  console.log('\x1b[34m[ArchAudit]\x1b[0m Running Global Dead Code Analysis...');
  const unusedIssues = unusedAnalyzer.analyzeProject(parser.project);

  unusedIssues.forEach(issue => {
    const relativePath = path.relative(projectRoot, issue.file);
    console.warn(`\x1b[33m⚠️  [Dead Code Warning]:\x1b[0m ${relativePath}:${issue.line} - ${issue.explanation}`);
    console.warn(`   👉 ${issue.suggestion}`);
  });

  // Phase 3: Type Safety Analysis (Any Usage)
  console.log('\x1b[34m[ArchAudit]\x1b[0m Running Type Safety Audit (Zero-Any)...');
  const anyIssues = anyAnalyzer.analyzeProject(parser.project);

  anyIssues.forEach(issue => {
    const relativePath = path.relative(projectRoot, issue.file);
    const color = issue.severity === 'HIGH' ? '\x1b[31m' : '\x1b[33m';
    const tag = issue.severity === 'HIGH' ? '❌ [Type Safety Violation]' : '⚠️  [Type Safety Warning]';
    
    console.warn(`${color}${tag}\x1b[0m ${relativePath}:${issue.line} - ${issue.explanation}`);
    console.warn(`   👉 ${issue.suggestion}`);
    
    // Breaking the build for HIGH severity Any violations
    if (issue.severity === 'HIGH') violations++;
  });

  // Phase 4: Dependency Graph Analysis (Circular Dependencies)
  console.log('\x1b[34m[ArchAudit]\x1b[0m Running Circular Dependency Analysis...');
  const circularIssues = circularAnalyzer.analyzeProject(parser.project);
  circularIssues.forEach(issue => {
    const relativePath = path.relative(projectRoot, issue.file);
    const tag = issue.severity === 'HIGH' ? '❌ [Circular Dep]' : '⚠️  [Layer Warning]';
    const color = issue.severity === 'HIGH' ? '\x1b[31m' : '\x1b[33m';
    
    console.error(`${color}${tag}:\x1b[0m ${relativePath} - ${issue.explanation}`);
    console.error(`   👉 ${issue.suggestion}`);
    
    if (issue.severity === 'HIGH') violations++;
  });


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
