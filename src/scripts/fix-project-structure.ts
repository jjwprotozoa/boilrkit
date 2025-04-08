#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

// Check if src/dist exists
const srcDistPath = path.join(projectRoot, 'src', 'dist');
if (fs.existsSync(srcDistPath)) {
  console.log('Found dist directory inside src - fixing project structure...');
  
  // Create proper dist directory if it doesn't exist
  const distPath = path.join(projectRoot, 'dist');
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }
  
  // Move contents from src/dist to dist
  fs.readdirSync(srcDistPath, { withFileTypes: true }).forEach(entry => {
    const srcPath = path.join(srcDistPath, entry.name);
    const destPath = path.join(distPath, entry.name);
    
    if (fs.existsSync(destPath)) {
      fs.rmSync(destPath, { recursive: true, force: true });
    }
    
    if (entry.isDirectory()) {
      fs.cpSync(srcPath, destPath, { recursive: true });
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
  
  // Remove src/dist
  fs.rmSync(srcDistPath, { recursive: true, force: true });
  
  console.log('Project structure fixed. Moved src/dist contents to dist/');
}

console.log('Done.');