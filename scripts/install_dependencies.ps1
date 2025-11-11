# PowerShell Script to Install TheBenjiBag Dependencies

# 1. Check for and Install Chocolatey (Package Manager for Windows)
if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "Chocolatey not found. Installing Chocolatey..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString("https://community.chocolatey.org/install.ps1"))
} else {
    Write-Host "Chocolatey is already installed." -ForegroundColor Green
}

# 2. Install Node.js LTS and Git using Chocolatey
Write-Host "Installing Node.js LTS and Git..."
choco install nodejs-lts git -y

# 3. Install pnpm globally using npm
Write-Host "Installing pnpm..."
npm install -g pnpm

Write-Host "All dependencies have been installed successfully!" -ForegroundColor Green
