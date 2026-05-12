import { execSync } from 'child_process';
import fs from 'fs';
import { SemanticAuditSuite } from '../analyze-types';
import { FileScanner } from '../file-scanner';
import { logger } from '../logger';

import { Cleaner } from './cleaner';

async function validateCleanliness() {
  try {
    const allStagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0 && fs.existsSync(f));

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
      logger.info('🔍 Running Incremental Architecture Audit...');
      
      // Get files changed in this branch compared to the tracking branch
      let changedFiles: string[] = [];
      try {
        changedFiles = execSync('git diff --name-only origin/develop...HEAD', { encoding: 'utf8' })
          .split('\n')
          .map(f => f.trim())
          .filter(f => f.length > 0 && fs.existsSync(f));
      } catch (e) {
        // Fallback if origin/develop doesn't exist or other git error
        logger.warn('⚠️  Could not determine diff with origin/develop, running full audit.');
      }

      const issues = await suite.run(changedFiles.length > 0 ? changedFiles : undefined);
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
