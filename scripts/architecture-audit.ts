import path from 'path';
import fs from 'fs/promises';
import { FileScanner } from '../src/backend/infrastructure/file-scanner';

async function runAudit() {
  const projectRoot = path.join(__dirname, '..');
  const scanner = new FileScanner({ rootPath: projectRoot });
  const files = await scanner.scan();
  
  let violations = 0;

  console.log('\x1b[34m[ArchAudit]\x1b[0m Checking layer integrity rules...');

  for (const file of files) {
    // Regla: El frontend no puede tocar la infraestructura directamente
    if (file.path.includes('src/frontend/')) {
      const content = await fs.readFile(file.path, 'utf8');
      
      // Buscamos imports directos a backend/infrastructure
      if (content.includes('@/backend/infrastructure/')) {
        const relativePath = path.relative(projectRoot, file.path);
        console.error(`\x1b[31m❌ [Layer Violation]:\x1b[0m ${relativePath} is importing directly from infrastructure!`);
        console.error(`   👉 Rule: Frontend must use Services or Controllers, never Infrastructure directly.`);
        violations++;
      }
    }
  }

  if (violations > 0) {
    console.error(`\n\x1b[31m💥 Architecture Audit FAILED with ${violations} violations.\x1b[0m`);
    process.exit(1);
  } else {
    console.log('\x1b[32m✅ Architecture Audit passed. Layer integrity is solid.\x1b[0m\n');
    process.exit(0);
  }
}

runAudit().catch(err => {
  console.error(err);
  process.exit(1);
});
