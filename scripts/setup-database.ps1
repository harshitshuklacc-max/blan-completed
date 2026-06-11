# SHOE MAFIA — Database Setup Script
# Run from project root: .\scripts\setup-database.ps1

$ErrorActionPreference = "Stop"
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH

Set-Location $PSScriptRoot\..

Write-Host "=== SHOE MAFIA Database Setup ===" -ForegroundColor Red
Write-Host ""
Write-Host "This will RESET your Neon database and apply the full schema." -ForegroundColor Yellow
Write-Host "ALL existing data will be permanently deleted." -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Type YES to continue"

if ($confirm -ne "YES") {
    Write-Host "Aborted." -ForegroundColor Gray
    exit 0
}

Write-Host ""
Write-Host "Step 1: Pushing schema to Neon..." -ForegroundColor Cyan
npx prisma db push --force-reset --accept-data-loss
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Step 2: Seeding admin and store settings..." -ForegroundColor Cyan
npm run db:seed
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Database setup complete!" -ForegroundColor Green
Write-Host "Run: npm run dev" -ForegroundColor Green
