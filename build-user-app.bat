@echo off
title Build PAW NEAR Customer App (Android APK)
cd /d "%~dp0apps\user-app"

echo ========================================================
echo 🐾 Building PAW NEAR Customer App (Android APK via EAS)
echo Package: com.pawnear.user
echo ========================================================
echo.
echo Running EAS Build...
call npx eas-cli build --platform android --profile preview

pause
