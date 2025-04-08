$timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$projectName = Split-Path -Path $PWD -Leaf
$backupPath = Join-Path -Path (Split-Path -Path $PWD -Parent) -ChildPath "backup_${projectName}_chalk_fix_$timestamp"
$logPath = "chalk-fix-log_$timestamp.txt"

# Step 1: Backup
Write-Host "==> Backing up project to: $backupPath" -ForegroundColor Cyan
New-Item -ItemType Directory -Path $backupPath -Force | Out-Null

# Create a list of files to copy, excluding common directories to skip
$filesToCopy = Get-ChildItem -Path . -Recurse -File | Where-Object {
    $_.FullName -notmatch 'node_modules' -and 
    $_.FullName -notmatch '\.git' -and 
    $_.FullName -notmatch 'dist' -and 
    $_.FullName -notmatch 'build'
}

# Copy files to backup location
foreach ($file in $filesToCopy) {
    $relativePath = $file.FullName.Substring($PWD.Path.Length + 1)
    $destinationPath = Join-Path -Path $backupPath -ChildPath $relativePath
    $destinationDir = Split-Path -Path $destinationPath -Parent
    
    # Create destination directory if it doesn't exist
    if (-not (Test-Path -Path $destinationDir)) {
        New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
    }
    
    # Copy the file
    Copy-Item -Path $file.FullName -Destination $destinationPath -Force
}

# Step 2: Scan and fix files
$files = Get-ChildItem -Path . -Recurse -File | Where-Object {
    ($_.Extension -eq '.ts' -or $_.Extension -eq '.tsx') -and
    $_.FullName -notmatch 'node_modules' -and 
    $_.FullName -notmatch '\.git' -and 
    $_.FullName -notmatch 'dist' -and 
    $_.FullName -notmatch 'build' -and
    $_.FullName -notmatch '\.d\.ts$'
}

Write-Host ""
Write-Host "==> Scanning $($files.Count) files for legacy chalk usage..." -ForegroundColor Yellow
"" | Out-File $logPath

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content

    # Replace: import * as chalk from 'chalk';
    $content = $content -replace "import \* as chalk from 'chalk';", "import chalk from 'chalk';"

    if ($content -ne $original) {
        Set-Content $file.FullName $content
        "Patched: $($file.FullName)" | Tee-Object -FilePath $logPath -Append
    }
}

Write-Host ""
Write-Host "==> Chalk fix complete!" -ForegroundColor Green
Write-Host "Log saved to: $logPath"
Write-Host "Backup saved to: $backupPath"