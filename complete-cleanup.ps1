param(
    [Parameter(Mandatory = $true)]
    [string]$directoryPath
)

function Get-NormalizedFileName {
    param([string]$fileName)
    
    # Extract base name (everything before any extension)
    $baseName = $fileName -replace "\..*$", ""
    
    # Handle declaration files - convert any complex pattern to simple .d.ts
    if ($fileName -match "\.d\.ts\.tsx\.d\.d\.ts$" -or 
        $fileName -match "\.d\.ts\.tsx\.d\.ts$" -or
        $fileName -match "\.d\.d\.d\.ts$" -or
        $fileName -match "\.d\.d\.ts$") {
        return "$baseName.d.ts"
    }
    
    # Handle other problematic extensions
    elseif ($fileName -match "\.ts\.ts$") {
        return ($fileName -replace "\.ts\.ts$", ".ts")
    }
    elseif ($fileName -match "\.ts\.tsx$") {
        return ($fileName -replace "\.ts\.tsx$", ".tsx")
    }
    elseif ($fileName -match "\.tsx\.ts$") {
        return ($fileName -replace "\.tsx\.ts$", ".tsx")
    }
    elseif ($fileName -match "\.js\.ts$") {
        return ($fileName -replace "\.js\.ts$", ".ts")
    }
    elseif ($fileName -match "\.js\.tsx$") {
        return ($fileName -replace "\.js\.tsx$", ".tsx")
    }
    elseif ($fileName -match "\.js\.js$") {
        return ($fileName -replace "\.js\.js$", ".js")
    }
    
    # For other files, just return the original name
    return $fileName
}

function Update-FileExtensions {
    param([string]$directory)
  
    Write-Host "Processing directory: $directory" -ForegroundColor Cyan
    
    # First, collect all files and determine their correct names
    $files = Get-ChildItem -Path $directory -File
    $fileMap = @{}
    $duplicates = @{}
    
    foreach ($file in $files) {
        $originalName = $file.Name
        $normalizedName = Get-NormalizedFileName -fileName $originalName
        
        # Determine proper extension based on content if it's not a declaration file
        if (-not ($normalizedName -match "\.d\.ts$")) {
            $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
            if ($null -eq $content) {
                Write-Warning "Could not read content of $($file.FullName)"
                continue
            }
            
            # Extract base name without extensions
            $baseName = [System.IO.Path]::GetFileNameWithoutExtension($normalizedName)
            
            # Determine file type based on content
            if ($content -match "import React" -or 
                $content -match "<.*>.*<\/.*>" -or 
                $content -match "from 'react'" -or
                $content -match "jsx|tsx" -or
                $originalName -match "\.tsx$|\.jsx$") {
                $extension = ".tsx"
            }
            elseif ($content -match "import " -or $content -match "export ") {
                $extension = ".ts"
            }
            else {
                $extension = ".js"
            }
            
            $normalizedName = "$baseName$extension"
        }
        
        # Track original files and potential duplicates
        if ($fileMap.ContainsKey($normalizedName)) {
            if (-not $duplicates.ContainsKey($normalizedName)) {
                $duplicates[$normalizedName] = @($fileMap[$normalizedName])
            }
            $duplicates[$normalizedName] += $file
        }
        else {
            $fileMap[$normalizedName] = $file
        }
    }
    
    # Handle duplicates - keep the most recently modified file
    foreach ($normName in $duplicates.Keys) {
        $dupeFiles = $duplicates[$normName]
        Write-Host "Found duplicate files for '$normName':" -ForegroundColor Yellow
        
        # Sort by last write time descending
        $sortedFiles = $dupeFiles | Sort-Object -Property LastWriteTime -Descending
        
        # Keep the most recent file
        $fileToKeep = $sortedFiles[0]
        $fileMap[$normName] = $fileToKeep
        
        # Mark others for deletion
        for ($i = 1; $i -lt $sortedFiles.Count; $i++) {
            Write-Host "  Will remove duplicate: $($sortedFiles[$i].FullName)" -ForegroundColor Red
            Remove-Item -Path $sortedFiles[$i].FullName -Force
        }
    }
    
    # Rename files with their normalized names
    foreach ($normalizedName in $fileMap.Keys) {
        $file = $fileMap[$normalizedName]
        if ($file.Name -ne $normalizedName) {
            Write-Host "Renaming $($file.Name) -> $normalizedName" -ForegroundColor Green
            Rename-Item -Path $file.FullName -NewName $normalizedName -Force
        }
    }
    
    # Process subdirectories
    $subdirs = Get-ChildItem -Path $directory -Directory
    foreach ($subdir in $subdirs) {
        Update-FileExtensions -directory $subdir.FullName
    }
}

function Fix-RemainingIssues {
    param([string]$directory)
  
    Write-Host "Checking for remaining issues in: $directory" -ForegroundColor Cyan
    $files = Get-ChildItem -Path $directory -File -Recurse

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
        
        # Fix any .js.js files
        if ($file.Name -match "\.js\.js$") {
            $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
            
            # Determine the correct extension
            $extension = ".js"
            if ($content -match "import " -or $content -match "export ") {
                $extension = ".ts"
            }
            if ($content -match "import React" -or $content -match "<.*>.*<\/.*>" -or $content -match "from 'react'") {
                $extension = ".tsx"
            }
            
            $baseName = $file.Name -replace "\.js\.js$", ""
            $newName = "$baseName$extension"
            Write-Host "Fixing double .js file: $($file.Name) -> $newName" -ForegroundColor Yellow
            Rename-Item -Path $file.FullName -NewName $newName -Force
        }
    }
}

# Start the cleanup process
Write-Host "Starting project structure cleanup..." -ForegroundColor Magenta

# First pass - normalize extensions and remove duplicates
Update-FileExtensions -directory $directoryPath

# Second pass - fix any remaining issues
Fix-RemainingIssues -directory $directoryPath

Write-Host "✅ Project structure cleanup complete!" -ForegroundColor Green
Write-Host "Duplicates have been removed and file extensions normalized." -ForegroundColor Green

# Generate a simple project structure report
Write-Host "`nGenerated Project Structure:" -ForegroundColor Cyan
$fileCount = (Get-ChildItem -Path $directoryPath -File -Recurse).Count
Write-Host "Total Files: $fileCount" -ForegroundColor White

# Display file types summary
$fileTypes = @{}
Get-ChildItem -Path $directoryPath -File -Recurse | ForEach-Object {
    $ext = [System.IO.Path]::GetExtension($_.Name)
    if (-not $fileTypes.ContainsKey($ext)) {
        $fileTypes[$ext] = 0
    }
    $fileTypes[$ext]++
}

Write-Host "`nFile Types Summary:" -ForegroundColor Cyan
foreach ($ext in ($fileTypes.Keys | Sort-Object)) {
    Write-Host "$ext : $($fileTypes[$ext]) files" -ForegroundColor White
}

Write-Host "`n✅ CLEANUP COMPLETE! ✅" -ForegroundColor Green
Write-Host "All file extensions have been normalized and duplicates removed." -ForegroundColor Green
Write-Host "Your project structure is now clean and consistent." -ForegroundColor Green