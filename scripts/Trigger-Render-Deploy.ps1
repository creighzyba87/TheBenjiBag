param(
  [string]$BackendServiceID  = "srv-d3qsermr433s73ds0e9g",
  [string]$FrontendServiceID = "srv-d3qsl0ggjchc73bjkkk0",
  [string]$RenderAPIKey      = "rnd_SwtPH4WBwOW5q0q6RH2lJTdVBPbQ"
)

$headers = @{
  "Authorization" = "Bearer $RenderAPIKey"
  "Content-Type"  = "application/json; charset=utf-8"
}

# Manually encode the JSON to UTF-8 bytes
$bodyJson = '{"clearCache": true}'
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($bodyJson)

Write-Host "Triggering backend deploy..."
Invoke-RestMethod -Method POST `
  -Uri "https://api.render.com/v1/services/$BackendServiceID/deploys" `
  -Headers $headers `
  -Body $bodyBytes

Write-Host "Triggering frontend deploy..."
Invoke-RestMethod -Method POST `
  -Uri "https://api.render.com/v1/services/$FrontendServiceID/deploys" `
  -Headers $headers `
  -Body $bodyBytes

Write-Host "✅ Deploys triggered successfully."
