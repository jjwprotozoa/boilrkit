import chalk from 'chalk';
import fs from 'fs-extra';
export async function createMCPFile() {
    try {
        const mcpContent = JSON.stringify([
            { label: '▶️ Start Dev', command: 'yarn dev' },
            { label: '🚀 Build', command: 'yarn build' },
            { label: '🧹 Format Code', command: 'yarn format' },
            { label: '🧪 Run Tests', command: 'yarn test' },
            { label: '📦 Install Deps', command: 'yarn install' },
            { label: '🔧 Directory Summary', command: 'powershell -ExecutionPolicy Bypass -File ./directory-summary.ps1' },
            { label: '🧱 Add Firebase', command: 'boilrkit add auth' },
            { label: '🧭 Add Router', command: 'boilrkit add router' },
            { label: '🧠 Add AI', command: 'boilrkit add ai' },
            { label: '📱 Add PWA', command: 'boilrkit add pwa' },
            { label: '💳 Add Payments', command: 'boilrkit add payments' },
            { label: '🧭 Open VS Code', command: 'code .' },
            { label: '🔍 Open MCP Launcher', command: 'npx mcp' },
            { label: '🧰 Launch GUI Launcher', command: 'npx boilrkit-gui' },
            { label: '🗑️ Clean Dist Folder', command: 'powershell -Command "Remove-Item -Recurse -Force ./dist"' }
        ], null, 2);
        fs.writeFileSync('mcp.json', mcpContent);
        console.log(chalk.green('✅ MCP button file created'));
    }
    catch (error) {
        console.error(chalk.red(`❌ Failed to create MCP button file: ${error}`));
        throw error;
    }
}
export async function setupPWA() {
    const viteConfigPath = 'vite.config.ts';
    if (!fs.existsSync(viteConfigPath)) {
        console.warn(chalk.yellow('vite.config.ts not found. Creating new configuration file.'));
        const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Your App Name',
        short_name: 'App',
        description: 'Your app description',
        theme_color: '#ffffff',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ]
});`;
        fs.writeFileSync(viteConfigPath, viteConfig);
        return;
    }
    let viteConfig = fs.readFileSync(viteConfigPath, 'utf-8');
    if (viteConfig.includes('vite-plugin-pwa')) {
        console.log(chalk.yellow('PWA already configured in vite.config.ts'));
        return;
    }
    if (!viteConfig.includes('VitePWA')) {
        viteConfig = viteConfig.replace(/import.*from ['"]@vitejs\/plugin-react['"];/, `import react from '@vitejs/plugin-react';\nimport { VitePWA } from 'vite-plugin-pwa';`);
    }
    viteConfig = viteConfig.replace(/plugins:\s*\[\s*react\(\)/, `plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Your App Name',
        short_name: 'App',
        description: 'Your app description',
        theme_color: '#ffffff',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })`);
    fs.writeFileSync(viteConfigPath, viteConfig);
    fs.ensureDirSync('public');
    console.log(chalk.yellow('\nNOTE: You need to create the following PWA assets in your public directory:'));
    console.log('- favicon.svg');
    console.log('- robots.txt');
    console.log('- apple-touch-icon.png');
    console.log('- pwa-192x192.png');
    console.log('- pwa-512x512.png');
}


