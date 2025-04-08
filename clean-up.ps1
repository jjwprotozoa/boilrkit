param(
    [Parameter(Mandatory = $true)]
    [string]$directoryPath
)

function Update-FileExtensions {
    param([string]$directory)
  
    Write-Host "Processing directory: $directory"

    $files = Get-ChildItem -Path $directory -File
    foreach ($file in $files) {
        $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
        if ($null -eq $content) {
            Write-Warning "Could not read content of $($file.FullName)"
            continue
        }

        $extension = ""

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

        # Remove any extra extensions
        if ($file.Name -match "\.d\.ts.*$") {
            $fileNameWithoutExtension = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
        }
        else {
            $fileNameWithoutExtension = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
        }

        # If the file has a different extension than expected, rename it
        $newName = "$fileNameWithoutExtension$extension"

        # Skip if the file already has the correct extension
        if ($file.Name -ne $newName) {
            Rename-Item -Path $file.FullName -NewName $newName -Force
            Write-Host "Renamed $($file.Name) -> $newName"
        }
    }

    # Process subdirectories
    $subdirs = Get-ChildItem -Path $directory -Directory
    foreach ($subdir in $subdirs) {
        Update-FileExtensions -directory $subdir.FullName
    }
}

Update-FileExtensions -directory $directoryPath
Write-Host "✅ File extension updating complete!" -ForegroundColor Green
