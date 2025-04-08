# fix-project.ps1
Write-Host "Cleaning up project structure..." -ForegroundColor Cyan

# Check if src/dist exists and fix it
if (Test-Path -Path .\src\dist) {
    Write-Host "Found src/dist directory - moving contents to proper location..." -ForegroundColor Yellow
    
    # Ensure dist directory exists at root
    if (-Not (Test-Path -Path .\dist)) {
        New-Item -Path .\dist -ItemType Directory | Out-Null
    }
    
    # Copy contents
    Copy-Item -Path .\src\dist\* -Destination .\dist -Recurse -Force
    Remove-Item -Path .\src\dist -Recurse -Force
    
    Write-Host "Fixed: Moved content from src/dist to dist/" -ForegroundColor Green
}

# Clean build output
Write-Host "Cleaning build output..." -ForegroundColor Cyan
if (Test-Path -Path .\dist) {
    Remove-Item -Path .\dist\* -Recurse -Force
    Write-Host "Cleaned dist directory" -ForegroundColor Green
} else {
    New-Item -Path .\dist -ItemType Directory | Out-Null
    Write-Host "Created dist directory" -ForegroundColor Green
}

# Ensure critical directories exist
$requiredDirs = @(
    ".\src\bin",
    ".\src\lib",
    ".\src\scripts",
    ".\src\templates",
    ".\src\utils"
)

foreach ($dir in $requiredDirs) {
    if (-Not (Test-Path -Path $dir)) {
        New-Item -Path $dir -ItemType Directory | Out-Null
        Write-Host "Created directory: $dir" -ForegroundColor Yellow
    }
}

# Create the version file
$versionContent = "export const version = '0.1.0';"
$versionPath = ".\src\utils\version.ts"
Set-Content -Path $versionPath -Value $versionContent -Force
Write-Host "Created version file: $versionPath" -ForegroundColor Green

# Fix tsconfig.json to support JSX
$tsconfigPath = ".\tsconfig.json"
if (Test-Path -Path $tsconfigPath) {
    $tsconfig = Get-Content -Path $tsconfigPath -Raw | ConvertFrom-Json
    $tsconfig.compilerOptions.jsx = "react-jsx"
    $tsconfig.compilerOptions.jsxImportSource = "react"
    $tsconfig | ConvertTo-Json -Depth 10 | Set-Content -Path $tsconfigPath -Force
    Write-Host "Updated tsconfig.json with JSX support" -ForegroundColor Green
} else {
    Write-Host "Creating new tsconfig.json with proper settings..." -ForegroundColor Yellow
    $tsconfigContent = @"
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "declaration": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
"@
    Set-Content -Path $tsconfigPath -Value $tsconfigContent -Force
    Write-Host "Created new tsconfig.json" -ForegroundColor Green
}

Write-Host "Project structure cleanup complete!" -ForegroundColor Green