@echo off
title Build Paw Street Partner App (Android APK)
cd /d "%~dp0apps\partner-app"

echo ========================================================
echo 🐾 Building Paw Street Partner App (Vendor & Fleet APK)
echo Package: com.pawstreet.partner
echo ========================================================
echo.
echo Running EAS Build...
call npx eas-cli build --platform android --profile preview

pause

