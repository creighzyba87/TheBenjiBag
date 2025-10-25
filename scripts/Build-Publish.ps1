param(
  [string]$BackendServiceID  = "srv-d3qsermr433s73ds0e9g",
  [string]$FrontendServiceID = "srv-d3qsl0ggjchc73bjkkk0",
  [string]$RenderAPIKey      = "rnd_SwtPH4WBwOW5q0q6RH2lJTdVBPbQ",
  [string]$GitRemote         = "https://github.com/creighzyba87/TheBenjiBag.git",
  [string]$GitBranch         = "main"
)
$ErrorActionPreference = "Stop"
function Log($m){ Write-Host ("[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $m) }
Log "Installing frontend deps..."
Push-Location "$PSScriptRoot\..\frontend"; npm ci || npm install; npm run build; Pop-Location
Log "Installing backend deps..."
Push-Location "$PSScriptRoot\..\backend"; npm ci || npm install; Pop-Location
Log "Committing & pushing..."
Push-Location "$PSScriptRoot\.."; git init; git remote remove origin 2>$null; git remote add origin $GitRemote; git fetch origin $GitBranch; git checkout -B $GitBranch; git add .; git commit -m "Phase 3 deploy"; git push origin $GitBranch --force; Pop-Location
$headers = @{ "Authorization" = "Bearer $RenderAPIKey"; "Content-Type" = "application/json" }
$body = @{ clearCache = $true } | ConvertTo-Json
Log "Trigger backend deploy..."; Invoke-RestMethod -Method POST -Uri ("https://api.render.com/v1/services/{0}/deploys" -f $BackendServiceID) -Headers $headers -Body $body
Log "Trigger frontend deploy..."; Invoke-RestMethod -Method POST -Uri ("https://api.render.com/v1/services/{0}/deploys" -f $FrontendServiceID) -Headers $headers -Body $body
Log "Done."