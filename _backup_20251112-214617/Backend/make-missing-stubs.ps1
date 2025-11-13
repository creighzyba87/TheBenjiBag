# make-missing-stubs.ps1
param(
  [string]$Backend = "C:\TheBenjiBag_v1\Backend",
  [string]$Entry   = "server.js"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$server = Join-Path $Backend $Entry
if (!(Test-Path -LiteralPath $server)) { throw "Entry file not found: $server" }

$code = Get-Content -LiteralPath $server -Raw

# 1) Find local requires/imports like ./foo or ./bar/baz
$reqs  = [regex]::Matches($code, "require\(['""](\./[A-Za-z0-9_\-/]+)['""]\)") | ForEach-Object { $_.Groups[1].Value }
$imps  = [regex]::Matches($code, "from\s+['""](\./[A-Za-z0-9_\-/]+)['""]")     | ForEach-Object { $_.Groups[1].Value }
$paths = @($reqs + $imps) | Select-Object -Unique

if ($paths.Count -eq 0) {
  Write-Host "No local requires/imports found in $Entry"
  exit 0
}

# 2) Build map: moduleName -> { relPath, filePath, name, uses[] }
$modules = @{}

foreach ($p in $paths) {
  # Normalize ./foo -> foo, ./dir/foo -> dir\foo
  $rel = $p -replace '^\./', '' -replace '/', '\'
  $jsPath = Join-Path $Backend ($rel + ".js")
  $name   = Split-Path $rel -Leaf
  $modules[$name] = [ordered]@{
    relPath = $rel
    filePath = $jsPath
    name = $name
    uses = [System.Collections.Generic.HashSet[string]]::new()
  }
}

# 3) For each module, collect member usages: name.method
foreach ($k in $modules.Keys) {
  $mod = $modules[$k]
  $pattern = [regex]::Escape($mod.name) + "\.(\w+)"
  [regex]::Matches($code, $pattern) | ForEach-Object { $null = $mod.uses.Add($_.Groups[1].Value) }
}

# 4) Create stubs for missing files
foreach ($k in $modules.Keys) {
  $m = $modules[$k]
  if (Test-Path -LiteralPath $m.filePath) {
    Write-Host "OK: $($m.relPath).js exists"
    continue
  }

  # Ensure parent folder exists for nested paths
  $parent = Split-Path $m.filePath -Parent
  if ($parent -and !(Test-Path -LiteralPath $parent)) { New-Item -ItemType Directory -Path $parent | Out-Null }

  # Default exports if no usages are detected
  if ($m.uses.Count -eq 0) { $null = $m.uses.Add("init"); $null = $m.uses.Add("start") }

  $functions = @()
  foreach ($u in $m.uses) { $functions += "async function $u() { return; }" }

  $assignPairs = ($m.uses | ForEach-Object { "{0}:{0}" -f $_ }) -join ", "

  $content = @()
  $content += "// Auto-generated stub for ./$($m.relPath) from make-missing-stubs.ps1"
  $content += "'use strict';"
  $content += ""
  $content += "function __stub__() { return; }"
  $content += $functions
  $content += ""
  if ($assignPairs.Length -gt 0) {
    $content += "module.exports = Object.assign(__stub__, { $assignPairs });"
  } else {
    $content += "module.exports = __stub__;"
  }

  $utf8 = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($m.filePath, ($content -join "`r`n"), $utf8)

  Write-Host "Created stub: $($m.filePath)  exports -> $([string]::Join(', ', $m.uses))"
}

Write-Host "`nReferences in $Entry:"
$paths | ForEach-Object { Write-Host " - $_" }
