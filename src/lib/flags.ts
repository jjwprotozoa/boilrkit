import { Command } from 'commander';

export interface BoilrKitFlags {
  template?: string;
  router?: boolean;
  firebase?: boolean;
  pwa?: boolean;
  minimal?: boolean;
  openMcp?: boolean;
  launchMcpGui?: boolean;
  runApp?: boolean;
  skipCleanup?: boolean;
  skipGit?: boolean; // Keep for backward compatibility
  withGit?: boolean; // New flag for enabling Git
  withAi?: boolean;
  // Add any other flags here
}

export function defineFlags(program: Command) {
  program
    .option('-t, --template <name>', 'Template to use for project generation')
    .option('--router', 'Include React Router', false)
    .option('--firebase', 'Include Firebase integration', false)
    .option('--pwa', 'Add PWA support with vite-plugin-pwa', false)
    .option('--minimal', 'Minimal install (no optional dependencies)', false)
    .option('--open-mcp', 'Open MCP file after creation')
    .option('--launch-mcp-gui', 'Launch Desktop Commander GUI after creation')
    .option('--run-app', 'Run the app after creation')
    .option('--skip-cleanup', 'Skip cleanup steps', false)
    .option('--skip-git', 'Skip Git initialization (deprecated, use --with-git instead)', false)
    .option('--with-git', 'Initialize Git repository (disabled by default)', false)
    .option('--with-ai', 'Include AI helper libraries', false);
  
  return program;
}