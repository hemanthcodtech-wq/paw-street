@echo off
title Build PAW NEAR Partner App (Android APK)
cd /d "%~dp0apps\partner-app"

echo ========================================================
echo 🐾 Building PAW NEAR Partner App (Vendor & Fleet APK)
echo Package: com.pawnear.partner
echo ========================================================
echo.
echo Running EAS Build...
call npx eas-cli build --platform android --profile preview

pause
