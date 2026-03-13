# Tusi Windows Kurulum Betiği
$InstallDir = "C:\Tusi"
if (!(Test-Path $InstallDir)) {
    New-Item -ItemType Directory -Path $InstallDir -Force
}

Copy-Item ".\tusi.exe" -Destination "$InstallDir\tusi.exe" -Force

$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($UserPath -notlike "*$InstallDir*") {
    $NewPath = "$UserPath;$InstallDir"
    [Environment]::SetEnvironmentVariable("Path", $NewPath, "User")
    Write-Host "Tusi başarıyla PATH'e eklendi. Lütfen terminali yeniden başlatın." -ForegroundColor Green
} else {
    Write-Host "Tusi zaten kurulu." -ForegroundColor Yellow
}
