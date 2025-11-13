param(
  [string]$Root = "C:\TheBenjiBag_v1",
  [switch]$AggressiveClean,   # also delete dupes/strays it finds
  [switch]$DryRun             # show actions only
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ----------------- helpers -----------------
function New-Dir([string]$p){ if(-not (Test-Path -LiteralPath $p)){ if(-not $DryRun){ New-Item -ItemType Directory -Path $p | Out-Null } } }
function Log([string]$msg){ Write-Host $msg }
function Do-Move([string]$src,[string]$dstDir){
  if(-not (Test-Path -LiteralPath $src)){ return }
  New-Dir $dstDir
  $dst = Join-Path $dstDir (Split-Path $src -Leaf)
  if(Test-Path -LiteralPath $dst){
    $srcI = Get-Item -LiteralPath $src
    $dstI = Get-Item -LiteralPath $dst
    $takeSrc = ($srcI.Length -gt $dstI.Length) -or ($srcI.LastWriteTime -gt $dstI.LastWriteTime)
    if($takeSrc){
      Log "Replace: $dst ← $src"
      if(-not $DryRun){ Move-Item -Force -LiteralPath $src -Destination $dst }
    } else {
      Log "Delete older/smaller duplicate: $src"
      if(-not $DryRun){ Remove-Item -Force -LiteralPath $src }
    }
  } else {
    Log "Move: $src → $dstDir"
    if(-not $DryRun){ Move-Item -Force -LiteralPath $src -Destination $dstDir }
  }
}
function Find-All([string]$name){
  Get-ChildItem -Path $Root -Recurse -File -Filter $name -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '\\_backup_' -and $_.FullName -notmatch '\\\.git(\\|$)' -and $_.FullName -notmatch '\\node_modules(\\|$)' }
}
function Replace-Literal([string]$file,[string]$from,[string]$to){
  if(-not (Test-Path -LiteralPath $file)){ return }
  $txt = Get-Content -LiteralPath $file -Raw
  if($txt.Contains($from)){
    Log "Fix import in $file : '$from' → '$to'"
    if(-not $DryRun){ ($txt.Replace($from,$to)) | Set-Content -LiteralPath $file -NoNewline }
  }
}
function Backup-Project {
  $stamp = (Get-Date).ToString("yyyyMMdd-HHmmss")
  $backupDir = Join-Path $Root "_backup_$stamp"
  New-Dir $backupDir
  Log "Backing up → $backupDir"
  # copy (exclude .git/node_modules/old backups)
  $null = robocopy $Root $backupDir /E /NFL /NDL /NJH /NJS /NP /XD ".git" "node_modules" "_backup_*"
  # zip
  $zip = Join-Path $Root "_backup_$stamp.zip"
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  [System.IO.Compression.ZipFile]::CreateFromDirectory($backupDir, $zip)
  Log "Backup zip: $zip"
}

# ----------------- layout targets -----------------
$Backend           = Join-Path $Root "Backend"
$Frontend          = Join-Path $Root "Frontend"
$B_models          = Join-Path $Backend "models"
$B_routes          = Join-Path $Backend "routes"
$B_services        = Join-Path $Backend "services"
$B_middleware      = Join-Path $Backend "middleware"
$B_config          = Join-Path $Backend "config"
$B_scripts         = Join-Path $Backend "scripts"
$B_docs            = Join-Path $Backend "docs"
$F_src             = Join-Path $Frontend "src"
$F_components      = Join-Path $F_src "components"
$F_pages           = Join-Path $F_src "pages"
$F_hooks           = Join-Path $F_src "hooks"
$F_contexts        = Join-Path $F_src "contexts"

$allDirs = @($Backend,$Frontend,$B_models,$B_routes,$B_services,$B_middleware,$B_config,$B_scripts,$B_docs,
             $F_src,$F_components,$F_pages,$F_hooks,$F_contexts)

# ----------------- main -----------------
Backup-Project
$allDirs | ForEach-Object { New-Dir $_ }

# 1) Backend core files
# server.js in Backend
$serverCandidates = @( Find-All "server.js" )
if($serverCandidates.Count -gt 0){
  $primary = $serverCandidates | Where-Object { $_.FullName -match '\\Backend\\' } | Select-Object -First 1
  if(-not $primary){ $primary = $serverCandidates | Sort-Object LastWriteTime -Descending | Select-Object -First 1 }
  Do-Move $primary.FullName $Backend
}
$ServerPath = Join-Path $Backend "server.js"

