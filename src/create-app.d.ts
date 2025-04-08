// Type definitions for create-app
declare module 'create-app' {
  /**
   * Configuration options for creating a new app
   */
  export interface AppOptions {
    firebase?: boolean;
    router?: boolean;
    ai?: boolean;
    pwa?: boolean;
    payment?: boolean;
    mcp?: boolean;
    template?: string;
    git?: boolean;
    install?: boolean;
    [key: string]: any;
  }

  /**
   * Config structure from loadUserConfig
   */
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
    [key: string]: any;
  }

  /**
   * Create a new BoilrKit application
   * @param appName Name of the new project/directory to create
   * @param options Configuration options for the app
   */
  export function createNewApp(appName: string, options?: Record<string, any>): Promise<void>;
  
  /**
   * Alternative export name that might be used
   */
  export function createApp(appName: string, options?: Record<string, any>): Promise<void>;
  
  /**
   * Default export if neither createNewApp nor createApp is available
   */
  export default function(appName: string, options?: Record<string, any>): Promise<void>;
}