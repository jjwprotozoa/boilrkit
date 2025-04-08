import chalk from 'chalk';
import { execSync, spawn } from 'child_process';
import cliProgress from 'cli-progress';
import { Command } from 'commander';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import open from 'open';
import ora from 'ora';
import path from 'path';

import { BoilrKitFlags, defineFlags } from './lib/flags.js';
import type { AppOptions } from './lib/template-fetcher.js';

type ExtendedAppOptions = Omit<AppOptions, 'template'> & BoilrKitFlags & {
  template?: string;
};

const startTime = Date.now();

const program = new Command();
defineFlags(program);
program.allowUnknownOption(true);
program.parse(process.argv);

let cliFlags = program.opts<BoilrKitFlags>();

// 🔄 Load boilrkit.config.ts if it exists
let configDefaults: Partial<BoilrKitFlags> = {};
try {
  const config = await import(path.resolve(process.cwd(), 'boilrkit.config.ts'));
  configDefaults = config.default || {};
} catch {
  // No config file found, continue silently
}

cliFlags = { ...configDefaults, ...cliFlags };

export async function createApp(projectName: string, rawOptions: Partial<ExtendedAppOptions>) {
  const projectPath = path.join(process.cwd(), projectName);

  const options = {
    ...cliFlags,
    ...rawOptions,
  } as ExtendedAppOptions;

  console.log(chalk.cyan(`\n🛠️  BoilrKit - React App Scaffolder v0.1.0`));

  const steps = [
    'Creating project folder',
    'Scaffolding Vite project',
    'Installing base packages',
    'Installing Tailwind + core libs',
    'Configuring Tailwind',
    'Installing optional libraries',
    'Fetching templates',
    'Cleaning tsconfig includes',
    'Initializing Git',
    'Creating MCP file'
  ];

  let currentStep = 0;
  const progress = new cliProgress.SingleBar(
    { 
      format: '📊 [{bar}] {percentage}% | {value}/{total} Steps',
      stopOnComplete: true 
    },
    cliProgress.Presets.shades_classic
  );
  progress.start(steps.length, 0);

  const next = (label: string) => ora(`🔄 ${label}`).start();

  let spinner = next(steps[currentStep]);
  fs.mkdirSync(projectPath, { recursive: true });
  process.chdir(projectPath);
  spinner.succeed('📁 Created project folder');
  progress.increment(++currentStep);

  spinner = next(steps[currentStep]);
  execSync(`npm create vite@latest . -- --template react-ts`, { stdio: 'ignore' });
  spinner.succeed('✅ Vite project created');
  progress.increment(++currentStep);

  spinner = next(steps[currentStep]);
  execSync(`npm install`, { stdio: 'ignore' });
  spinner.succeed('📦 Base packages installed');
  progress.increment(++currentStep);

  spinner = next(steps[currentStep]);
  execSync(`npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss`, { stdio: 'ignore' });
  execSync(`npx tailwindcss init -p`, { stdio: 'ignore' });
  spinner.succeed('🌬️ Tailwind and core libraries installed');
  progress.increment(++currentStep);

  spinner = next(steps[currentStep]);
  fs.writeFileSync(
    'tailwind.config.js',
    `
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
`.trim()
  );

  fs.writeFileSync(
    'postcss.config.js',
    `
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
`.trim()
  );
  spinner.succeed('⚙️ Tailwind configuration complete');
  progress.increment(++currentStep);

  spinner = next(steps[currentStep]);
  if (!cliFlags.minimal) {
    if (options.router) execSync(`npm install react-router-dom`, { stdio: 'ignore' });
    if (options.firebase) execSync(`npm install firebase`, { stdio: 'ignore' });
    if (options.pwa) execSync(`npm install vite-plugin-pwa`, { stdio: 'ignore' });
    if (cliFlags.withAi) execSync(`npm install openai`, { stdio: 'ignore' }); // or ElevenLabs SDK, etc
  }
  spinner.succeed('🔌 Optional libraries installed');
  progress.increment(++currentStep);

  spinner = next(steps[currentStep]);
  try {
    const { fetchTemplates } = await import('./lib/template-fetcher.js');
    const configModule = await import('./lib/config.js');
    const config = await configModule.loadUserConfig();
    await fetchTemplates(options, config, projectName);
    spinner.succeed('📂 Templates fetched and copied');
  } catch (err) {
    spinner.fail(`Failed to fetch templates: ${err}`);
    console.error(chalk.red(`Error details: ${err}`));
  }
  progress.increment(++currentStep);

  spinner = next(steps[currentStep]);
  if (!cliFlags.skipCleanup) {
    try {
      const { cleanTsConfigs } = await import('./scripts/clean-tsconfig.js');
      await cleanTsConfigs(projectPath);
      spinner.succeed('🧼 tsconfig cleanup complete');
    } catch (err) {
      spinner.fail(`Failed to clean tsconfig: ${err}`);
      console.error(chalk.red(`Error details: ${err}`));
    }
  } else {
    console.log(chalk.yellow(`⚠️  Skipped tsconfig cleanup (--skip-cleanup)`));
    spinner.succeed('⏭️ Skipped tsconfig cleanup');
  }
  progress.increment(++currentStep);

  spinner = next(steps[currentStep]);
  // Check both flags - withGit takes precedence if set to true
  const shouldInitGit = cliFlags.withGit === true || (cliFlags.withGit !== false && !cliFlags.skipGit);

  if (shouldInitGit) {
    try {
      execSync(`git init`, { stdio: 'ignore' });
      
      // Add Git user configuration before committing
      try {
        execSync(`git config --local user.name "BoilrKit"`, { stdio: 'ignore' });
        execSync(`git config --local user.email "boilrkit@example.com"`, { stdio: 'ignore' });
      } catch (configErr) {
        console.warn(chalk.yellow(`⚠️ Could not set local Git config: ${configErr}`));
      }
      
      execSync(`git add .`, { stdio: 'ignore' });
      
      // Add error handling for the commit step
      try {
        execSync(`git commit -m "Initial commit from BoilrKit"`, { stdio: 'ignore' });
        spinner.succeed('🔧 Git initialized and committed');
      } catch (commitErr) {
        spinner.succeed('🔧 Git initialized (without commit)');
        console.log(chalk.yellow(`Note: Created Git repo but couldn't commit. You may need to configure Git user.name and user.email.`));
      }
    } catch (err) {
      spinner.warn('⚠️ Git initialization failed');
      console.log(chalk.yellow(`Git error: ${err}`));
    }
  } else {
    spinner.succeed('⏭️ Skipped Git initialization (use --with-git to enable)');
  }
  progress.increment(++currentStep);

  spinner = next(steps[currentStep]);
  try {
    const { createMCPFile } = await import('./lib/template-installer.js');
    await createMCPFile();
    spinner.succeed('✅ MCP button file created');
  } catch (err) {
    spinner.fail(`Failed to create MCP file: ${err}`);
    console.error(chalk.red(`Error details: ${err}`));
  }
  // This is the last step, increment one last time
  progress.increment(++currentStep);
  
  // Ensure we're at the final step count and stop the progress bar
  progress.update(steps.length);
  progress.stop();
  
  // Clear separation between progress and prompts
  console.log('');
  console.log(chalk.green(`\n✅ Project setup complete!`));

  // Create README.md with usage instructions if it doesn't exist
  const readmePath = path.join(projectPath, 'README.md');
  if (!fs.existsSync(readmePath)) {
    try {
      fs.writeFileSync(readmePath, generateReadme(projectName, options));
      console.log(chalk.green(`📝 Created README.md with usage instructions`));
    } catch (err) {
      console.warn(chalk.yellow(`⚠️ Could not create README.md: ${err}`));
    }
  }

  // AFTER the progress bar has stopped, handle user prompts
  let openMcpFinal = options.openMcp ?? cliFlags.openMcp;
  if (openMcpFinal === undefined) {
    const { confirmOpen } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmOpen',
        message: 'Open MCP file now?',
        default: true,
      },
    ]);
    openMcpFinal = confirmOpen;
  }

  if (openMcpFinal) {
    try {
      await open(path.join(projectPath, 'mcp.json'));
      console.log(chalk.green(`🧠 Opened MCP file`));
    } catch (err) {
      console.warn(chalk.yellow(`⚠️ Could not open MCP file: ${err}`));
    }
  }

  // Open README.md automatically for quick reference
  try {
    await open(readmePath);
    console.log(chalk.green(`📖 Opened README.md for quick reference`));
  } catch (err) {
    // Silently fail, opening README is just a convenience
  }

  let launchGuiFinal = options.launchMcpGui ?? cliFlags.launchMcpGui;
  if (launchGuiFinal === undefined) {
    const { confirmGui } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmGui',
        message: 'Launch Desktop Commander GUI now?',
        default: false,
      },
    ]);
    launchGuiFinal = confirmGui;
  }

  // Flag to track if we need to run the app
  let shouldRunApp = options.runApp ?? cliFlags.runApp;
  if (shouldRunApp === undefined) {
    const { confirmRun } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmRun',
        message: 'Run the app now?',
        default: false,
      },
    ]);
    shouldRunApp = confirmRun;
  }

  // Handle Desktop Commander GUI launch
  if (launchGuiFinal) {
    try {
      console.log(chalk.cyan('Attempting to launch Desktop Commander GUI...'));
      
      // Try to find the Desktop Commander install path
      let desktopCommanderPath;
      try {
        desktopCommanderPath = execSync('npm root -g').toString().trim() + 
                               '/@wonderwhy-er/desktop-commander/bin/desktop-commander.js';
        
        // Check if the file exists
        if (!fs.existsSync(desktopCommanderPath)) {
          throw new Error('Desktop Commander executable not found at: ' + desktopCommanderPath);
        }
        
        console.log(`Found Desktop Commander at: ${desktopCommanderPath}`);
      } catch (pathErr) {
        console.warn(chalk.yellow(`⚠️ Could not locate Desktop Commander installation: ${pathErr}`));
        console.log(chalk.yellow('Falling back to shell command...'));
        desktopCommanderPath = null;
      }
      
      // Launch using the best available method
      let guiProcess;
      if (desktopCommanderPath) {
        // Direct node execution (more reliable)
        guiProcess = spawn('node', [desktopCommanderPath, 'gui'], { 
          detached: true,
          stdio: 'pipe', // Capture output for debugging
          shell: false 
        });
      } else {
        // Fallback to shell command
        guiProcess = spawn('desktop-commander', ['gui'], { 
          stdio: 'pipe', // Capture output for debugging
          shell: true 
        });
      }
      
      // Capture standard output for debugging
      let stdoutChunks: Buffer[] = [];
      guiProcess.stdout?.on('data', (data) => {
        stdoutChunks.push(data);
        console.log(`Desktop Commander output: ${data}`);
      });

      // Capture standard error for debugging
      let stderrChunks: Buffer[] = [];
      guiProcess.stderr?.on('data', (data) => {
        stderrChunks.push(data);
        console.error(`Desktop Commander error: ${data}`);
      });
      
      // Create a promise that resolves when process spawns and set a timeout
      const guiPromise = new Promise((resolve, reject) => {
        guiProcess.on('spawn', () => {
          console.log(chalk.green('Desktop Commander process spawned'));
          resolve(true);
        });
        
        guiProcess.on('error', (err) => {
          console.error(chalk.red(`Failed to start Desktop Commander: ${err}`));
          reject(err);
        });
        
        // Set a reasonable timeout in case neither event fires
        setTimeout(() => {
          resolve(false);
        }, 2000);
      });
      
      // Wait for process to spawn
      await guiPromise;
      
      // This timeout gives the GUI a chance to appear
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check if the process is still running but potentially not showing a window
      if (guiProcess.exitCode === null) {
        console.log(chalk.yellow('⚠️ Desktop Commander process started but the GUI window may not be visible.'));
        console.log(chalk.yellow('If you don\'t see the Desktop Commander GUI window, try:'));
        console.log('1. Run the command manually in a new terminal: desktop-commander gui');
        console.log('2. Check if Desktop Commander is properly installed: npm list -g @wonderwhy-er/desktop-commander');
        console.log('3. Make sure your display settings allow for new windows to appear');
      } else {
        console.error(chalk.red(`Desktop Commander process exited with code ${guiProcess.exitCode}`));
        if (stdoutChunks.length > 0) {
          console.log(chalk.gray('Standard output:'));
          console.log(Buffer.concat(stdoutChunks).toString());
        }
        if (stderrChunks.length > 0) {
          console.log(chalk.red('Standard error:'));
          console.log(Buffer.concat(stderrChunks).toString());
        }
      }
      
      // Detach the process if it's still running (let it continue independently)
      if (guiProcess.exitCode === null && guiProcess.pid) {
        guiProcess.unref();
      }
    } catch (err) {
      console.warn(chalk.yellow(`⚠️ Could not launch Desktop Commander GUI: ${err}`));
      console.log(`💡 Tip: Try reinstalling with 'npm install -g @wonderwhy-er/desktop-commander'`);
    }
  }

  // Handle app launching separately from GUI
  if (shouldRunApp) {
    // Move to project directory before running the app
    process.chdir(projectPath);
    
    console.log(chalk.cyan(`\n🚀 Launching dev server...`));
    
    // Run the dev server
    const serverProcess = spawn('npm', ['run', 'dev', '--', '--open'], { 
      stdio: 'inherit', // Direct pass-through to terminal for simplicity
      shell: true 
    });
    
    // Keep the main process alive until the server exits
    serverProcess.on('exit', (code) => {
      if (code !== 0) {
        console.error(chalk.red(`\n❌ Dev server exited with code ${code}`));
      }
    });
    
    // Don't continue with the rest of the script while the server is running
    await new Promise(resolve => {
      serverProcess.on('exit', resolve);
      // Allow termination with Ctrl+C
      process.on('SIGINT', () => {
        serverProcess.kill('SIGINT');
        resolve(null);
      });
    });
    
    // Note: The script will continue here only after the server process exits
    console.log(chalk.cyan('Dev server closed.'));
  }

  // Display project summary regardless of GUI/CLI choice
  console.log(chalk.gray(`📂 Location: ${projectPath}`));
  console.log(chalk.cyan(`🚀 Next steps:`));
  console.log(`  cd ${projectName}`);
  console.log(`  npm run dev`);

  console.log(chalk.gray(`\n📦 Installed:`));
  console.log(`- Vite + React + TypeScript`);
  console.log(`- Tailwind CSS`);
  console.log(`- Zustand`);
  console.log(`- Framer Motion`);
  if (options.router) console.log(`- React Router`);
  if (options.firebase) console.log(`- Firebase`);
  if (options.pwa) console.log(`- PWA setup`);
  if (cliFlags.withAi) console.log(`- AI helpers`);
  console.log(`- MCP button file`);

  // Final success message
  console.log(chalk.green.bold(`\n🎉 Installation successfully completed!`));
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(chalk.gray(`⏱️ Elapsed time: ${duration}s`));
}

