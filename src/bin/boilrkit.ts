#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import inquirer from 'inquirer';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

interface CreateAppOptions {
  template?: string;
  git?: boolean;
  install?: boolean;
  [key: string]: any;
}

interface CreateAppModule {
  createNewApp?: (projectName: string, options?: CreateAppOptions) => Promise<void>;
  createApp?: (projectName: string, options?: CreateAppOptions) => Promise<void>;
  default?: (projectName: string, options?: CreateAppOptions) => Promise<void>;
}

type CreateAppFunction = (projectName: string, options?: CreateAppOptions) => Promise<void>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

let createNewApp: CreateAppFunction;

try {
  const appModule = await import('../create-app.js') as CreateAppModule;
  const fn = appModule.createNewApp || appModule.default || appModule.createApp;

  if (!fn) throw new Error('Could not find any of createNewApp, default, or createApp exports');

  createNewApp = fn as CreateAppFunction;
} catch (error) {
  console.error(chalk.red('❌ Error loading create-app module:'), error);
  process.exit(1);
}

let version = '0.1.0';
try {
  const pkg = require('../../package.json');
  version = pkg.version;
} catch {
  console.warn(chalk.yellow('⚠️ Using fallback version'));
}

const program = new Command();

console.log(
  chalk.bold.cyan('\n🛠️  BoilrKit - React App Scaffolder') +
  chalk.bold.gray(` v${version}\n`)
);

program
  .name('boilrkit')
  .description('Scaffold a new React + Vite + Firebase SaaS app with Tailwind, Zustand, and more.')
  .version(version);

// Subcommand: boilrkit create my-app
program
  .command('create')
  .argument('<project-name>', 'Name of the new project')
  .option('--template <template>', 'Template to use (minimal, standard, full)', 'standard')
  .option('--no-git', 'Skip git initialization')
  .option('--no-install', 'Skip package installation')
  .description('Create a new BoilrKit app')
  .action(async (projectName, options) => {
    try {
      await createNewApp(projectName, options);
    } catch (err) {
      console.error(chalk.red('❌ Failed to create project:'), err);
      process.exit(1);
    }
  });

// Catch fallback: boilrkit my-app (no command, just a name)
if (process.argv.length === 3 && !process.argv[2].startsWith('-')) {
  const projectName = process.argv[2];
  await createNewApp(projectName);
} else if (process.argv.length === 2) {
  // Interactive fallback if no args passed
  const { appName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'appName',
      message: 'What should we call your app?',
      default: 'my-app',
    },
  ]);
  await createNewApp(appName);
} else {
  program.parse(process.argv);
}

