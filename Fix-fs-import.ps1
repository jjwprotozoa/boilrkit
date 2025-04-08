$timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$logPath = "fix-fs-import-log_$timestamp.txt"

# Step 1: Check for files
Write-Host "==> Scanning for files that need fs-extra imports fixed..." -ForegroundColor Cyan
"" | Out-File $logPath

$files = Get-ChildItem -Path . -Recurse -File | Where-Object {
    ($_.Extension -eq '.ts' -or $_.Extension -eq '.tsx') -and
    $_.FullName -notmatch 'node_modules' -and 
    $_.FullName -notmatch '\.git' -and 
    $_.FullName -notmatch 'dist' -and 
    $_.FullName -notmatch 'build' -and
    $_.FullName -notmatch '\.d\.ts$'
}

$changedFiles = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content

    # Replace: import fs from 'fs-extra';
    if ($content -match "import \* as fs from 'fs-extra'") {
        $content = $content -replace "import \* as fs from 'fs-extra';", "import fs from 'fs-extra';"
        Set-Content $file.FullName $content
        "Fixed 'fs-extra' import in: $($file.FullName)" | Tee-Object -FilePath $logPath -Append
        $changedFiles++
    }
}

Write-Host ""
Write-Host "==> Fixed fs-extra imports in $changedFiles files" -ForegroundColor Green
Write-Host "Log saved to: $logPath"