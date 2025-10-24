<# 
Fix-PostCSS-Syntax.ps1
Automatically fixes PostCSS config for Vite + Tailwind on Render,
commits the change to GitHub, and triggers a new Render deploy.
#>

# === CONFIG ===
$RepoPath = "C:\TheBenjiBag\frontend"
$RenderAPIKey = "rnd_SwtPH4WBwOW5q0q6RH2lJTdVBPbQ"
$FrontendServiceID = "srv-d3qsl0ggjchc73bjkkk0"

# === LOG FUNCTION ===
function Log($msg, [ConsoleColor]$color = "Cyan") {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "$ts | $msg" -ForegroundColor $color
}

# === FIX FILE CONTENT ===
$PostCSSPath = Join-Path $RepoPath "postcss.config.cjs"
$CorrectContent = @"
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
"@

Log "🔧 Fixing PostCSS config at $PostCSSPath..."
Set-Content -Path $PostCSSPath -Value $CorrectContent -Encoding UTF8 -Force

# === GIT COMMIT + PUSH ===
Set-Location $RepoPath
Log "💾 Committing and pushing changes to GitHub..."

try {
    git add postcss.config.cjs
    git commit -m "Fix: CommonJS syntax for PostCSS config to match Render build"
    git push origin main
    Log "✅ Git push successful." "Green"
} catch {
    Log "⚠️ Git push failed or no changes to commit." "Yellow"
}

# === TRIGGER RENDER DEPLOY ===
$headers = @{
    "Authorization" = "Bearer $RenderAPIKey"
    "Content-Type"  = "application/json"
}
$body = '{"clearCache":true}'

try {
    Invoke-RestMethod -Method POST -Uri "https://api.render.com/v1/services/$FrontendServiceID/deploys" -Headers $headers -Body $body | Out-Null
    Log "🚀 Render deploy triggered successfully for frontend!" "Green"
} catch {
    Log "❌ Failed to trigger Render deploy: $_"
