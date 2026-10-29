@echo off
title Paw Street - Git Auto Commit
cd /d "%~dp0"

echo ========================================================
echo 1. Syncing Website Logo to User and Partner Apps...
echo ========================================================
call node sync-logo.js

echo.
echo ========================================================
echo 2. Staging all changed files into Git...
echo ========================================================
call git add -A

echo.
echo ========================================================
echo 3. Creating Git Commit...
echo ========================================================
call git commit -m "feat: switch to AWS Server DB & S3, separate user and partner mobile apps with official logo"

echo.
echo ========================================================
echo 4. Current Git Status:
echo ========================================================
call git status

echo.
echo ========================================================
echo All changes committed! You can now run: git push
echo ========================================================
pause