# models/schema.js
$SchemaPath = Join-Path $B_models "schema.js"
if(-not (Test-Path -LiteralPath $SchemaPath)){
  $schemaC = @( Find-All "schema.js" )
  if($schemaC.Count -gt 0){
    $pick = $schemaC | Where-Object { $_.FullName -match '\\Backend\\' } | Select-Object -First 1
    if(-not $pick){ $pick = $schemaC | Where-Object { $_.FullName -match '\\src\\' } | Select-Object -First 1 }
    if(-not $pick){ $pick = $schemaC | Sort-Object LastWriteTime -Descending | Select-Object -First 1 }
    Do-Move $pick.FullName $B_models
  }
}

# middleware/authMiddleware.js
$authDest = Join-Path $B_middleware "authMiddleware.js"
if(-not (Test-Path -LiteralPath $authDest)){
  $authC = @( Find-All "authMiddleware.js" )
  if($authC.Count -gt 0){
    $pick = $authC | Where-Object { $_.FullName -match '\\Backend\\' } | Select-Object -First 1
    if(-not $pick){ $pick = $authC | Sort-Object LastWriteTime -Descending | Select-Object -First 1 }
    Do-Move $pick.FullName $B_middleware
  }
}

# classic route/service/db files
$backendRootFiles = @("db.js","db.ts","schema.ts")
foreach($name in $backendRootFiles){
  $cand = @( Find-All $name )
  if($cand.Count -gt 0){
    $pick = $cand | Where-Object { $_.FullName -match '\\Backend\\' } | Select-Object -First 1
    if(-not $pick){ $pick = $cand | Sort-Object LastWriteTime -Descending | Select-Object -First 1 }
    Do-Move $pick.FullName $Backend
  }
}

# routes bundle into Backend\routes
$routeNames = @("mainRouter.js","routers.ts","realtime.js","helcimWebhook.js","health.js")
foreach($r in $routeNames){
  $c = @( Find-All $r )
  if($c.Count -gt 0){
    $pick = $c | Where-Object { $_.FullName -match '\\Backend\\' } | Select-Object -First 1
    if(-not $pick){ $pick = $c | Sort-Object LastWriteTime -Descending | Select-Object -First 1 }
    Do-Move $pick.FullName $B_routes
  }
}

# services
$serviceNames = @("emailService.js","securityMiddleware.js","seed.js","realtime.js")
foreach($s in $serviceNames){
  $c = @( Find-All $s )
  if($c.Count -gt 0){
    $pick = $c | Where-Object { $_.FullName -match '\\Backend\\' } | Select-Object -First 1
    if(-not $pick){ $pick = $c | Sort-Object LastWriteTime -Descending | Select-Object -First 1 }
    Do-Move $pick.FullName $B_services
  }
}

# transport & socket scaffolding (if referenced by server.js)
if(Test-Path -LiteralPath $ServerPath){
  $serverCode = Get-Content -LiteralPath $ServerPath -Raw
  if($serverCode -match "require\(['""]\./transports"){ New-Dir (Join-Path $Backend "transports") }
  if($serverCode -match "require\(['""]\./socket['""]\)"){
    $socketDest = Join-Path $Backend "socket.js"
    if(-not (Test-Path -LiteralPath $socketDest)){
@'
"use strict";
function __entry__(/* server, io */){ return; }
async function init(){ return; }
async function start(){ return; }
module.exports = Object.assign(__entry__, { init, start });
'@ | ForEach-Object {
        if(-not $DryRun){ $_ | Set-Content -Encoding UTF8 -NoNewline -LiteralPath $socketDest }
      }
      Log "Created stub: $socketDest"
    }
  }
}

# 2) Frontend: herd obvious React files into Frontend/src (then into buckets by name)
$reactFiles = @(
  "App.tsx","Home.tsx","CustomerHome.tsx","DriverMap.tsx","AdminDashboard.tsx",
  "ProductCatalog.tsx","Checkout.jsx","SocketContext.jsx","useAuth.ts","useSocket.js","AgeGate.tsx"
)
foreach($rf in $reactFiles){
  $cand = @( Find-All $rf )
  if($cand.Count -gt 0){
    $pick = $cand | Where-Object { $_.FullName -match '\\Frontend\\' } | Select-Object -First 1
    if(-not $pick){ $pick = $cand | Sort-Object LastWriteTime -Descending | Select-Object -First 1 }
    $targetDir = $F_src
    if($rf -match 'Context'){ $targetDir = $F_contexts }
    elseif($rf -match 'useAuth|useSocket'){ $targetDir = $F_hooks }
    elseif($rf -match 'Dashboard|Home|Checkout'){ $targetDir = $F_pages }
    elseif($rf -match 'ProductCatalog|AgeGate|DriverMap|AdminDashboard|ShoppingCart'){ $targetDir = $F_components }
    Do-Move $pick.FullName $targetDir
  }
}

# 3) Docs / scripts / config from repo root → Backend
$scriptsLikely = @("deploy.ps1","install_all_dependencies.ps1","install_dependencies.ps1","reset_and_push.ps1",
                   "deploy.sh","complete_setup_and_deploy.ps1","complete_setup_and_deploy_FIXED.ps1",
                   "complete_setup_and_deploy_OLD.ps1")
