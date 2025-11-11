# ============================================================================
# TheBenjiBag: Complete Dependency Installation Script
# ============================================================================
# This PowerShell script automates the installation of all required
# dependencies for both Frontend and Backend development.
#
# Prerequisites: Windows 10/11 with PowerShell 5.1+
# Run as Administrator for best results
# ============================================================================

Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "  TheBenjiBag: Complete Dependency Installation" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# STEP 1: Check PowerShell Version
# ============================================================================
Write-Host "[STEP 1] Checking PowerShell version..." -ForegroundColor Yellow
$psVersion = $PSVersionTable.PSVersion.Major
Write-Host "PowerShell version: $psVersion" -ForegroundColor Green

if ($psVersion -lt 5) {
    Write-Host "ERROR: PowerShell 5.1 or higher is required." -ForegroundColor Red
    Write-Host "Please upgrade PowerShell: https://docs.microsoft.com/en-us/powershell/" -ForegroundColor Red
    exit 1
}

# ============================================================================
# STEP 2: Check for Administrator Privileges
# ============================================================================
Write-Host "`n[STEP 2] Checking administrator privileges..." -ForegroundColor Yellow
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "WARNING: Not running as Administrator. Some installations may fail." -ForegroundColor Yellow
    Write-Host "It is recommended to run this script as Administrator." -ForegroundColor Yellow
    $continue = Read-Host "Do you want to continue anyway? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Installation cancelled." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Running with Administrator privileges." -ForegroundColor Green
}

# ============================================================================
# STEP 3: Install Chocolatey Package Manager
# ============================================================================
Write-Host "`n[STEP 3] Installing Chocolatey package manager..." -ForegroundColor Yellow

if (Get-Command choco -ErrorAction SilentlyContinue) {
    Write-Host "Chocolatey is already installed." -ForegroundColor Green
    choco --version
} else {
    Write-Host "Installing Chocolatey..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    try {
        Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        Write-Host "Chocolatey installed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Failed to install Chocolatey." -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        exit 1
    }
}

# ============================================================================
# STEP 4: Install Node.js LTS
# ============================================================================
Write-Host "`n[STEP 4] Installing Node.js LTS..." -ForegroundColor Yellow

if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "Node.js is already installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "Installing Node.js LTS via Chocolatey..." -ForegroundColor Yellow
    choco install nodejs-lts -y
    
    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    if (Get-Command node -ErrorAction SilentlyContinue) {
        $nodeVersion = node --version
        Write-Host "Node.js installed successfully: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Node.js installation failed." -ForegroundColor Red
        exit 1
    }
}

# Verify npm is installed
if (Get-Command npm -ErrorAction SilentlyContinue) {
    $npmVersion = npm --version
    Write-Host "npm is available: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "ERROR: npm is not available." -ForegroundColor Red
    exit 1
}

# ============================================================================
# STEP 5: Install Git
# ============================================================================
Write-Host "`n[STEP 5] Installing Git..." -ForegroundColor Yellow

if (Get-Command git -ErrorAction SilentlyContinue) {
    $gitVersion = git --version
    Write-Host "Git is already installed: $gitVersion" -ForegroundColor Green
} else {
    Write-Host "Installing Git via Chocolatey..." -ForegroundColor Yellow
    choco install git -y
    
    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    if (Get-Command git -ErrorAction SilentlyContinue) {
        $gitVersion = git --version
        Write-Host "Git installed successfully: $gitVersion" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Git installation failed." -ForegroundColor Red
        exit 1
    }
}

# ============================================================================
# STEP 6: Install pnpm (Optional but Recommended)
# ============================================================================
Write-Host "`n[STEP 6] Installing pnpm..." -ForegroundColor Yellow

if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    $pnpmVersion = pnpm --version
    Write-Host "pnpm is already installed: $pnpmVersion" -ForegroundColor Green
} else {
    Write-Host "Installing pnpm globally via npm..." -ForegroundColor Yellow
    npm install -g pnpm
    
    if (Get-Command pnpm -ErrorAction SilentlyContinue) {
        $pnpmVersion = pnpm --version
        Write-Host "pnpm installed successfully: $pnpmVersion" -ForegroundColor Green
    } else {
        Write-Host "WARNING: pnpm installation failed. You can still use npm." -ForegroundColor Yellow
    }
}

# ============================================================================
# STEP 7: Verify Project Structure
# ============================================================================
Write-Host "`n[STEP 7] Verifying project structure..." -ForegroundColor Yellow

$projectRoot = Get-Location
$backendPath = Join-Path $projectRoot "Backend"
$frontendPath = Join-Path $projectRoot "Frontend"

