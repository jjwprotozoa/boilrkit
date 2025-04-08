/**
 * BoilrKit configuration interface
 */
export interface BoilrkitConfig {
    defaults: {
        firebase: boolean;
        router: boolean;
        ai: boolean;
        pwa: boolean;
        payment: boolean;
        mcp: boolean;
        template?: string;
    };
    templates: {
        repo: string;
        branch: string;
        path: string;
    };
}
/**
 * Load user configuration from .boilrkitrc file
 */
export declare function loadUserConfig(): Promise<BoilrkitConfig>;
/**
 * Save user configuration to .boilrkitrc file
 */
export declare function saveUserConfig(config: Partial<BoilrkitConfig>): Promise<void>;
