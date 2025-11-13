# === CONFIGURATION ===
$root     = "C:\TheBenjiBag_v1"
$backend  = Join-Path $root "Backend"
$frontend = Join-Path $root "Frontend"

# === BACKEND STRUCTURE ===
$beSrc      = Join-Path $backend "src"
$beModels   = Join-Path $beSrc "models"
$beRoutes   = Join-Path $beSrc "routes"
$beServices = Join-Path $beSrc "services"

# === FRONTEND STRUCTURE ===
$feSrc        = Join-Path $frontend "src"
$fePages      = Join-Path $feSrc "pages"
$feContexts   = Join-Path $feSrc "contexts"
$feHooks      = Join-Path $feSrc "hooks"
$feComponents = Join-Path $feSrc "components"

# === FUNCTION: CREATE DIRECTORY IF MISSING ===
function Ensure-Dir([string]$path) {
    if (-not (Test-Path $path)) {
        Write-Host "Creating directory: $path"
        New-Item -ItemType Directory -Path $path | Out-Null
    }
    else {
        Write-Host "Directory exists: $path"
    }
}

# === CREATE DIRECTORIES ===
Write-Host "`n== Creating Backend Folders =="
Ensure-Dir $beSrc
Ensure-Dir $beModels
Ensure-Dir $beRoutes
Ensure-Dir $beServices

Write-Host "`n== Creating Frontend Folders =="
Ensure-Dir $feSrc
Ensure-Dir $fePages
Ensure-Dir $feContexts
Ensure-Dir $feHooks
Ensure-Dir $feComponents

# === MOVE BACKEND FILES WITH DEBUG ===
Write-Host "`n== Moving Backend Files =="
Get-ChildItem -Path $backend -File | ForEach-Object {
    Write-Host "Processing backend file: $($_.Name)"
    switch ($_.Name) {
        { $_ -in "schema.ts" } {
            Move-Item -Path $_.FullName -Destination $beModels -Verbose
            break
        }
        { $_ -in "db.js","db.ts" } {
            Move-Item -Path $_.FullName -Destination $beSrc -Verbose
            break
        }
        { $_ -in "routers.ts" } {
            Move-Item -Path $_.FullName -Destination $beRoutes -Verbose
            break
        }
        { $_ -in "helcimWebhook.js" } {
            Move-Item -Path $_.FullName -Destination $beRoutes -Verbose
            break
        }
        { $_ -in "authMiddleware.js","securityMiddleware.js","emailService.js","realtime.js","health.js","seed.js" } {
            Move-Item -Path $_.FullName -Destination $beServices -Verbose
            break
        }
        { $_ -eq "server.js" } {
            Move-Item -Path $_.FullName -Destination $beSrc -Verbose
            break
        }
        default {
            Write-Host "No rule for backend file: $($_.Name) — leaving in place."
        }
    }
}

# === MOVE FRONTEND FILES WITH DEBUG ===
Write-Host "`n== Moving Frontend Files =="
Get-ChildItem -Path $frontend -File | ForEach-Object {
    Write-Host "Processing frontend file: $($_.Name) (Ext: $($_.Extension))"
    switch ($_.Extension.ToLower()) {
        ".js" {
            if ($_.Name -eq "vite.config.js") {
                Write-Host "Keep vite.config.js in root"
            }
            else {
                Move-Item -Path $_.FullName -Destination $feHooks -Verbose
            }
            break
        }
        ".jsx" {
            if ($_.Name -eq "SocketContext.jsx") {
                Move-Item -Path $_.FullName -Destination $feContexts -Verbose
            }
            else {
                Move-Item -Path $_.FullName -Destination $fePages -Verbose
            }
            break
        }
        ".tsx" {
            Move-Item -Path $_.FullName -Destination $fePages -Verbose
            break
        }
        ".json" {
            if ($_.Name -eq "package.json") {
                Write-Host "Keep package.json in root"
            }
            else {
                Move-Item -Path $_.FullName -Destination $feSrc -Verbose
            }
            break
        }
        default {
            if ($_.Name -eq ".npmrc") {
                Write-Host "Keep .npmrc in root"
            }
            else {
                Write-Host "Unhandled frontend file: $($_.Name) — leaving in place."
            }
        }
    }
}

Write-Host "`nRe-organisation complete. Please update import paths in backend and frontend accordingly."
