@echo off
title Deploy to AWS Server (13.60.77.153)
cd /d "%~dp0"

echo ========================================================
echo 🚀 Deploying PAW NEAR to AWS Server (13.60.77.153)
echo Using Key: paw.pem
echo ========================================================
echo.

if not exist "paw.pem" (
  echo ❌ Error: paw.pem not found in this directory!
  pause
  exit /b 1
)

echo 1. Pushing latest changes to GitHub...
call git add -A
call git commit -m "feat: automated aws deployment script"
call git push

echo.
echo 2. Connecting to AWS EC2 and deploying...
ssh -i "paw.pem" -o StrictHostKeyChecking=no ubuntu@13.60.77.153 "if [ ! -d ~/paw-street ]; then git clone https://github.com/hemanthcodtech-wq/paw-street.git ~/paw-street; fi && cd ~/paw-street && git pull && bash setup-aws-production.sh"

echo.
echo ========================================================
echo Deployment finished!
echo ========================================================
pause

