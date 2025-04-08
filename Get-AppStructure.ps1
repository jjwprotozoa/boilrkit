function Write-AppStructureTree {
    param (
        [string]$Path = ".",
        [string[]]$Extensions = @("*.ts", "*.tsx", "*.js", "*.jsx"),
        [string]$OutputFile = "app-structure.txt"
    )

    # Resolve full path and get timestamp
    $FullPath = Resolve-Path $Path
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

    # Collect files with full path information
    $allFiles = Get-ChildItem -Path $FullPath -Recurse -File -Include $Extensions -ErrorAction SilentlyContinue | 
    Where-Object { $_.FullName -notmatch "\\node_modules\\|\\dist\\|\\.d\\.ts$" } |
    Sort-Object FullName

    $total = $allFiles.Count
    $current = 0
    $tree = @{}
    $fileDetails = @()
    
    Write-Progress -Activity "Building app structure..." -Status "0% complete" -PercentComplete 0

    foreach ($file in $allFiles) {
        $relativePath = $file.FullName.Substring($FullPath.Path.Length + 1)
        $parts = $relativePath -split '\\'
        $branch = $tree

        # Build tree structure
        for ($i = 0; $i -lt $parts.Length; $i++) {
            $part = $parts[$i]
            if (-not $branch.ContainsKey($part)) {
                $branch[$part] = @{}
            }
            $branch = $branch[$part]
        }

        # Collect file details
        $fileDetails += @{
            RelativePath  = $relativePath
            FullPath      = $file.FullName
            Size          = $file.Length
            LastWriteTime = $file.LastWriteTime
        }

        $current++
        $percent = [math]::Round(($current / $total) * 100)
        Write-Progress -Activity "Building app structure..." -Status "$percent% complete" -PercentComplete $percent
    }

    function Format-TreeStructure($node, $prefix = "") {
        $output = ""
        foreach ($key in $node.Keys | Sort-Object) {
            $output += "$prefix$key`n"
            $output += Format-TreeStructure $node[$key] ($prefix + "  ")
        }
        return $output
    }

    # Prepare content with timestamp and details
    $content = @(
        "Project Structure Analysis",
        "========================",
        "Timestamp: $Timestamp",
        "Base Path: $FullPath",
        "Total Files: $total",
        "",
        "Directory Structure:",
        "-------------------"
    )

    # Add tree structure
    $content += (Format-TreeStructure $tree).Split("`n")

    $content += @(
        "",
        "Detailed File Information:",
        "-------------------------"
    )

    # Add file details
    foreach ($file in $fileDetails) {
        $content += "{0} (Size: {1} bytes, Last Modified: {2})" -f 
        $file.RelativePath, 
        $file.Size, 
        $file.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
    }

    # Write to file
    $content | Out-File -Encoding UTF8 -FilePath $OutputFile

    Write-Host "`n[✅ Done] Structure saved to $OutputFile" -ForegroundColor Green
    
    # Display the contents of the file
    Get-Content $OutputFile
}

# Alias for backward compatibility
Set-Alias Get-AppStructure Write-AppStructureTree

# Run it from current directory
Write-AppStructureTree -Path "."