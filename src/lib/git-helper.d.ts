/**
 * Initialize a Git repository in the current directory
 */
export declare function createGitRepo(): Promise<void>;
/**
 * Clone a specific repository to a local directory
 */
export declare function cloneRepo(repoUrl: string, branch: string, targetDir: string): Promise<void>;
