# TheBenjiBag Deployment Script for Windows PowerShell

$ErrorActionPreference = "Stop"

Write-Host "🚀 TheBenjiBag Deployment Script" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Check environment variables
if (-not $env:RENDER_API_KEY) {
    Write-Host "❌ Error: RENDER_API_KEY not set" -ForegroundColor Red
    exit 1
}

if (-not $env:RENDER_SERVICE_ID) {
    Write-Host "❌ Error: RENDER_SERVICE_ID not set" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Environment variables configured" -ForegroundColor Green

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm ci
Set-Location client
npm ci
Set-Location ..

# Build frontend
Write-Host "🔨 Building frontend..." -ForegroundColor Yellow
Set-Location client
npm run build
Set-Location ..

# Build backend
Write-Host "🔨 Building backend..." -ForegroundColor Yellow
npm run build

# Run tests
Write-Host "🧪 Running tests..." -ForegroundColor Yellow
npm test --if-present -ErrorAction SilentlyContinue

# Create deployment artifact
Write-Host "📦 Creating deployment artifact..." -ForegroundColor Yellow
$excludePatterns = @(
    "node_modules",
    "client/node_modules",
    ".git",
    ".env*",
    "*.zip",
    "dist"
)

# Using 7-Zip if available, otherwise use Compress-Archive
if (Get-Command 7z -ErrorAction SilentlyContinue) {
    & 7z a -r thebenjibag-build.zip . -x!node_modules -x!.git -x!.env*
} else {
    Compress-Archive -Path . -DestinationPath thebenjibag-build.zip -Force
}

# Deploy to Render
Write-Host "🌐 Deploying to Render..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $env:RENDER_API_KEY"
    "Content-Type" = "application/json"
}

$body = @{
    clearCache = "full"
} | ConvertTo-Json

$uri = "https://api.render.com/v1/services/$env:RENDER_SERVICE_ID/deploys"

Invoke-WebRequest -Uri $uri -Method POST -Headers $headers -Body $body

Write-Host "✅ Deployment initiated!" -ForegroundColor Green
Write-Host "Monitor your deployment at: https://dashboard.render.com" -ForegroundColor Green
