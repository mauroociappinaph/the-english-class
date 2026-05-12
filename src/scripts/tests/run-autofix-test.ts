import { Project, Node } from 'ts-morph';
import path from 'path';
import { RefactorEngine } from '../utils/refactor-engine';
import { logger } from '../logger';

async function testFix() {
  const project = new Project({
    tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json')
  });

  const samplePath = path.join(process.cwd(), 'src/scripts/tests/duplication-sample.ts');
  const sourceFile = project.addSourceFileAtPath(samplePath);
  
  const functions = sourceFile.getFunctions();
  logger.info(`Found ${functions.length} functions in sample.`);

  const engine = new RefactorEngine(project);
  const result = await engine.refactorCluster(functions as Node[]);

  if (result.success) {
    logger.info(`✅ ${result.message}`);
    await sourceFile.save();
    logger.info(`Content of ${samplePath} updated.`);
  } else {
    logger.error(`❌ ${result.message}`);
  }
}

testFix().catch(console.error);
