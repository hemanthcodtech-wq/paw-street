@echo off
title Paw Street - User Mobile App (Port 8081)
cd /d "%~dp0apps\user-app"
echo ========================================================
echo Starting Paw Street User Mobile App on Port 8081...
echo URL: http://localhost:8081
echo ========================================================
if not exist node_modules (
  echo Installing dependencies first...
  call npm install
)
call npx expo start --web --port 8081
pause

