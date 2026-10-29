@echo off
title Paw Street - Git Commit & Push
cd /d "%~dp0"

echo ========================================================
echo 1. Syncing Official Website Logo...
echo ========================================================
call node sync-logo.js

echo.
echo ========================================================
echo 2. Staging all changed files into Git...
echo ========================================================
call git add -A

echo.
echo ========================================================
echo 3. Committing All Changes...
echo ========================================================
call git commit -m "feat: google auth bridge with strict registered check, live credentials, aws server db, aws s3, and dual mobile apps"

echo.
echo ========================================================
echo 4. Pushing to GitHub repository...
echo ========================================================
call git push

echo.
echo ========================================================
echo Git commit and push completed successfully!
echo ========================================================
pause
