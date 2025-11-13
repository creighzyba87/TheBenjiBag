# ============================================================================
# TheBenjiBag: Complete Setup and GitHub Deployment Script
# ============================================================================
# This script performs the following actions:
# 1. Installs all required dependencies (Chocolatey, Node.js, Git, pnpm)
# 2. Installs Backend and Frontend npm packages
# 3. Initializes Git repository
# 4. Pushes to GitHub repository: Creighzyba87/TheBenjiBag
#
# Prerequisites: 
# - Windows 10/11 with PowerShell 5.1+
# - Run as Administrator
# - GitHub account credentials ready
# ============================================================================

# Script Configuration
$PROJECT_PATH = "C:\TheBenjiBag"
$GITHUB_USERNAME = "Creighzyba87"
$GITHUB_REPO = "TheBenjiBag"
$GITHUB_REPO_URL = "https://github.com/$GITHUB_USERNAME/$GITHUB_REPO.git"

Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "  TheBenjiBag: Complete Setup and GitHub Deployment" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Project Path: $PROJECT_PATH" -ForegroundColor Yellow
Write-Host "GitHub Repo: $GITHUB_REPO_URL" -ForegroundColor Yellow
Write-Host ""

# ============================================================================
# STEP 1: Verify Administrator Privileges
# ============================================================================
Write-Host "[STEP 1/10] Checking administrator privileges..." -ForegroundColor Yellow
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator." -ForegroundColor Red
    Write-Host "Please right-click PowerShell and select 'Run as Administrator'." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✓ Running with Administrator privileges." -ForegroundColor Green

# ============================================================================
# STEP 2: Verify Project Directory Exists
# ============================================================================
Write-Host "`n[STEP 2/10] Verifying project directory..." -ForegroundColor Yellow

