@echo off
title PAW NEAR - Partner Mobile App (Port 8082)
cd /d "%~dp0apps\partner-app"
echo ========================================================
echo Starting PAW NEAR Partner Mobile App on Port 8082...
echo URL: http://localhost:8082
echo ========================================================
if not exist node_modules (
  echo Installing dependencies first...
  call npm install
)
call npx expo start --web --port 8082
pause
