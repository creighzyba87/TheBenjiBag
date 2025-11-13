param(
  [string]$Root = "C:\TheBenjiBag_v1",
  [switch]$AggressiveClean
)

# organize.ps1
# Purpose: normalize Backend/Frontend structure and fix broken imports
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function New-Dir([string]$p) {
  if (-not (Test-Path -LiteralPath $p)) { New-Item -ItemType Directory -Path $p | Out-Null }
}

function Backup-Project {
  $stamp = (Get-Date).ToString("yyyyMMdd-HHmmss")
  $backupDir = Join-Path $Root "_backup_$stamp"
  New-Dir $backupDir
  Write-Host "Backup → $backupDir"
  robocopy $Root $backupDir /E /NFL /NDL /NJH /NJS /NP /XD "node_modules" ".git" "_backup_*" | Out-Null
}

function Move-Into([string]$source, [string]$destDir){
  if (-not (Test-Path -LiteralPath $source)) { return }
  New-Dir $destDir
  $target = Join-Path $destDir (Split-Path $source -Leaf)
  if (Test-Path -LiteralPath $target) {
    $srcInfo = Get-Item -LiteralPath $source
    $dstInfo = Get-Item -LiteralPath $target
    $takeSrc = ($srcInfo.Length -gt $dstInfo.Length) -or ($srcInfo.LastWriteTime -gt $dstInfo.LastWriteTime)
    if ($takeSrc) { Move-Item -Force -LiteralPath $source -Destination $target } else { Remove-Item -Force -LiteralPath $source }
  } else {
    Move-Item -Force -LiteralPath $source -Destination $destDir
  }
}

function Find-Candidate([string]$name){
  Get-ChildItem -Path $Root -Recurse -File -Filter $name -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '\\_backup_' -and $_.FullName -notmatch '\\\.git(\\|$)' }
}

function Replace-Literal([string]$filePath, [string]$from, [string]$to) {
  if (-not (Test-Path -LiteralPath $filePath)) { return }
  $text = Get-Content -LiteralPath $filePath -Raw
  if ($text.Contains($from)) {
    $text = $text.Replace($from, $to)
    Set-Content -LiteralPath $filePath -Value $text -NoNewline
    Write-Host "Updated: $filePath  ($from -> $to)"
  }
}

# --- MAIN ---

# 1) Backup
Backup-Project

# 2) Baseline dirs
$Backend            = Join-Path $Root "Backend"
$Frontend           = Join-Path $Root "Frontend"
$BackendModels      = Join-Path $Backend "models"
$BackendRoutes      = Join-Path $Backend "routes"
$BackendServices    = Join-Path $Backend "services"
$BackendMiddleware  = Join-Path $Backend "middleware"
$FrontendSrc        = Join-Path $Frontend "src"

$null = @($Backend,$Frontend,$BackendModels,$BackendRoutes,$BackendServices,$BackendMiddleware,$FrontendSrc) | ForEach-Object { New-Dir $_ }

# 3) Place server.js
$serverCandidates = @( Find-Candidate "server.js" )
if ($serverCandidates.Count -gt 0) {
  $primary = $serverCandidates | Where-Object { $_.FullName -match '\\Backend\\' } | Select-Object -First 1
  if (-not $primary) { $primary = $serverCandidates | Sort-Object LastWriteTime -Descending | Select-Object -First 1 }
  Move-Into -source $primary.FullName -destDir $Backend
}
$ServerPath = Join-Path $Backend "server.js"

# 4) Ensure models\schema.js
$SchemaPath = Join-Path $BackendModels "schema.js"
if (-not (Test-Path -LiteralPath $SchemaPath)) {
  $schemaCandidates = @( Find-Candidate "schema.js" )
  if ($schemaCandidates.Count -gt 0) {
    $pick = $schemaCandidates | Where-Object { $_.FullName -match '\\Backend\\' } | Select-Object -First 1
    if (-not $pick) { $pick = $schemaCandidates | Where-Object { $_.FullName -match '\\src\\' } | Select-Object -First 1 }
    if (-not $pick) { $pick = $schemaCandidates | Sort-Object LastWriteTime -Descending | Select-Object -First 1 }
    Move-Into -source $pick.FullName -destDir $BackendModels
  } else {
    Write-Warning "schema.js not found; create $SchemaPath if your app expects it."
  }
}

# 5) Middleware + routes/services
$AuthDest = Join-Path $BackendMiddleware "authMiddleware.js"
if (-not (Test-Path -LiteralPath $AuthDest)) {
  $authCandidates = @( Find-Candidate "authMiddleware.js" )
  if ($authCandidates.Count -gt 0) {
    $pick = $authCandidates | Where-Object { $_.FullName -match '\\Backend\\' } | Select-Object -First 1
    if (-not $pick) { $pick = $authCandidates | Sort-Object LastWriteTime -Descending | Select-Object -First 1 }
    Move-Into -source $pick.FullName -destDir $BackendMiddleware
  }
}

