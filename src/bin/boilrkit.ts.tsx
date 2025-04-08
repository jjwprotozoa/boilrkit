#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Get version safely
let version = '0.1.0';
try {
  // Try package.json first (most reliable)
  const packageJson = require('../../package.json');
  version = packageJson.version;
} catch (err) {
  try {
    // Fallback to parent directory package.json
    const packageJson = require('../package.json');
    version = packageJson.version;
  } catch (err) {
    console.log(chalk.yellow('Warning: Using default version number'));
  }
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

program
  .command('create')
  .argument('<project-name>', 'Name of the new project')
  .option('--template <template>', 'Template to use (minimal, standard, full)', 'standard')
  .option('--no-git', 'Skip git initialization')
  .option('--no-install', 'Skip package installation')
  .option('--firebase', 'Include Firebase setup')
  .option('--router', 'Include React Router')
  .option('--pwa', 'Setup as Progressive Web App')
  .option('--mcp', 'Generate MCP button file')
  .description('Create a new BoilrKit app')
  .action(async (projectName, options) => {
    try {
      // Import the create-app module correctly
      const createAppPath = path.resolve(__dirname, '../lib/create-app.js');
      
      if (!fs.existsSync(createAppPath)) {
        console.error(chalk.red(`❌ Could not find create-app.js at ${createAppPath}`));
        console.error(chalk.yellow('Make sure the module is built correctly.'));
        process.exit(1);
      }
      
      // Dynamic import
      const appModule = await import(`file://${createAppPath}`);
      const createNewApp = appModule.default || appModule.createNewApp || appModule.createApp;
      
      if (typeof createNewApp !== 'function') {
        throw new Error('Could not load the createNewApp function from create-app.js');
      }
      
      await createNewApp(projectName, options);
    } catch (err) {
      console.error(chalk.red('❌ Failed to create project:'), err);
      console.error(err);
      process.exit(1);
    }
  });

program
  .command('update')
  .description('Update an existing BoilrKit app')
  .action(async () => {
    console.log(chalk.yellow('Update functionality coming soon!'));
  });

program
  .command('add')
  .argument('<feature>', 'Feature to add (page, component, store, api)')
  .description('Add a feature to an existing BoilrKit app')
  .action(async (feature) => {
    console.log(chalk.yellow(`Adding ${feature} functionality coming soon!`));
  });

program.parse(process.argv);

// Show help if no command is provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
