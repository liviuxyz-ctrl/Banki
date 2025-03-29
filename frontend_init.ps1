<#
.SYNOPSIS
  Frontend-only setup for React Native with Expo and React Navigation
.DESCRIPTION
  Run this from your project root to setup the frontend folder
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


# Check if running from project root
if (-not (Test-Path "frontend")) {
    New-Item -ItemType Directory -Path "frontend" -Force | Out-Null
}

# Move to frontend directory
Set-Location frontend

try {
    Write-Host "🚀 Starting Expo app setup..." -ForegroundColor Cyan

    # 1. Create Expo app (auto-accept all prompts)
    npx create-expo-app@latest . --template blank --yes

    # 2. Install Expo-managed dependencies
    Write-Host "📦 Installing Expo packages..." -ForegroundColor Yellow
    expo install react-native-gesture-handler react-native-reanimated `
        react-native-screens react-native-safe-area-context `
        @react-native-community/masked-view

    # 3. Install React Navigation and axios
    Write-Host "📦 Installing React Navigation..." -ForegroundColor Yellow
    npm install @react-navigation/native @react-navigation/stack axios

    # 4. Configure Reanimated (silent overwrite)
    $content = @'
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: ['react-native-reanimated/plugin']
}
'@

    # Create an instance of UTF8Encoding without BOM
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)

    # Write the content to babel.config.js with UTF-8 encoding (without BOM)
    [System.IO.File]::WriteAllText("babel.config.js", $content, $utf8NoBom)


    Write-Host "✅ Frontend setup completed!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Setup failed: $_" -ForegroundColor Red
    exit 1
}
finally {
    # Return to original directory
    Set-Location ..
}

Write-Host "`nNext steps:" -ForegroundColor Magenta
Write-Host "1. cd frontend"
Write-Host "2. expo start"
Write-Host "3. Press 'i' (iOS) or 'a' (Android)" -ForegroundColor White -BackgroundColor DarkMagenta