$routeNames = @("mainRouter.js","routers.ts","realtime.js","helcimWebhook.js","health.js")
foreach ($r in $routeNames) {
  $c = @( Find-Candidate $r )
  if ($c.Count -gt 0) {
    $pick = $c | Where-Object { $_.FullName -match '\\Backend\\' } | Select-Object -First 1
    if (-not $pick) { $pick = $c | Sort-Object LastWriteTime -Descending | Select-Object -First 1 }
    Move-Into -source $pick.FullName -destDir $BackendRoutes
  }
}

foreach ($svc in @("emailService.js","securityMiddleware.js","seed.js")) {
  $cand = @( Find-Candidate $svc )
  if ($cand.Count -gt 0) {
    $pick = $cand | Where-Object { $_.FullName -match '\\Backend\\' } | Select-Object -First 1
    if (-not $pick) { $pick = $cand | Sort-Object LastWriteTime -Descending | Select-Object -First 1 }
    Move-Into -source $pick.FullName -destDir $BackendServices
  }
}

foreach ($name in @("db.js","db.ts","schema.ts")) {
  $cand = @( Find-Candidate $name )
  if ($cand.Count -gt 0) {
    $pick = $cand | Where-Object { $_.FullName -match '\\Backend\\' } | Select-Object -First 1
    if (-not $pick) { $pick = $cand | Sort-Object LastWriteTime -Descending | Select-Object -First 1 }
    Move-Into -source $pick.FullName -destDir $Backend
  }
}

# 6) Fix imports in server.js and routes
if (Test-Path -LiteralPath $ServerPath) {
  if (Test-Path -LiteralPath $SchemaPath) {
    Replace-Literal -filePath $ServerPath -from "../models/schema.js" -to "./models/schema.js"
    Replace-Literal -filePath $ServerPath -from "../models/schema"     -to "./models/schema"
  }
  Replace-Literal -filePath $ServerPath -from "./authMiddleware.js"  -to "./middleware/authMiddleware.js"
  Replace-Literal -filePath $ServerPath -from "../authMiddleware.js" -to "./middleware/authMiddleware.js"
}

Get-ChildItem -LiteralPath $BackendRoutes -Recurse -File -ErrorAction SilentlyContinue |
  Where-Object { $_.Extension -in '.js','.ts' } |
  ForEach-Object {
    Replace-Literal -filePath $_.FullName -from "../authMiddleware.js" -to "../middleware/authMiddleware.js"
    Replace-Literal -filePath $_.FullName -from "./authMiddleware.js"  -to "../middleware/authMiddleware.js"
  }

# 7) Frontend: move obvious React files to Frontend\src
$reactFiles = @("App.tsx","Home.tsx","CustomerHome.tsx","DriverMap.tsx","AdminDashboard.tsx",
                "ProductCatalog.tsx","Checkout.jsx","SocketContext.jsx","useAuth.ts","useSocket.js","AgeGate.tsx")
foreach ($rf in $reactFiles) {
  $cand = @( Find-Candidate $rf )
  if ($cand.Count -gt 0) {
    $pick = $cand | Where-Object { $_.FullName -match '\\Frontend\\' } | Select-Object -First 1
    if (-not $pick) { $pick = $cand | Sort-Object LastWriteTime -Descending | Select-Object -First 1 }
    Move-Into -source $pick.FullName -destDir $FrontendSrc
  }
}

# 8) Optional cleanup
if ($AggressiveClean.IsPresent) {
  $strays = @()
  $strays += (Get-ChildItem -Path $Backend -Recurse -File -Filter "authMiddleware.js" | Where-Object { $_.DirectoryName -notmatch '\\middleware$' }).FullName
  $strays += (Get-ChildItem -Path $Backend -Recurse -File -Filter "schema.js"        | Where-Object { $_.DirectoryName -notmatch '\\models$'     }).FullName
  $strays = $strays | Where-Object { $_ } | Select-Object -Unique
  foreach ($t in $strays) {
    try { Remove-Item -Force -LiteralPath $t; Write-Host "Removed stray: $t" } catch { Write-Warning "Cannot remove $t : $_" }
  }
}

# 9) Health summary
$ServerPathOK = Test-Path -LiteralPath $ServerPath
$SchemaPathOK = Test-Path -LiteralPath $SchemaPath

Write-Host "`n=== Summary ==="
Write-Host "Backend:          $Backend"
Write-Host "server.js:        $ServerPathOK"
Write-Host "models\schema.js: $SchemaPathOK"
if ($ServerPathOK -and $SchemaPathOK) {
  Write-Host "`nNext:"
  Write-Host "  cd `"$Backend`""
  Write-Host "  pnpm install"
  Write-Host "  pnpm start"
} else {
  Write-Host "`nFix the missing items above and rerun."
}
