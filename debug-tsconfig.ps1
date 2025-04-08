Write-Host "==> Debugging clean-tsconfig.ts issue..." -ForegroundColor Cyan

# Read the current file
$tsconfigPath = ".\src\scripts\clean-tsconfig.ts"
$content = Get-Content $tsconfigPath -Raw

# Output the problematic area (around line 11)
Write-Host "`nContent around line 11:" -ForegroundColor Yellow
$lines = $content -split "`n"
$startLine = [Math]::Max(1, 11 - 5)
$endLine = [Math]::Min($lines.Count, 11 + 5)

for ($i = $startLine; $i -le $endLine; $i++) {
    if ($i -eq 11) {
        Write-Host "$i : $($lines[$i-1])" -ForegroundColor Red
    }
    else {
        Write-Host "$i : $($lines[$i-1])"
    }
}

# Create a fixed version directly
Write-Host "`n==> Creating fixed clean-tsconfig.ts file..." -ForegroundColor Green

$fixedContent = @'
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
    // Read and parse the tsconfig file
    const content = fs.readFileSync(filePath, 'utf8');
    const tsconfig = JSON.parse(content);
    
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
'@

# Backup the original file
$backupPath = "$tsconfigPath.bak"
Copy-Item $tsconfigPath $backupPath
Write-Host "Original file backed up to: $backupPath"

# Write the fixed content
Set-Content $tsconfigPath $fixedContent
Write-Host "Fixed file written to: $tsconfigPath"

Write-Host "`n==> Debug complete. Try running your script again." -ForegroundColor Cyan