<#
AutoSync-Redeploy-Backup.ps1
Creates a timestamped ZIP backup of the project, commits any local changes,
pushes them to GitHub, and triggers Render redeploys for both frontend and backend.
#>

# === CONFIG ===
$RepoPath           = "C:\TheBenjiBag"
$FrontendPath       = "$RepoPath\frontend"
$BackendPath        = "$RepoPath\backend"
$BackupRoot         = "$RepoPath\backups"
$RenderAPIKey       = "rnd_SwtPH4WBwOW5q0q6RH2lJTdVBPbQ"
$FrontendServiceID  = "srv-d3qsl0ggjchc73bjkkk0"
$BackendServiceID   = "srv-d3qsermr433s73ds0e9g"

# === UTILITIES ===
function Log($msg,[ConsoleColor]$color="Cyan") {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "$ts | $msg" -ForegroundColor $color
}

function RunSafe($cmd) {
    try { Invoke-Expression $cmd } catch { Log "⚠️  $cmd failed: $_" "Yellow" }
}

# === BACKUP AND ZIP ===
$DateStamp = Get-Date -Format "yyyyMMdd-HHmmss"
$TempBackup = "$BackupRoot\temp-$DateStamp"
$ZipFile = "$BackupRoot\backup-$DateStamp.zip"

if (!(Test-Path $BackupRoot)) { New-Item -ItemType Directory -Path $BackupRoot | Out-Null }

Log "🗂  Creating temporary backup at $TempBackup..."
New-Item -ItemType Directory -Path $TempBackup | Out-Null

try {
    Copy-Item "$RepoPath\*" $TempBackup -Recurse -Force -ErrorAction SilentlyContinue
    Log "✅ Backup folder created. Compressing..."
    Compress-Archive -Path "$TempBackup\*" -DestinationPath $ZipFile -Force
    Remove-Item -Recurse -Force $TempBackup
    Log "🗜️  Backup ZIP created: $ZipFile" "Green"
} catch {
    Log "❌ Backup or compression failed: $_" "Red"
}

# === GIT SYNC ===
function SafeGitPush($path) {
    Push-Location $path
    Log "🔍 Checking Git status in $path..."
    $status = git status --porcelain

    if ($status) {
        Log "💾 Committing local changes..."
        RunSafe "git add ."
        RunSafe "git commit -m 'Auto-sync before redeploy'"
    } else {
        Log "✅ No local changes."
    }

    RunSafe "git pull origin main --rebase"
    RunSafe "git push origin main"
    Pop-Location
    Log "🚀 Synced and pushed $path to GitHub." "Green"
}

# === RENDER DEPLOY ===
function TriggerRenderDeploy($serviceID,$serviceName) {
    $headers = @{
        "Authorization" = "Bearer $RenderAPIKey"
        "Content-Type"  = "application/json"
    }
    $body = '{"clearCache":true}'
    try {
        Invoke-RestMethod -Method POST -Uri "https://api.render.com/v1/services/$serviceID/deploys" -Headers $headers -Body $body
        Log "✅ Render deploy triggered for $serviceName ($serviceID)" "Green"
    } catch {
        Log "❌ Failed to trigger deploy for $serviceName: $_" "Red"
    }
}

# === MAIN EXECUTION ===
Set-Location $RepoPath
Log "🚀 Starting AutoSync + ZIP Backup + Render Redeploy" "Cyan"

SafeGitPush $BackendPath
SafeGitPush $FrontendPath

TriggerRenderDeploy $BackendServiceID "Backend"
TriggerRenderDeploy $FrontendServiceID "Frontend"

Log "🎯 All operations complete. Check Render dashboard for live deploy logs." "Green"
