# Tusi Hızlı Kurulum Betiği (PowerShell)
# Bu komutu paylaşabilirsin: iwr "http://tusi-dili.com/indir.ps1" | iex

$Destination = "$HOME\.tusi"
if (!(Test-Path $Destination)) { New-Item -ItemType Directory -Path $Destination }

Write-Host "Tusi indiriliyor..." -ForegroundColor Cyan
# Not: Buradaki URL örnek amaçlıdır, gerçek bir URL ile değiştirilmelidir.
# Invoke-WebRequest -Uri "https://github.com/tuna/tusi/releases/latest/download/tusi.exe" -OutFile "$Destination\tusi.exe"

Write-Host "Sistem yoluna (PATH) ekleniyor..." -ForegroundColor Cyan
$Path = [Environment]::GetEnvironmentVariable("Path", "User")
if ($Path -notlike "*$Destination*") {
    [Environment]::SetEnvironmentVariable("Path", "$Path;$Destination", "User")
}

Write-Host "Tusi başarıyla kuruldu! Terminali kapatıp açtığında 'tusi' yazarak kullanabilirsin." -ForegroundColor Green
