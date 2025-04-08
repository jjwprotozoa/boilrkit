import chalk from 'chalk';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

const CONFIG_FILENAME = '.boilrkitrc';

export interface BoilrkitConfig {
  defaults: {
    firebase: boolean;
    router: boolean;
    ai: boolean;
    pwa: boolean;
    payment: boolean;
    mcp: boolean;
  };
  templates: {
    repo: string;
    branch: string;
    path: string;
  };
}

export async function loadUserConfig(): Promise<BoilrkitConfig> {
  const configPath = path.join(os.homedir(), CONFIG_FILENAME);

  if (await fs.pathExists(configPath)) {
    const raw = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(raw);

    console.log(chalk.gray(`🧩 Loaded config from: ${configPath}`));
    return config;
  }

  throw new Error(`❌ No config file found at ${configPath}
➡️ Create a file called ${CONFIG_FILENAME} in your home directory.
➡️ Example:

{
  "defaults": {
    "firebase": true,
    "router": true,
    "ai": true,
    "pwa": true,
    "payment": false,
    "mcp": true
  },
  "templates": {
    "repo": "jjwprotozoa/boilrkit-templates",
    "branch": "main",
    "path": "C:/Users/DevBox/AppData/Local/Temp/boilrkit-templates"
  }
}`);
}


