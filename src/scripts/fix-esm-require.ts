import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = path.resolve(projectRoot, 'dist/index.js');

if (!fs.existsSync(indexPath)) {
  console.error('❌ index.js not found in dist/');
  process.exit(1);
}

let indexContent = fs.readFileSync(indexPath, 'utf-8');

// Replace CommonJS require with ESM import
if (indexContent.includes('const { version } = require')) {
  console.log('🔧 Patching require() usage in index.js...');

  indexContent = indexContent.replace(
    /const\s+\{\s*version\s*\}\s*=\s*require\(['"]\.\.\/package\.json['"]\);?/,
    `import pkg from '../package.json' assert { type: 'json' };\nconst { version } = pkg;`
  );

  fs.writeFileSync(indexPath, indexContent);
  console.log('✅ require() patched to ESM import successfully.');
} else {
  console.log('✅ index.js is already using ESM imports.');
}
