import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

/**
 * Cleans up tsconfig.json files to remove unnecessary includes
 */
export async function cleanTsConfigs(projectPath: string) {
  console.log(chalk.blue('🧹 Cleaning tsconfig.json files...'));

  try {
    // Check if projectPath is a file (direct tsconfig path)
    const stats = fs.statSync(projectPath);
    
    if (stats.isFile() && path.basename(projectPath).startsWith('tsconfig')) {
      // Process single tsconfig file
      processConfigFile(projectPath);
    } else if (stats.isDirectory()) {
      // Process all tsconfig files in directory
      const files = fs.readdirSync(projectPath);
      
      for (const file of files) {
        const filePath = path.join(projectPath, file);
        
        if (fs.statSync(filePath).isFile() && file.startsWith('tsconfig')) {
          processConfigFile(filePath);
        }
      }
    } else {
      console.log(chalk.yellow(`⚠️ ${projectPath} is neither a tsconfig file nor a directory`));
    }
    
    console.log(chalk.green('✅ tsconfig cleanup completed'));
  } catch (err) {
    console.error(chalk.red(`❌ Error cleaning tsconfig files: ${err}`));
  }
}

/**
 * Process a single tsconfig file
 */
function processConfigFile(filePath: string) {
  const fileName = path.basename(filePath);
  console.log(chalk.gray(`  Processing ${fileName}...`));
  
  try {
    // Read the tsconfig file
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Try to parse JSON, handle common issues like comments
    let tsconfig;
    try {
      tsconfig = JSON.parse(content);
    } catch (jsonError) {
      // Try to fix common JSON issues
      console.warn(chalk.yellow(`  ⚠️ JSON parse error in ${fileName}, attempting to fix formatting...`));
      
      // If it's a Vite-generated tsconfig, it might use JavaScript-style comments or trailing commas
      // Let's try a more lenient approach by using a regexp to clean it up
      const cleanedContent = content
        .replace(/\/\/.*$/gm, '') // Remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
        .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
      
      try {
        tsconfig = JSON.parse(cleanedContent);
        console.log(chalk.green(`  ✅ Successfully fixed and parsed ${fileName}`));
      } catch (secondError) {
        if (secondError instanceof Error) {
          throw new Error(`Could not parse JSON even after cleaning: ${secondError.message}`);
        } else {
          throw new Error('Could not parse JSON even after cleaning: Unknown error');
        }
      }
    }
    
    // Check if it has includes
    if (tsconfig.include) {
      const originalIncludes = [...tsconfig.include];
      
      // Filter out node_modules and unnecessary patterns
      tsconfig.include = tsconfig.include.filter((pattern: string) => {
        return (
          !pattern.includes('node_modules') &&
          !pattern.endsWith('**/*')
        );
      });
      
      // Add basic include patterns if none left
      if (tsconfig.include.length === 0) {
        tsconfig.include = ['src/**/*.ts', 'src/**/*.tsx'];
      }
      
      // Only write if changed
      if (JSON.stringify(originalIncludes) !== JSON.stringify(tsconfig.include)) {
        fs.writeFileSync(filePath, JSON.stringify(tsconfig, null, 2));
        console.log(chalk.green(`  ✅ Updated ${fileName}`));
      } else {
        console.log(chalk.gray(`  ⏭️ No changes needed for ${fileName}`));
      }
    } else {
      console.log(chalk.gray(`  ⏭️ No includes found in ${fileName}`));
    }
  } catch (err) {
    console.warn(chalk.yellow(`  ⚠️ Error processing ${fileName}: ${err}`));
  }
}