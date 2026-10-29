@echo off
title Paw Street - Launching Both Mobile Apps
echo ========================================================
echo Starting Paw Street User App (Port 8081) and Partner App (Port 8082)...
echo User App:    http://localhost:8081
echo Partner App: http://localhost:8082
echo ========================================================
start cmd /k "cd /d "%~dp0" && start-user-app.bat"
timeout /t 2 /nobreak >nul
start cmd /k "cd /d "%~dp0" && start-partner-app.bat"
echo Both apps have been launched in separate terminal windows!

