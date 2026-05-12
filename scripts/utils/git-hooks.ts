import { execSync } from 'child_process';
import { SemanticAuditSuite } from '../analyze-types';
import { FileScanner } from '../file-scanner';
import { logger } from '../logger';

async function runHook() {
  const hookType = process.argv[2]; // 'pre-commit' or 'pre-push'
  
  logger.info(`🛡️  Running Git Hook: ${hookType}...`);

  try {
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
