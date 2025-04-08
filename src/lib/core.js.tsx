/* eslint-disable no-unused-vars */
const path = require('path');
const fs = require('fs');
require('child_process');
const inquirer = require('./inquirer');
const template = require('./template');
const config = require('./config');
const git = require('./git');
const utils = require('./utils');

/**
 * Project answers interface
 */
interface ProjectAnswers {
  projectName: string;
  useRouter: boolean;
  useFirebase: boolean;
  usePWA: boolean;
  includeMCP: boolean;
  postSetupHooks?: Array<{
    description: string;
    command: string;
  }>;
  [key: string]: any; // Allow for additional properties
}

/**
 * Command line options interface
 */
interface CommandOptions {
  [key: string]: any;
}

/**
 * Main BoilrKit scaffolding function
 * @param {Object} options Command line options
 * @returns {Promise<void>}
 */
async function createApp(options: CommandOptions = {}): Promise<void> {
  console.log('\n🛠️  BoilrKit React App Scaffolder');
  
  // Load configuration (from .boilrkitrc if exists)
  const userConfig = config.loadConfig();
  
  // Get user inputs through prompts
  const answers = await inquirer.getProjectDetails(userConfig, options) as ProjectAnswers;
  
  // Create project directory
  const projectPath = path.join(process.cwd(), answers.projectName);
  
  if (fs.existsSync(projectPath)) {
    console.error(`\n❌ Folder "${answers.projectName}" already exists in ${process.cwd()}`);
    process.exit(1);
  }
  
  fs.mkdirSync(projectPath);
  console.log(`\n📁 Created folder: ${projectPath}`);
  
  process.chdir(projectPath);
  
  // Run build steps
  await runSetupSteps(answers);
  
  // Generate project files
  await generateProjectFiles(answers);
  
  // Final setup and summary
  await finalSetup(answers);
  
  // Show success message
  showSuccessSummary(projectPath, answers);
}

/**
 * Run core setup steps
 * @param {Object} answers User configuration answers
 */
async function runSetupSteps(answers: ProjectAnswers): Promise<void> {
  utils.runStep("Creating Vite React-TS project", 'yarn dlx create-vite . --template react-ts --force');
  fs.writeFileSync('yarn.lock', '');

  utils.runStep("Installing base packages", 'yarn install');
  utils.runStep("Installing Tailwind and core libraries", 'yarn add tailwindcss @tailwindcss/postcss postcss autoprefixer framer-motion zustand openai');
  utils.runStep("Initializing Tailwind config", 'npx tailwindcss init -p');
  utils.runStep("Installing React typings", 'yarn add -D @types/react @types/react-dom');
  utils.runStep("Installing ESLint + Prettier", 'yarn add -D eslint prettier eslint-config-prettier eslint-plugin-react');

  // Conditional installs
  if (answers.useRouter) utils.runStep("Installing React Router", 'yarn add react-router-dom');
  if (answers.useFirebase) utils.runStep("Installing Firebase", 'yarn add firebase');
  if (answers.usePWA) utils.runStep("Installing PWA plugin", 'yarn add -D vite-plugin-pwa');

  utils.runStep("Initializing Git repo", 'git init && git add . && git commit -m "Initial commit"');
}

/**
 * Generate project files from templates
 * @param {Object} answers User configuration answers
 */
async function generateProjectFiles(answers: ProjectAnswers): Promise<void> {
  // Generate config files
  template.generateConfigFiles(answers);
  
  // Generate core app files
  await template.generateAppFiles(answers);
  
  // Generate component files 
  await template.generateComponentFiles(answers);
  
  // Generate page files
  await template.generatePageFiles(answers);
  
  // Generate env file for Firebase if needed
  if (answers.useFirebase) {
    template.generateFirebaseFiles(answers);
  }
  
  // Generate AI helper files
  template.generateAIHelperFiles(answers);
  
  // Generate PWA manifest if needed
  if (answers.usePWA) {
    template.generatePWAFiles(answers);
  }
  
  // Generate .boilrkitrc file for future updates
  config.saveProjectConfig(answers);
}

/**
 * Final setup tasks
 * @param {Object} answers User configuration answers
 */
async function finalSetup(answers: ProjectAnswers): Promise<void> {
  // Create MCP button file if requested
  if (answers.includeMCP) {
    template.generateMCPFiles(answers);
  }
  
  // Run post-setup hooks
  if (answers.postSetupHooks && answers.postSetupHooks.length > 0) {
    console.log('\n🔄 Running post-setup hooks...');
    for (const hook of answers.postSetupHooks) {
      await utils.runStep(hook.description, hook.command);
    }
  }
}

/**
 * Display success message and next steps
 * @param {string} projectPath Path to the created project
 * @param {Object} answers User configuration answers
 */
function showSuccessSummary(projectPath: string, answers: ProjectAnswers): void {
  const summary = `
✅ Project setup complete!

📂 Location: ${projectPath}

🚀 Next steps:
  cd ${answers.projectName}
  yarn dev

📦 Installed:
- Vite + React + TypeScript
- Tailwind CSS
- Zustand
- Framer Motion
- ESLint + Prettier
${answers.useRouter ? '- React Router\n' : ''}${answers.useFirebase ? '- Firebase\n' : ''}${answers.usePWA ? '- PWA Support\n' : ''}${answers.includeMCP ? '- mcp.json\n' : ''}
🤖 GPT & Claude ready
`;

  console.log(summary);
  
  if (answers.includeMCP) {
    console.log('💻 MCP launcher is set up and ready to use.');
  }
}

module.exports = {
  createApp
};