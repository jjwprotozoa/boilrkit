import type { BoilrKitFlags } from './src/lib/flags';

const config: Partial<BoilrKitFlags> = {
  openMcp: true,
  runApp: false,
  launchMcpGui: false,
  withAi: true,
  minimal: false,
  skipCleanup: false,
  skipGit: false,
  template: 'App',
};

export default config;
