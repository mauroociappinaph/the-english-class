import { execSync } from 'child_process';
import { SemanticAuditSuite } from '../analyze-types';
import { FileScanner } from '../file-scanner';
import { logger } from '../logger';

import { Cleaner } from './cleaner';

async function validateCleanliness() {
  try {
    const allStagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const forbiddenFiles = Cleaner.check(allStagedFiles);

    if (forbiddenFiles.length > 0) {
      logger.error('💩 Noise detected! The following files should not be committed:');
      forbiddenFiles.forEach(f => logger.error(`   - ${f}`));
      logger.info('💡 Tip: Run "npm run clean" and then unstage these files.');
      throw new Error('Cleanliness check failed.');
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Cleanliness check failed.') throw error;
  }
}

async function runHook() {
  const hookType = process.argv[2]; // 'pre-commit' or 'pre-push'
  
  logger.info(`🛡️  Running Git Hook: ${hookType}...`);

  try {
    // 0. Cleanliness Check (Noise Detection)
    await validateCleanliness();

    const suite = new SemanticAuditSuite();
    
    if (hookType === 'pre-commit') {
      const stagedFiles = FileScanner.getStagedFiles();
      if (stagedFiles.length === 0) {
        logger.info('✨ No staged files to analyze.');
        process.exit(0);
      }
      
      logger.info(`🔍 Analyzing ${stagedFiles.length} staged files...`);
      const issues = await suite.run(stagedFiles);
      const criticals = issues.filter(i => i.severity === 'HIGH').length;
      if (criticals > 0) throw new Error(`Found ${criticals} critical architectural issues.`);
    } 
    else if (hookType === 'pre-push') {
      logger.info('🧪 Running Unit Tests...');
      execSync('npm run test', { stdio: 'inherit' });
      
      logger.info('🔍 Running Global Architecture Audit...');
      const issues = await suite.run();
      const criticals = issues.filter(i => i.severity === 'HIGH').length;
      if (criticals > 0) throw new Error(`Found ${criticals} critical architectural issues.`);
    }

    
    logger.info(`✅ ${hookType} passed successfully!`);
    process.exit(0);
  } catch (error) {
    logger.error(`❌ ${hookType} failed. Please fix the issues before proceeding.`);
    process.exit(1);
  }
}

runHook();