// Helper function to generate a README.md file
function generateReadme(projectName: string, options: ExtendedAppOptions): string {
  return `# ${projectName}

A React application scaffolded with BoilrKit.

## Features

- ⚛️ React + Vite + TypeScript foundation
- 🌗 Tailwind CSS with dark mode support
${options.firebase ? '- 🔐 Firebase Auth + Firestore\n' : ''}${options.router ? '- 🧭 React Router\n' : ''}${options.pwa ? '- 📱 PWA support\n' : ''}${options.withAi ? '- 🤖 AI integration\n' : ''}- 📦 Zustand state management
- 🧠 Desktop Commander MCP integration

## Getting Started

\`\`\`bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
\`\`\`

## Desktop Commander

This project includes a \`mcp.json\` file for use with [Desktop Commander](https://github.com/wonderwhy-er/desktop-commander).

To use Desktop Commander:
1. Install it globally: \`npm install -g @wonderwhy-er/desktop-commander\`
2. Launch the GUI: \`desktop-commander gui\`
3. Navigate to this project folder
4. Use the GUI buttons to run common commands

If the GUI doesn't appear:
- Check if Desktop Commander is installed correctly
- Try running commands manually with the CLI

## Project Structure

\`\`\`
${projectName}/
├── src/
│   ├── components/
${options.withAi ? '│   ├── ai/        # AI integration\n' : ''}${options.router ? '│   ├── pages/     # Route pages\n' : ''}│   ├── stores/    # Zustand state
│   ├── App.tsx
│   └── main.tsx
├── mcp.json        # Desktop Commander config
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
└── ...
\`\`\`

## License

MIT
`;
}

// Export aliases for compatibility with bin/boilrkit.ts
export const createNewApp = createApp;
export default createApp;