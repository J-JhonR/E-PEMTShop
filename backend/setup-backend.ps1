# setup-backend.ps1
Write-Host "📦 Création de la structure des dossiers PEMTShop..." -ForegroundColor Cyan

$folders = @(
    "config",
    "controllers", 
    "models",
    "routes",
    "middleware",
    "uploads/profiles",
    "uploads/products"
)

foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Force -Path $folder | Out-Null
        Write-Host "  ✓ Créé: $folder" -ForegroundColor Green
    } else {
        Write-Host "  ○ Existe déjà: $folder" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ Dossiers créés avec succès !" -ForegroundColor Cyan