@echo off
title Launch PAW NEAR Dual Mobile Apps (Ports 8081 & 8082)
cd /d "%~dp0"

echo ========================================================
echo 🐾 Starting PAW NEAR Customer App (Port 8081)
echo 🐾 Starting PAW NEAR Partner App  (Port 8082)
echo ========================================================

start "PAW NEAR - Customer App (8081)" cmd /k "call start-user-app.bat"
timeout /t 3 /nobreak >nul
start "PAW NEAR - Partner App (8082)" cmd /k "call start-partner-app.bat"

echo.
echo Both applications launched in dedicated terminal windows!
echo Customer App URL: http://localhost:8081
echo Partner App URL:  http://localhost:8082
echo ========================================================
pause
