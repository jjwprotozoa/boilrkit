// Enhanced fix-imports.ts
import chalk from 'chalk';
import fs from 'fs';
import glob from 'glob';
import path from 'path';

// Configuration
const config = {
  patterns: [
    '**/*.js',
    '**/*.jsx',
    '**/*.ts',
    '**/*.tsx',
    '!node_modules/**',
    '!dist/**'
  ],
  extensions: ['.js', '.jsx', '.json'],
  directories: [] as string[]
};

// Parse CLI args
const args = process.argv.slice(2);
let targetDir = process.cwd();
if (args.length > 0) targetDir = path.resolve(process.cwd(), args[0]);

console.log(chalk.blue(`🔍 Searching for files in: ${targetDir}\n`));

let updatedCount = 0;
let skippedCount = 0;
let errorCount = 0;

function isDirectory(p: string): boolean {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function fileExists(p: string): boolean {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

function findFileWithExtension(basePath: string, extensions: string[]): string | null {
  for (const ext of extensions) {
    const pathWithExt = `${basePath}${ext}`;
    if (fileExists(pathWithExt)) return ext;
  }
  return null;
}

function processFile(filePath: string): void {
  console.log(chalk.gray(`→ Processing: ${filePath}`));
  let content: string;

  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (err: unknown) {
    const error = err as Error;
    errorCount++;
    console.error(chalk.red(`❌ Error reading ${filePath}: ${error.message}`));
    return;
  }

  const importRegex = /import\s+(?:[\w*{}$\s,]+from\s+)?['"]([^'"]+)['"]/g;
  let match: RegExpExecArray | null;
  let newContent = content;
  let modified = false;

  while ((match = importRegex.exec(content)) !== null) {
    const [fullMatch, importPath] = match;

    if (
      importPath.startsWith('@') ||
      !importPath.startsWith('.') ||
      path.extname(importPath) !== '' ||
      importPath.endsWith('/')
    ) continue;

    const currentDir = path.dirname(filePath);
    const resolvedPath = path.resolve(currentDir, importPath);

    if (isDirectory(resolvedPath)) {
      const indexExt = findFileWithExtension(path.join(resolvedPath, 'index'), config.extensions);
      if (indexExt) continue;
    }

    const foundExt = findFileWithExtension(resolvedPath, config.extensions);
    if (foundExt) {
      const newImportPath = `${importPath}${foundExt}`;
      const newImport = fullMatch.replace(importPath, newImportPath);
      newContent = newContent.replace(fullMatch, newImport);
      modified = true;
      console.log(chalk.yellow(`  🔧 Fixed: ${importPath} → ${newImportPath}`));
    }
  }

  if (modified) {
    try {
      fs.writeFileSync(filePath, newContent, 'utf8');
      updatedCount++;
      console.log(chalk.green(`✅ Updated: ${filePath}`));
    } catch (err: unknown) {
      const error = err as Error;
      errorCount++;
      console.error(chalk.red(`❌ Error writing ${filePath}: ${error.message}`));
    }
  } else {
    skippedCount++;
    console.log(chalk.gray(`✓ No changes needed: ${filePath}`));
  }
}

let files: string[] = [];
for (const pattern of config.patterns) {
  const matches = glob.sync(pattern, { cwd: targetDir, absolute: true });
  files = [...files, ...matches];
}

console.log(chalk.cyan(`Found ${files.length} files to process.\n`));
files.forEach(processFile);

console.log(chalk.magentaBright('\n📦 Import Fix Summary:'));
console.log(chalk.green(`  🔧 Files Updated: ${updatedCount}`));
console.log(chalk.gray(`  ✅ No Changes:    ${skippedCount}`));
console.log(chalk.red(`  ❌ Errors:        ${errorCount}`));
console.log(chalk.bold('\n✨ Import statements fixing complete!\n'));

export { };

