import { exec } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

/**
 * Initialize a Git repository in the current directory
 */
export async function createGitRepo(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    exec('git --version', (error) => {
      if (error) {
        console.warn('Git not available. Skipping repository initialization.');
        resolve();
        return;
      }

      exec('git init', (initError) => {
        if (initError) {
          reject(new Error(`Failed to initialize Git repository: ${initError.message}`));
          return;
        }

        const gitignorePath = path.join(process.cwd(), '.gitignore');
        if (!fs.existsSync(gitignorePath)) {
          const gitignoreContent = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
`;
          fs.writeFileSync(gitignorePath, gitignoreContent);
        }

        exec('git add .', (addError) => {
          if (addError) {
            reject(new Error(`Failed to add files to Git: ${addError.message}`));
            return;
          }

          exec('git commit -m "Initial commit from BoilrKit"', (commitError) => {
            if (commitError) {
              console.warn('Failed to create initial commit. Repository initialized without commits.');
            }
            resolve();
          });
        });
      });
    });
  });
}

/**
 * Clone a specific repository to a local directory
 */
export async function cloneRepo(repoUrl: string, branch: string, targetDir: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    exec('git --version', (error) => {
      if (error) {
        reject(new Error('Git is not installed or not available in PATH'));
        return;
      }

      const command = `git clone ${repoUrl} --branch ${branch} --single-branch ${targetDir}`;
      exec(command, (cloneError) => {
        if (cloneError) {
          reject(new Error(`Failed to clone repository: ${cloneError.message}`));
          return;
        }
        resolve();
      });
    });
  });
}

