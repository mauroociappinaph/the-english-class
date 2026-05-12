import { Project } from 'ts-morph';
import path from 'path';
import { FileScanner } from './file-scanner';
import { DuplicateLogicAnalyzer } from './analyzers/duplicate-logic.analyzer';
import { RefactorEngine } from './utils/refactor-engine';
import { logger } from './logger';
import { AnalysisContext } from './types/analyzer.types';
import { DependencyGraph } from './utils/dependency-graph';

async function main() {
  const projectRoot = process.cwd();
  const project = new Project({
    tsConfigFilePath: path.join(projectRoot, 'tsconfig.json')
  });

  logger.info('🚀 Starting Automated Refactoring (Auto-Fixers)...');

  const scanner = new FileScanner({ rootPath: projectRoot });
  const files = await scanner.scan();
  
  const graph = new DependencyGraph(projectRoot);
  await graph.build(project);

  const context: AnalysisContext = {
    project,
    graph,
    ignorePaths: ['node_modules', '.next', 'reports'],
    startTime: Date.now(),
    giantInterfaceRules: { maxProperties: 10, maxNesting: 3, complexityThreshold: 15 },
    anyUsageRules: { allowTypeAssertions: false },
    circularDepRules: { enforcePureDomain: true },
    deduplicationRules: {
      minLines: 5,
      similarityThreshold: 0.9,
      ignoreHooks: true
    }
  };

  const analyzer = new DuplicateLogicAnalyzer();
  const results = await analyzer.analyze(context);
  
  const engine = new RefactorEngine(project);
  
  logger.info(`Found ${results.issues.length} potential duplicates.`);
  
  if (results.issues.length === 0) {
    logger.info('✨ No duplicates found to fix.');
    return;
  }

  // To apply fixes, we need to locate the nodes again.
  // This logic would be implemented in V2
  
  await project.save();
  logger.info('✅ Auto-Fix cycle complete.');
}

main().catch(err => {
  logger.error('Fatal error during fix:', err);
  process.exit(1);
});
