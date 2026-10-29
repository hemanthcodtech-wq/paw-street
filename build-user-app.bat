@echo off
title Build Paw Street User App (Android APK)
cd /d "%~dp0apps\user-app"

echo ========================================================
echo 🐾 Building Paw Street Customer App (Android APK via EAS)
echo Package: com.pawstreet.user
echo ========================================================
echo.
echo Running EAS Build...
call npx eas-cli build --platform android --profile preview

pause

