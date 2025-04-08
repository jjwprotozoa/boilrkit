declare module 'create-app' {
  interface CreateAppOptions {
    template?: string;
    git?: boolean;
    install?: boolean;
    [key: string]: any;
  }

  export function createNewApp(projectName: string, options?: CreateAppOptions): Promise<void>;
  export function createApp(projectName: string, options?: CreateAppOptions): Promise<void>;
  export default function(projectName: string, options?: CreateAppOptions): Promise<void>;
}