if (-not (Test-Path $backendPath)) {
    Write-Host "ERROR: Backend folder not found at: $backendPath" -ForegroundColor Red
    Write-Host "Please ensure you are running this script from the TheBenjiBag root directory." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $frontendPath)) {
    Write-Host "ERROR: Frontend folder not found at: $frontendPath" -ForegroundColor Red
    Write-Host "Please ensure you are running this script from the TheBenjiBag root directory." -ForegroundColor Red
    exit 1
}

Write-Host "Project structure verified." -ForegroundColor Green
Write-Host "  Backend: $backendPath" -ForegroundColor Cyan
Write-Host "  Frontend: $frontendPath" -ForegroundColor Cyan

# ============================================================================
# STEP 8: Install Backend Dependencies
# ============================================================================
Write-Host "`n[STEP 8] Installing Backend dependencies..." -ForegroundColor Yellow

Push-Location $backendPath

# Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Host "WARNING: package.json not found in Backend folder." -ForegroundColor Yellow
    Write-Host "Creating a basic package.json..." -ForegroundColor Yellow
    
    $packageJson = @{
        name = "thebenjibag-backend"
        version = "1.0.0"
        description = "TheBenjiBag Backend Server"
        main = "server.js"
        scripts = @{
            start = "node server.js"
            dev = "nodemon server.js"
        }
        dependencies = @{
            express = "^4.18.2"
            mongoose = "^8.0.0"
            cors = "^2.8.5"
            dotenv = "^16.3.1"
            "socket.io" = "^4.6.1"
            "@trpc/server" = "^11.0.0"
            nodemailer = "^6.9.7"
            jsonwebtoken = "^9.0.2"
            bcryptjs = "^2.4.3"
        }
        devDependencies = @{
            nodemon = "^3.0.1"
        }
    }
    
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json"
    Write-Host "package.json created." -ForegroundColor Green
}

Write-Host "Running npm install in Backend..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "Backend dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "ERROR: Failed to install Backend dependencies." -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location

# ============================================================================
# STEP 9: Install Frontend Dependencies
# ============================================================================
Write-Host "`n[STEP 9] Installing Frontend dependencies..." -ForegroundColor Yellow

Push-Location $frontendPath

# Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Host "WARNING: package.json not found in Frontend folder." -ForegroundColor Yellow
    Write-Host "Creating a basic package.json..." -ForegroundColor Yellow
    
    $packageJson = @{
        name = "thebenjibag-frontend"
        version = "1.0.0"
        description = "TheBenjiBag Frontend Application"
        type = "module"
        scripts = @{
            dev = "vite"
            build = "vite build"
            preview = "vite preview"
        }
        dependencies = @{
            react = "^19.0.0"
            "react-dom" = "^19.0.0"
            "@trpc/client" = "^11.0.0"
            "@trpc/react-query" = "^11.0.0"
            "@tanstack/react-query" = "^5.0.0"
            "socket.io-client" = "^4.6.1"
        }
        devDependencies = @{
            "@vitejs/plugin-react" = "^4.2.0"
            vite = "^5.0.0"
            tailwindcss = "^4.0.0"
            postcss = "^8.4.32"
            autoprefixer = "^10.4.16"
        }
    }
    
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json"
    Write-Host "package.json created." -ForegroundColor Green
}

Write-Host "Running npm install in Frontend..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "Frontend dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "ERROR: Failed to install Frontend dependencies." -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location

# ============================================================================
# STEP 10: Installation Summary
# ============================================================================
Write-Host "`n============================================================================" -ForegroundColor Cyan
Write-Host "  Installation Complete!" -ForegroundColor Green
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Installed Tools:" -ForegroundColor Yellow
Write-Host "  - Node.js: $(node --version)" -ForegroundColor Green
Write-Host "  - npm: $(npm --version)" -ForegroundColor Green
Write-Host "  - Git: $(git --version)" -ForegroundColor Green

if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    Write-Host "  - pnpm: $(pnpm --version)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Configure your .env file in the Backend directory" -ForegroundColor Cyan
Write-Host "  2. Set up MongoDB Atlas and get your connection string" -ForegroundColor Cyan
Write-Host "  3. Run 'npm start' in Backend folder to start the server" -ForegroundColor Cyan
Write-Host "  4. Run 'npm run dev' in Frontend folder to start the UI" -ForegroundColor Cyan
Write-Host ""
Write-Host "For detailed setup instructions, see Setup_Guide.md" -ForegroundColor Yellow
Write-Host "============================================================================" -ForegroundColor Cyan
