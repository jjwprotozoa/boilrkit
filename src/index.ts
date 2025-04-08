#!/usr/bin/env node
import chalk from 'chalk';
import { program } from 'commander';
import ora from 'ora';
import { createApp } from './create-app.js'; // Use .js instead of .tsx
import { loadUserConfig } from './lib/config.js';
import { version as appVersion } from './utils/version.js';

// Get version from package.json
// @ts-ignore
// Display banner
console.log(chalk.bold.cyan('\n🛠️  BoilrKit - React App Scaffolder') + chalk.bold.gray(` v${appVersion}`));
console.log(chalk.gray('Building lean, powerful web applications with Lean Six Sigma principles\n'));

// Set up command-line options
program
    .version(appVersion)
    .description('Create modern React applications with sensible defaults and zero config')
    .arguments('<project-name>')
    .option('-f, --firebase', 'include Firebase authentication and Firestore')
    .option('-r, --router', 'include React Router')
    .option('-a, --ai', 'include AI helpers (GPT/Claude)')
    .option('-p, --pwa', 'configure as a Progressive Web App')
    .option('-s, --payment', 'include payment integration')
    .option('-m, --mcp', 'generate MCP button file')
    .option('-t, --template <n>', 'template to use')
    .action(async (projectName, options) => {
        // Create loading spinner
        const spinner = ora('Setting up your project...').start();
        try {
            await createApp(projectName, {
                firebase: !!options.firebase,
                router: !!options.router,
                ai: !!options.ai,
                pwa: !!options.pwa,
                payment: !!options.payment,
                mcp: !!options.mcp,
                template: options.template
            });
            spinner.succeed(chalk.green('Project created successfully!'));
        } catch (error) {
            spinner.fail(chalk.red('Failed to create project!'));
            console.error(chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
            process.exit(1);
        }
    });

// Initialize config command
program
    .command('config')
    .description('Manage BoilrKit configuration')
    .option('--show', 'show current configuration')
    .option('--set <key=value>', 'set configuration value')
    .option('--reset', 'reset configuration to defaults')
    .action(async (options) => {
        try {
            const config = await loadUserConfig();
            if (options.show) {
                console.log(chalk.cyan('Current BoilrKit configuration:'));
                console.log(JSON.stringify(config, null, 2));
            }
            // Other config actions would be implemented here
        } catch (error) {
            console.error(chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
            process.exit(1);
        }
    });

// Parse command line arguments
program.parse(process.argv);

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
    program.outputHelp();
}

