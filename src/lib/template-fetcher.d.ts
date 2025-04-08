// template-fetcher.d.ts
export interface BoilrkitConfig {
  templates: {
    repo: string;
    branch: string;
    path: string;
  };
}

export interface AppOptions {
  firebase: boolean;
  router: boolean;
  ai: boolean;
  pwa: boolean;
  payment: boolean;
  mcp: boolean;
  template: string;
}

/**
 * Fetch templates from GitHub repository
 */
export declare function fetchTemplates(options: Partial<AppOptions>, config: BoilrkitConfig): Promise<void>;