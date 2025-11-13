# ============================================================================
# TheBenjiBag: Reset Git and Push to New GitHub Repository
# ============================================================================
# This script performs the following actions:
# 1. Removes any existing .git folder (starts fresh)
# 2. Initializes a new Git repository
# 3. Creates a proper .gitignore file
# 4. Stages and commits all files
# 5. Connects to the new GitHub repository
# 6. Pushes to the main branch
#
# Prerequisites:
# - Git must be installed
# - Project files must be in C:\TheBenjiBag
# - New empty repository created at: https://github.com/Creighzyba87/TheBenjiBag
# ============================================================================

# Script Configuration
$PROJECT_PATH = "C:\TheBenjiBag"
$GITHUB_USERNAME = "Creighzyba87"
$GITHUB_REPO = "TheBenjiBag"
$GITHUB_REPO_URL = "https://github.com/$GITHUB_USERNAME/$GITHUB_REPO.git"

Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "  TheBenjiBag: Reset Git and Push to GitHub" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Project Path: $PROJECT_PATH" -ForegroundColor Yellow
Write-Host "GitHub Repo: $GITHUB_REPO_URL" -ForegroundColor Yellow
Write-Host ""

# ============================================================================
# STEP 1: Verify Project Directory Exists
# ============================================================================
Write-Host "[STEP 1/7] Verifying project directory..." -ForegroundColor Yellow

if (-not (Test-Path $PROJECT_PATH)) {
    Write-Host "ERROR: Project directory not found at: $PROJECT_PATH" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Set-Location $PROJECT_PATH
Write-Host "Project directory found: $PROJECT_PATH" -ForegroundColor Green

# ============================================================================
# STEP 2: Verify Git is Installed
# ============================================================================
Write-Host "`n[STEP 2/7] Checking Git installation..." -ForegroundColor Yellow

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Git is not installed." -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/downloads" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

$gitVersion = git --version
Write-Host "Git is installed: $gitVersion" -ForegroundColor Green

# ============================================================================
# STEP 3: Remove Existing .git Folder
# ============================================================================
Write-Host "`n[STEP 3/7] Removing existing Git repository..." -ForegroundColor Yellow

if (Test-Path ".git") {
    Write-Host "Found existing .git folder. Removing..." -ForegroundColor Yellow
    Remove-Item -Path ".git" -Recurse -Force
    Write-Host "Existing .git folder removed." -ForegroundColor Green
} else {
    Write-Host "No existing .git folder found." -ForegroundColor Green
}

# ============================================================================
# STEP 4: Initialize New Git Repository
# ============================================================================
Write-Host "`n[STEP 4/7] Initializing new Git repository..." -ForegroundColor Yellow

git init
git branch -M main

Write-Host "Git repository initialized with main branch." -ForegroundColor Green

# ============================================================================
# STEP 5: Create .gitignore File
# ============================================================================
Write-Host "`n[STEP 5/7] Creating .gitignore file..." -ForegroundColor Yellow

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
yarn-debug.log*
yarn-error.log*

# OS files
.DS_Store
Thumbs.db
desktop.ini

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~
*.sublime-project
*.sublime-workspace

# Package manager files
pnpm-lock.yaml
package-lock.json
yarn.lock

# Testing
coverage/
.nyc_output/

# Temporary files
*.tmp
*.temp
"@

$gitignoreContent | Out-File -FilePath ".gitignore" -Encoding UTF8
Write-Host ".gitignore file created." -ForegroundColor Green

# ============================================================================
# STEP 6: Stage and Commit All Files
# ============================================================================
Write-Host "`n[STEP 6/7] Staging and committing files..." -ForegroundColor Yellow

git add .

$commitMessage = "Initial commit: TheBenjiBag full-stack application with organized Frontend and Backend"
git commit -m "$commitMessage"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Files committed successfully." -ForegroundColor Green
} else {
    Write-Host "ERROR: Failed to create commit." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# ============================================================================
# STEP 7: Connect to GitHub and Push
# ============================================================================
Write-Host "`n[STEP 7/7] Connecting to GitHub and pushing..." -ForegroundColor Yellow

git remote add origin $GITHUB_REPO_URL

Write-Host ""
Write-Host "Pushing to GitHub repository: $GITHUB_REPO_URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: You will be prompted for GitHub credentials." -ForegroundColor Yellow
Write-Host "  Username: $GITHUB_USERNAME" -ForegroundColor Cyan
Write-Host "  Password: Use your Personal Access Token (NOT your password)" -ForegroundColor Cyan
Write-Host ""
Write-Host "To create a Personal Access Token:" -ForegroundColor Yellow
Write-Host "  1. Go to: https://github.com/settings/tokens" -ForegroundColor Cyan
Write-Host "  2. Click 'Generate new token (classic)'" -ForegroundColor Cyan
Write-Host "  3. Select 'repo' scope" -ForegroundColor Cyan
Write-Host "  4. Copy the token and use it as your password" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to continue with push"

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "============================================================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Repository pushed to GitHub!" -ForegroundColor Green
    Write-Host "============================================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your repository is now live at:" -ForegroundColor Yellow
    Write-Host "  $GITHUB_REPO_URL" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Visit your GitHub repository to verify the files" -ForegroundColor Cyan
    Write-Host "  2. Go to Render.com and trigger manual deploys for both services" -ForegroundColor Cyan
    Write-Host "  3. Follow the Render_Deployment_Guide.md for deployment instructions" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "============================================================================" -ForegroundColor Red
    Write-Host "  Push Failed" -ForegroundColor Red
    Write-Host "============================================================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common reasons for push failure:" -ForegroundColor Yellow
    Write-Host "  1. Repository doesn't exist on GitHub" -ForegroundColor Cyan
    Write-Host "     Solution: Create it at https://github.com/new" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  2. Authentication failed" -ForegroundColor Cyan
    Write-Host "     Solution: Use a Personal Access Token, not your password" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  3. No push access to repository" -ForegroundColor Cyan
    Write-Host "     Solution: Verify you own the repository" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "You can try pushing again manually:" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor Cyan
    Write-Host ""
}

Read-Host "Press Enter to exit"
