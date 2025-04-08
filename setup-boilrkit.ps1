# setup-boilrkit.ps1
# Creates the base folder structure for BoilrKit project

$projectRoot = "."

# Create directories
$directories = @(
    "src",
    "src/lib",
    "src/templates",
    "src/templates/components",
    "src/templates/pages",
    "src/templates/layouts",
    "src/templates/stores",
    "bin"
)

foreach ($dir in $directories) {
    $path = Join-Path -Path $projectRoot -ChildPath $dir
    if (-not (Test-Path -Path $path)) {
        New-Item -ItemType Directory -Path $path -Force
        Write-Host "Created directory: $path"
    }
    else {
        Write-Host "Directory already exists: $path"
    }
}

# Create base files (placeholders for now)
$files = @{
    "package.json"    = "{ `"name`": `"boilrkit`", `"version`": `"0.1.0`", `"description`": `"Rapid React + Vite + Firebase SaaS app scaffolding`" }"
    "README.md"       = "# BoilrKit`n`nRapid React + Vite + Firebase SaaS app boilerplate with Tailwind, Zustand, Auth, GPT/Claude AI hooks, and one-click developer setup via CLI or MCP."
    "LICENSE"         = "MIT License"
    "bin/boilrkit.js" = "#!/usr/bin/env node`n`nconsole.log('BoilrKit CLI starting...');"
    ".gitignore"      = "node_modules/`n.DS_Store`n*.log`ndist/`n.env"
}

foreach ($file in $files.Keys) {
    $path = Join-Path -Path $projectRoot -ChildPath $file
    if (-not (Test-Path -Path $path)) {
        Set-Content -Path $path -Value $files[$file]
        Write-Host "Created file: $path"
    }
    else {
        Write-Host "File already exists: $path"
    }
}

Write-Host "`nBoilrKit structure created successfully!`n"
Write-Host "Next steps:"
Write-Host "1. Run 'npm init' to set up package.json properly"
Write-Host "2. Start implementing the core modules"