if (-not (Test-Path $PROJECT_PATH)) {
    Write-Host "ERROR: Project directory not found at: $PROJECT_PATH" -ForegroundColor Red
    Write-Host "Please ensure the TheBenjiBag folder exists at C:\TheBenjiBag" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Set-Location $PROJECT_PATH
Write-Host "✓ Project directory found: $PROJECT_PATH" -ForegroundColor Green

# ============================================================================
# STEP 3: Install Chocolatey Package Manager
# ============================================================================
Write-Host "`n[STEP 3/10] Installing Chocolatey package manager..." -ForegroundColor Yellow

if (Get-Command choco -ErrorAction SilentlyContinue) {
    Write-Host "✓ Chocolatey is already installed." -ForegroundColor Green
} else {
    Write-Host "Installing Chocolatey..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    try {
        Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        Write-Host "✓ Chocolatey installed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Failed to install Chocolatey." -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# ============================================================================
# STEP 4: Install Node.js LTS
# ============================================================================
Write-Host "`n[STEP 4/10] Installing Node.js LTS..." -ForegroundColor Yellow

if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is already installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "Installing Node.js LTS via Chocolatey..." -ForegroundColor Yellow
    choco install nodejs-lts -y
    
    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    if (Get-Command node -ErrorAction SilentlyContinue) {
        $nodeVersion = node --version
        Write-Host "✓ Node.js installed successfully: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Node.js installation failed." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# ============================================================================
# STEP 5: Install Git
# ============================================================================
Write-Host "`n[STEP 5/10] Installing Git..." -ForegroundColor Yellow

if (Get-Command git -ErrorAction SilentlyContinue) {
    $gitVersion = git --version
    Write-Host "✓ Git is already installed: $gitVersion" -ForegroundColor Green
} else {
    Write-Host "Installing Git via Chocolatey..." -ForegroundColor Yellow
    choco install git -y
    
    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    if (Get-Command git -ErrorAction SilentlyContinue) {
        $gitVersion = git --version
        Write-Host "✓ Git installed successfully: $gitVersion" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Git installation failed." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# ============================================================================
# STEP 6: Install pnpm
# ============================================================================
Write-Host "`n[STEP 6/10] Installing pnpm..." -ForegroundColor Yellow

if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    $pnpmVersion = pnpm --version
    Write-Host "✓ pnpm is already installed: $pnpmVersion" -ForegroundColor Green
} else {
    Write-Host "Installing pnpm globally via npm..." -ForegroundColor Yellow
    npm install -g pnpm
    
    if (Get-Command pnpm -ErrorAction SilentlyContinue) {
        $pnpmVersion = pnpm --version
        Write-Host "✓ pnpm installed successfully: $pnpmVersion" -ForegroundColor Green
    } else {
        Write-Host "WARNING: pnpm installation failed. Falling back to npm." -ForegroundColor Yellow
        $USE_NPM = $true
    }
}

# ============================================================================
# STEP 7: Install Backend Dependencies
# ============================================================================
Write-Host "`n[STEP 7/10] Installing Backend dependencies..." -ForegroundColor Yellow

$backendPath = Join-Path $PROJECT_PATH "Backend"

if (Test-Path $backendPath) {
    Set-Location $backendPath
    
    if (-not (Test-Path "package.json")) {
        Write-Host "ERROR: package.json not found in Backend folder." -ForegroundColor Red
        Write-Host "Please ensure Backend/package.json exists." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host "Running package installation in Backend..." -ForegroundColor Yellow
    if ($USE_NPM) {
        npm install
    } else {
        pnpm install
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Backend dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Failed to install Backend dependencies." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "ERROR: Backend folder not found at: $backendPath" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# ============================================================================
# STEP 8: Install Frontend Dependencies
# ============================================================================
Write-Host "`n[STEP 8/10] Installing Frontend dependencies..." -ForegroundColor Yellow

$frontendPath = Join-Path $PROJECT_PATH "Frontend"

if (Test-Path $frontendPath) {
    Set-Location $frontendPath
    
    if (-not (Test-Path "package.json")) {
        Write-Host "ERROR: package.json not found in Frontend folder." -ForegroundColor Red
        Write-Host "Please ensure Frontend/package.json exists." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host "Running package installation in Frontend..." -ForegroundColor Yellow
    if ($USE_NPM) {
        npm install
    } else {
        pnpm install
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Frontend dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Failed to install Frontend dependencies." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "ERROR: Frontend folder not found at: $frontendPath" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Return to project root
Set-Location $PROJECT_PATH

# ============================================================================
# STEP 9: Initialize Git Repository and Configure
# ============================================================================
Write-Host "`n[STEP 9/10] Setting up Git repository..." -ForegroundColor Yellow

# Check if .git folder exists
if (Test-Path ".git") {
    Write-Host "Git repository already initialized." -ForegroundColor Yellow
    
    # Check if remote exists
    $remoteUrl = git remote get-url origin 2>$null
    if ($remoteUrl) {
        Write-Host "Remote origin already set to: $remoteUrl" -ForegroundColor Yellow
        
        if ($remoteUrl -ne $GITHUB_REPO_URL) {
            Write-Host "WARNING: Remote URL does not match expected URL." -ForegroundColor Yellow
            Write-Host "Expected: $GITHUB_REPO_URL" -ForegroundColor Yellow
            Write-Host "Current:  $remoteUrl" -ForegroundColor Yellow
            
            $updateRemote = Read-Host "Do you want to update the remote URL? (y/n)"
            if ($updateRemote -eq "y") {
                git remote set-url origin $GITHUB_REPO_URL
                Write-Host "✓ Remote URL updated." -ForegroundColor Green
            }
        }
    } else {
        Write-Host "Adding remote origin..." -ForegroundColor Yellow
        git remote add origin $GITHUB_REPO_URL
        Write-Host "✓ Remote origin added." -ForegroundColor Green
    }
} else {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git repository initialized." -ForegroundColor Green
    
    Write-Host "Adding remote origin..." -ForegroundColor Yellow
    git remote add origin $GITHUB_REPO_URL
    Write-Host "✓ Remote origin added." -ForegroundColor Green
}

# Create .gitignore if it doesn't exist
if (-not (Test-Path ".gitignore")) {
    Write-Host "Creating .gitignore file..." -ForegroundColor Yellow
    
    $gitignoreContent = @"
# Dependencies
node_modules/
Backend/node_modules/
Frontend/node_modules/

# Environment variables
.env
Backend/.env
Frontend/.env

# Build outputs
dist/
build/
Frontend/dist/
Backend/dist/

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# Package manager files
pnpm-lock.yaml
package-lock.json
yarn.lock
"@
    
    $gitignoreContent | Out-File -FilePath ".gitignore" -Encoding UTF8
    Write-Host "✓ .gitignore created." -ForegroundColor Green
}

# Configure Git user if not already configured
$gitUserName = git config user.name 2>$null
$gitUserEmail = git config user.email 2>$null

if (-not $gitUserName) {
    Write-Host "`nGit user.name is not configured." -ForegroundColor Yellow
    $userName = Read-Host "Enter your Git username (e.g., Your Name)"
    git config --global user.name "$userName"
    Write-Host "✓ Git user.name configured." -ForegroundColor Green
}

if (-not $gitUserEmail) {
    Write-Host "`nGit user.email is not configured." -ForegroundColor Yellow
    $userEmail = Read-Host "Enter your Git email (e.g., your.email@example.com)"
    git config --global user.email "$userEmail"
    Write-Host "✓ Git user.email configured." -ForegroundColor Green
}

# ============================================================================
# STEP 10: Commit and Push to GitHub
# ============================================================================
Write-Host "`n[STEP 10/10] Committing and pushing to GitHub..." -ForegroundColor Yellow

# Check if there are any changes to commit
$status = git status --porcelain

if ($status) {
    Write-Host "Changes detected. Staging all files..." -ForegroundColor Yellow
    git add .
    
    Write-Host "Creating commit..." -ForegroundColor Yellow
    $commitMessage = "Initial commit: TheBenjiBag complete setup"
    git commit -m "$commitMessage"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Commit created successfully." -ForegroundColor Green
    } else {
        Write-Host "ERROR: Failed to create commit." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "No changes to commit." -ForegroundColor Yellow
}

# Check if we need to set upstream branch
$currentBranch = git branch --show-current

if (-not $currentBranch) {
    Write-Host "Creating main branch..." -ForegroundColor Yellow
    git checkout -b main
    $currentBranch = "main"
}

Write-Host "`nPushing to GitHub repository..." -ForegroundColor Yellow
Write-Host "Repository: $GITHUB_REPO_URL" -ForegroundColor Cyan
Write-Host "Branch: $currentBranch" -ForegroundColor Cyan
Write-Host ""
Write-Host "You will be prompted for your GitHub credentials." -ForegroundColor Yellow
Write-Host ""

# Try to push
git push -u origin $currentBranch

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "WARNING: Push failed. This might be due to:" -ForegroundColor Yellow
    Write-Host "  - Authentication issues" -ForegroundColor Yellow
    Write-Host "  - Remote repository doesn't exist" -ForegroundColor Yellow
    Write-Host "  - Network connectivity issues" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please ensure:" -ForegroundColor Yellow
    Write-Host "  1. The repository exists at: $GITHUB_REPO_URL" -ForegroundColor Cyan
    Write-Host "  2. You have push access to the repository" -ForegroundColor Cyan
    Write-Host "  3. Your GitHub credentials are correct" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "You can manually push later using:" -ForegroundColor Yellow
    Write-Host "  git push -u origin $currentBranch" -ForegroundColor Cyan
}

# ============================================================================
# COMPLETION SUMMARY
# ============================================================================
Write-Host "`n============================================================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Installed Tools:" -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "  ✓ Node.js: $(node --version)" -ForegroundColor Green
}
if (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Host "  ✓ npm: $(npm --version)" -ForegroundColor Green
}
if (Get-Command git -ErrorAction SilentlyContinue) {
    Write-Host "  ✓ Git: $(git --version)" -ForegroundColor Green
}
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    Write-Host "  ✓ pnpm: $(pnpm --version)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Project Status:" -ForegroundColor Yellow
Write-Host "  ✓ Backend dependencies installed" -ForegroundColor Green
Write-Host "  ✓ Frontend dependencies installed" -ForegroundColor Green
Write-Host "  ✓ Git repository initialized" -ForegroundColor Green
Write-Host "  ✓ Remote origin configured" -ForegroundColor Green

Write-Host ""
Write-Host "GitHub Repository:" -ForegroundColor Yellow
Write-Host "  $GITHUB_REPO_URL" -ForegroundColor Cyan

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Configure your .env file in the Backend directory" -ForegroundColor Cyan
Write-Host "  2. Set up MongoDB Atlas and get your connection string" -ForegroundColor Cyan
Write-Host "  3. Run 'cd Backend && pnpm dev' to start the backend server" -ForegroundColor Cyan
Write-Host "  4. Run 'cd Frontend && pnpm dev' to start the frontend" -ForegroundColor Cyan
Write-Host "  5. Visit your GitHub repository to verify the push" -ForegroundColor Cyan

Write-Host ""
Write-Host "For detailed setup instructions, see Setup_Guide.md" -ForegroundColor Yellow
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"
