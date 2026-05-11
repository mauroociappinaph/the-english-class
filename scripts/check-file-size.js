const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MAX_LINES = 300;
const TARGET_DIR = path.join(__dirname, '../src');
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

console.log('🔍 Checking file sizes (Max lines: ' + MAX_LINES + ')...');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (EXTENSIONS.includes(path.extname(file))) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(TARGET_DIR);
let failed = false;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n').length;

  if (lines > MAX_LINES) {
    const relativePath = path.relative(path.join(__dirname, '..'), file);
    console.error(`\x1b[31m❌ [SRP Violation]: ${relativePath} has ${lines} lines. (Limit: ${MAX_LINES})\x1b[0m`);
    console.error(`   👉 Please modularize this file following SRP and DRY principles.`);
    failed = true;
  }
});

if (failed) {
  console.error('\n\x1b[31m💥 Commit blocked due to file size limits.\x1b[0m\n');
  process.exit(1);
} else {
  console.log('\x1b[32m✅ All files are within the allowed size limit.\x1b[0m\n');
  process.exit(0);
}
