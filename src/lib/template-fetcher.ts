// 📁 src/lib/template-fetcher.ts
import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

export interface BoilrkitConfig {
  templates: {
    repo: string;
    branch: string;
    path?: string;
  };
}

export interface AppOptions {
  firebase: boolean;
  router: boolean;
  ai: boolean;
  pwa: boolean;
  payment: boolean;
  mcp: boolean;
  template: string;
}

const OPTIONAL_FOLDERS: (keyof AppOptions)[] = [
  'firebase',
  'router',
  'ai',
  'pwa',
  'payment',
];

export async function fetchTemplates(
  options: Partial<AppOptions>,
  config: BoilrkitConfig
): Promise<void> {
  const repo = config.templates.repo || 'jjwprotozoa/boilrkit-templates';
  const branch = config.templates.branch || 'main';
  const clonePath =
    config.templates.path || path.join(os.tmpdir(), 'boilrkit-templates');

  const repoUrl = `https://github.com/${repo}.git`;

  console.log(chalk.cyan(`\nFetching templates...`));
  console.log(chalk.gray(`🔍 Repo: ${repo}`));
  console.log(chalk.gray(`🔍 Branch: ${branch}`));
  console.log(chalk.gray(`📁 Clone target: ${clonePath}`));

  try {
    if (fs.existsSync(path.join(clonePath, '.git'))) {
      console.log(chalk.gray(`🔄 Pulling latest changes from ${branch}...`));
      process.chdir(clonePath);
      execSync(`git fetch`, { stdio: 'ignore' });
      execSync(`git checkout ${branch}`, { stdio: 'ignore' });
      execSync(`git pull origin ${branch}`, { stdio: 'ignore' });
    } else {
      if (fs.existsSync(clonePath)) {
        console.log(chalk.yellow(`⚠️ Removing stale folder: ${clonePath}`));
        fs.removeSync(clonePath);
      }
      console.log(chalk.gray(`⬇️ Cloning template repo from ${repoUrl}`));
      execSync(`git clone -b ${branch} ${repoUrl} ${clonePath}`, { stdio: 'ignore' });
    }

    const resolvedPath = fs.existsSync(path.join(clonePath, 'templates'))
      ? path.join(clonePath, 'templates')
      : clonePath;

    console.log(chalk.gray(`📦 Using template root: ${resolvedPath}`));
    await copyTemplateFiles(options, resolvedPath);
    console.log(chalk.green('✅ Templates fetched and copied successfully'));
  } catch (error) {
    console.error(chalk.red(`❌ Failed to fetch templates: ${error}`));

    if (fs.existsSync('./templates')) {
      console.log(chalk.yellow('⚠️ Using local fallback: ./templates'));
      await copyTemplateFiles(options, './templates');
    } else if (fs.existsSync(path.join(os.homedir(), '.boilrkit', 'templates'))) {
      console.log(chalk.yellow('⚠️ Using offline fallback: ~/.boilrkit/templates'));
      await copyTemplateFiles(
        options,
        path.join(os.homedir(), '.boilrkit', 'templates')
      );
    } else {
      throw new Error(`❌ Could not fetch templates from GitHub and no fallback found.\n➡️ Check your .boilrkitrc or manually clone https://github.com/${repo}`);
    }
  }
}

async function copyTemplateFiles(options: Partial<AppOptions>, templatePath: string): Promise<void> {
  const folders = await fs.readdir(templatePath);
  const available = folders.filter(folder => fs.statSync(path.join(templatePath, folder)).isDirectory());

  if (available.length === 0) {
    console.warn(chalk.red('⚠️ No template folders found!'));
    return;
  }

  console.log(chalk.cyan(`📁 Found template folders: ${available.join(', ')}`));

  for (const folder of available) {
    const isOptional = OPTIONAL_FOLDERS.includes(folder as keyof AppOptions);

    if (!isOptional || options[folder as keyof AppOptions]) {
      const src = path.join(templatePath, folder);
      const dest = './';
      console.log(chalk.gray(`📄 Copying ${folder}...`));
      copyDirectory(src, dest);
    } else {
      console.log(chalk.gray(`⏭️ Skipping optional: ${folder}`));
    }
  }

  // ✅ COPY CUSTOM App.tsx
  const selectedAppFile = options.router ? 'App.tsx' : 'AppNoRouter.tsx';
  const customAppPath = path.join(templatePath, selectedAppFile);
  const targetAppPath = path.join('./src', 'App.tsx');

  if (fs.existsSync(customAppPath)) {
    if (fs.existsSync(targetAppPath)) {
      const backupPath = `${targetAppPath}.bak`;
      fs.moveSync(targetAppPath, backupPath, { overwrite: true });
      console.log(chalk.yellow(`🗂️ Backed up existing App.tsx to App.tsx.bak`));
    }

    fs.copyFileSync(customAppPath, targetAppPath);
    console.log(chalk.green(`📄 Installed ${selectedAppFile} as src/App.tsx`));
  }

  ensureCorrectFileExtensions('./src');
}

function copyDirectory(src: string, dest: string): void {
  if (!fs.existsSync(src)) {
    console.warn(chalk.yellow(`⚠️ Skipping missing folder: ${src}`));
    return;
  }

  try {
    fs.copySync(src, dest, { overwrite: true, errorOnExist: false });
  } catch (error) {
    console.error(chalk.red(`❌ Failed to copy ${src}: ${error}`));
  }
}

function ensureCorrectFileExtensions(directory: string): void {
  if (!fs.existsSync(directory)) return;

  const files = fs.readdirSync(directory, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(directory, file.name);
    if (file.isDirectory()) {
      ensureCorrectFileExtensions(fullPath);
      continue;
    }

    if (file.name.match(/\.(js|json|tsx|ts)$/)) continue;

    try {
      const content = fs.readFileSync(fullPath, 'utf8');

      if (content.includes('import React') || content.includes('export default')) {
        fs.renameSync(fullPath, `${fullPath}.tsx`);
        console.log(chalk.blue(`📝 Renamed to: ${file.name}.tsx`));
      } else if (content.includes('import ') || content.includes('export ')) {
        fs.renameSync(fullPath, `${fullPath}.ts`);
        console.log(chalk.blue(`📝 Renamed to: ${file.name}.ts`));
      } else {
        fs.renameSync(fullPath, `${fullPath}.js`);
        console.log(chalk.blue(`📝 Renamed to: ${file.name}.js`));
      }
    } catch (error) {
      console.warn(chalk.yellow(`⚠️ Skipped file: ${fullPath} (${error})`));
    }
  }
}
