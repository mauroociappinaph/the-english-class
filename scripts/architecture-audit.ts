import { SemanticAuditSuite } from '../src/scripts/analyze-types';


/**
 * Proxy script to run the centralized Semantic Audit Suite.
 */
async function main() {
  const suite = new SemanticAuditSuite();
  await suite.run();
}

main().catch(err => {
  console.error('Fatal Audit Error:', err);
  process.exit(1);
});
