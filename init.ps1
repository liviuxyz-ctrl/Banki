<#
.SYNOPSIS
  Initializes a new project with Node.js environment and folder structure
  add BOOM
#>

# Setup Node.js environment
Write-Host "Setting up development environment..." -ForegroundColor Cyan

# 1. Configure fnm environment
try {
    $envSetup = fnm env --use-on-cd --shell powershell | Out-String
    if (-not [string]::IsNullOrWhiteSpace($envSetup)) {
        Invoke-Expression $envSetup
        fnm use 22
        Write-Host "✓ Node.js v22 configured" -ForegroundColor Green
    } else {
        Write-Host "⚠ Could not configure Node.js environment" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ Error configuring Node.js: $_" -ForegroundColor Red
    exit 1
}

# 2. Create project folders
$foldersToCreate = @("backend", "frontend")

foreach ($folder in $foldersToCreate) {
    try {
        if (-not (Test-Path -Path $folder)) {
            New-Item -ItemType Directory -Path $folder -Force | Out-Null
            Write-Host "✓ Created directory: ./$folder" -ForegroundColor Green
        } else {
            Write-Host "ℹ Directory exists: ./$folder" -ForegroundColor Blue
        }
    }
    catch {
        Write-Host "❌ Failed to create $folder`: $_" -ForegroundColor Red
    }
}

Write-Host "`nSetup completed!`n" -ForegroundColor Cyan