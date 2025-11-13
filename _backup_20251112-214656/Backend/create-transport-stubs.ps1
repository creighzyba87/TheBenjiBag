param(
  [string]$Backend = "C:\TheBenjiBag_v1\Backend",
  [string]$Entry   = "server.js"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$server = Join-Path $Backend $Entry
if (!(Test-Path -LiteralPath $server)) { throw "Entry file not found: $server" }

$code = Get-Content -LiteralPath $server -Raw

# Find require('./transports/x') and import ... from './transports/x'
$rxRequire = "require\(['""](\./transports/[A-Za-z0-9_\-/]+)['""]\)"
$rxImport  = "from\s+['""](\./transports/[A-Za-z0-9_\-/]+)['""]"

$reqs = [regex]::Matches($code, $rxRequire) | ForEach-Object { $_.Groups[1].Value }
$imps = [regex]::Matches($code, $rxImport)  | ForEach-Object { $_.Groups[1].Value }

# Force array semantics even if there is only one match
[string[]]$paths = @($reqs + $imps) | Where-Object { $_ } | Select-Object -Unique

if (-not $paths -or $paths.Length -eq 0) {
  Write-Host "No './transports/*' imports found in $($Entry)."
  exit 0
}

foreach ($p in $paths) {
  $rel  = $p -replace '^\./', '' -replace '/', '\'
  $file = Join-Path $Backend ($rel + ".js")
  $dir  = Split-Path $file -Parent

  if (!(Test-Path -LiteralPath $dir)) {
    New-Item -ItemType Directory -Path $dir | Out-Null
  }

  if (Test-Path -LiteralPath $file) {
    Write-Host "OK: $($p).js exists"
    continue
  }

  # Export both a callable default and named methods
  $content = @"
"use strict";
// Auto-generated stub for ./$p
function __entry__(/* server, io */) {
