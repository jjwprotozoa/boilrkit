param(
    [Parameter(Mandatory = $true)]
    [string]$directoryPath
)

function Update-FileExtensions {
    param([string]$directory)
  
    Write-Host "Processing directory: $directory"

    # Get all files in the directory (non-recursive for now)
    $files = Get-ChildItem -Path $directory
    $files = $files | Where-Object { -not $_.PSIsContainer }  # Filter out directories

    foreach ($file in $files) {
        $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
        if ($null -eq $content) {
            Write-Warning "Could not read content of $($file.FullName)"
            continue
        }

        $extension = ""
    
        # Skip .d.ts files (they should not be renamed)
        if ($file.Name -match '\.d\.ts$') {
            Write-Host "Skipping .d.ts file: $($file.Name)"
            continue
        }

        # Determine file type based on content
        if ($content -match "import React" -or $content -match "export default") {
            $extension = ".tsx"
        }
        elseif ($content -match "import " -or $content -match "export ") {
            $extension = ".ts"
        }
        else {
            $extension = ".js"
        }

        # Skip if file already has this extension
        if ($file.Name -notmatch [regex]::Escape($extension) + "$") {
            $newName = "$($file.Name)$extension"
            Rename-Item -Path $file.FullName -NewName $newName -Force
            Write-Host "Renamed $($file.Name) -> $newName"
        }
    }

    # Process subdirectories
    $subdirs = Get-ChildItem -Path $directory
    $subdirs = $subdirs | Where-Object { $_.PSIsContainer }  # Filter only directories

    foreach ($subdir in $subdirs) {
        Update-FileExtensions -directory $subdir.FullName
    }
}

Update-FileExtensions -directory $directoryPath
Write-Host "✅ File extension updating complete!" -ForegroundColor Green