foreach($sf in $scriptsLikely){
  $cand = @( Find-All $sf )
  foreach($f in $cand){ Do-Move $f.FullName $B_scripts }
}

$docsLikely = @("README.md","DEPLOYMENT.md","RENDER_QUICK_START.md","Render_Deployment_Guide.md",
                "TheBenjiBag_Render_Deployment_Master_Guide.md","CUSTOM_DOMAIN_DEPLOYMENT_GUIDE.md",
                "COMPLETE_WORKFLOW.md","GITHUB_REPO_RESET_GUIDE.md","Dependencies_Guide.md",
                "QUICK_FIX.md","Quick_Reference.md","PROJECT_SUMMARY.md","todo.md","benji_bag_ai_build_guide.md")
foreach($df in $docsLikely){
  $cand = @( Find-All $df )
  foreach($f in $cand){ Do-Move $f.FullName $B_docs }
}

$configLikely = @("render.yaml","render.yml",".env.example",".npmrc",".gitignore")
foreach($cf in $configLikely){
  $cand = @( Find-All $cf )
  foreach($f in $cand){ Do-Move $f.FullName $Backend }
}

# 4) Fix common broken imports after moves
if(Test-Path -LiteralPath $ServerPath){
  if(Test-Path -LiteralPath $SchemaPath){
    Replace-Literal $ServerPath "../models/schema.js" "./models/schema.js"
    Replace-Literal $ServerPath "../models/schema"     "./models/schema"
  }
  Replace-Literal $ServerPath "./authMiddleware.js"  "./middleware/authMiddleware.js"
  Replace-Literal $ServerPath "../authMiddleware.js" "./middleware/authMiddleware.js"
}
Get-ChildItem -LiteralPath $B_routes -Recurse -File -ErrorAction SilentlyContinue |
  Where-Object { $_.Extension -in '.js','.ts' } |
  ForEach-Object {
    Replace-Literal $_.FullName "../authMiddleware.js" "../middleware/authMiddleware.js"
    Replace-Literal $_.FullName "./authMiddleware.js"  "../middleware/authMiddleware.js"
  }

# 5) Aggressive cleanup (duplicates/strays outside their canonical folders)
if($AggressiveClean.IsPresent){
  $dupeTargets = @(
    @{ Name="authMiddleware.js"; Canon="$B_middleware" },
    @{ Name="schema.js";         Canon="$B_models"     },
    @{ Name="mainRouter.js";     Canon="$B_routes"     },
    @{ Name="routers.ts";        Canon="$B_routes"     },
    @{ Name="realtime.js";       Canon="$B_routes"     },
    @{ Name="emailService.js";   Canon="$B_services"   },
    @{ Name="securityMiddleware.js"; Canon="$B_services" }
  )
  foreach($t in $dupeTargets){
    $files = @( Find-All $t.Name )
    foreach($f in $files){
      if($f.DirectoryName -ne $t.Canon){
        Log "Remove stray duplicate: $($f.FullName)"
        if(-not $DryRun){ Remove-Item -Force -LiteralPath $f.FullName }
      }
    }
  }

  # prune empty folders (excluding Backend/Frontend roots)
  Get-ChildItem -Path $Root -Directory -Recurse -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '\\_backup_' -and $_.FullName -notmatch '\\\.git(\\|$)' -and $_.FullName -notmatch '\\node_modules(\\|$)' } |
    Sort-Object FullName -Descending |
    ForEach-Object {
      if(-not (Get-ChildItem -LiteralPath $_.FullName -Recurse -Force -ErrorAction SilentlyContinue)){
        if($_.FullName -ne $Backend -and $_.FullName -ne $Frontend){
          Log "Remove empty dir: $($_.FullName)"
          if(-not $DryRun){ Remove-Item -Force -Recurse -LiteralPath $_.FullName }
        }
      }
    }
}

# 6) Summary
$serverOK = Test-Path -LiteralPath $ServerPath
$schemaOK = Test-Path -LiteralPath $SchemaPath

Write-Host "`n=== Summary ==="
Write-Host "Backend:          $Backend"
Write-Host "server.js:        $serverOK"
Write-Host "models\schema.js: $schemaOK"
Write-Host "AggressiveClean:  $($AggressiveClean.IsPresent)"
Write-Host "DryRun:           $($DryRun.IsPresent)"
if($serverOK){
  Write-Host "`nNext:"
  Write-Host "  cd `"$Backend`""
  Write-Host "  pnpm install"
  Write-Host "  pnpm start"
} else {
  Write-Host "`nserver.js missing. If you have multiple, the newest was expected to be moved. Search and move manually if needed."
}
