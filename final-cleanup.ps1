param(
    [Parameter(Mandatory = $true)]
    [string]$directoryPath
)

# This script does a second-pass cleanup to fix any remaining issues

function Fix-RemainingIssues {
    param([string]$directory)
  
    Write-Host "Processing directory: $directory" -ForegroundColor Cyan
    $files = Get-ChildItem -Path $directory -File

    # Check for specific problematic files we need to fix
    foreach ($file in $files) {
        # Fix NotFound.ts that should be NotFound.tsx
        if ($file.Name -eq "NotFound.ts") {
            $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
            if ($content -match "import React" -or $content -match "<.*>.*<\/.*>") {
                Write-Host "Fixing incorrectly renamed file: $($file.FullName)" -ForegroundColor Yellow
                Rename-Item -Path $file.FullName -NewName "NotFound.tsx" -Force
            }
        }
        
        # Fix any remaining .d.ts.tsx.d.ts files
        if ($file.Name -match "\.d\.ts\.tsx\.d\.ts$") {
            $baseName = $file.Name -replace "\.d\.ts\.tsx\.d\.ts$", ""
            $newName = "$baseName.d.ts"
            Write-Host "Fixing complex .d.ts file: $($file.Name) -> $newName" -ForegroundColor Yellow
            Rename-Item -Path $file.FullName -NewName $newName -Force
        }
    }
    
    # Process subdirectories
    $subdirs = Get-ChildItem -Path $directory -Directory
    foreach ($subdir in $subdirs) {
        Fix-RemainingIssues -directory $subdir.FullName
    }
}

# Start processing
Write-Host "Starting additional cleanup..." -ForegroundColor Magenta
Fix-RemainingIssues -directory $directoryPath
Write-Host "✅ Additional cleanup complete!" -ForegroundColor Green