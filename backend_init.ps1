<#
.SYNOPSIS
  Robust Strapi backend setup with complete error handling
.DESCRIPTION
  Handles both new setups and existing folders with validation
#>

# 0. Directory Validation
Write-Host "📂 Validating directory structure..." -ForegroundColor Cyan

try {
    # Check if we're already inside a backend folder
    if ((Split-Path -Leaf $PWD) -eq "backend") {
        Write-Host "❌ Error: Please run this script from the parent folder, not inside the backend folder" -ForegroundColor Red
        Write-Host "Move up one level and try again" -ForegroundColor Yellow
        exit 1
    }
}
catch {
    Write-Host "❌ Error during directory validation: $_" -ForegroundColor Red
    exit 1
}

# Define and ensure backend path exists
$backendPath = Join-Path $PWD "backend"

# 1. Node.js Environment Setup
Write-Host "🔧 Configuring Node.js environment..." -ForegroundColor Cyan

try {
    $envSetup = fnm env --use-on-cd --shell powershell | Out-String
    if (-not [string]::IsNullOrWhiteSpace($envSetup)) {
        Invoke-Expression $envSetup
        fnm use 22
        Write-Host "✓ Node.js v22 ready" -ForegroundColor Green
    }
    else {
        Write-Host "⚠ Node.js setup incomplete" -ForegroundColor Yellow
        exit 1
    }
}
catch {
    Write-Host "❌ Node.js configuration failed: $_" -ForegroundColor Red
    exit 1
}

# 2. Backend Folder Handling
try {
    if (Test-Path $backendPath) {
        Write-Host "ℹ Found existing backend folder" -ForegroundColor Blue

        # Validate existing backend
        if (-not (Test-Path "$backendPath/package.json")) {
            Write-Host "⚠ Backend folder exists but is invalid (missing package.json)" -ForegroundColor Yellow
            $choice = Read-Host "Delete and recreate? (y/n)"

            if ($choice -eq 'y') {
                Remove-Item $backendPath -Recurse -Force
                Write-Host "✓ Removed invalid backend" -ForegroundColor Green
            }
            else {
                Write-Host "❌ Setup aborted" -ForegroundColor Red
                exit 1
            }
        }
    }

    # Create backend folder if it doesn't exist
    if (-not (Test-Path $backendPath)) {
        Write-Host "📂 Creating backend directory..." -ForegroundColor Cyan
        New-Item -ItemType Directory -Path $backendPath -Force | Out-Null
        Write-Host "✓ Backend directory created" -ForegroundColor Green
    }

    # 3. Initialize Strapi
    Write-Host "🚀 Initializing Strapi backend..." -ForegroundColor Cyan
    Set-Location $backendPath

    if (-not (Test-Path "package.json")) {
        npx create-strapi-app . --quickstart `
            --skip-cloud`

        Write-Host "✓ Strapi scaffold complete" -ForegroundColor Green
    }
    else {
        Write-Host "ℹ Existing Strapi project found, skipping initialization" -ForegroundColor Blue
    }
}
catch {
    Write-Host "❌ Error during backend setup: $_" -ForegroundColor Red
    exit 1
}