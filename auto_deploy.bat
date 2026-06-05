@echo off
echo ==========================================
echo      Auto Deployment Script
echo ==========================================

cd /d "c:\site source\CODE\tbs-website"

echo.
echo [1/5] Checking Dependencies...
if not exist node_modules (
    echo Installing packages...
    call npm install next@15 react react-dom
    call npm install
) else (
    echo Dependencies found. Skipping install.
)

echo.
echo [2/5] Setting up Git...
if not exist .git (
    git init
    echo Git initialized.
)
git add .
git commit -m "Initial Next.js project setup" || echo Nothing to commit.

echo.
echo [3/5] Configuring Remote...
git remote remove origin 2>nul
git remote add origin https://github.com/codewith-mr/move_on.git
git branch -M main
echo Remote configured: https://github.com/codewith-mr/move_on.git

echo.
echo [4/5] Pushing to GitHub...
echo Attempting push... (You may need to authenticate if prompted)
git push -u origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    echo ERROR: Git Push failed.
    echo Likely due to missing authentication.
    echo Please run 'git push -u origin main' manually and sign in.
    echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
)

echo.
echo [5/5] Vercel Deployment...
echo Checking Vercel login status...
call npx --yes vercel whoami >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Authenticated. Starting deployment...
    call npx --yes vercel project add move_on --framework nextjs --root . 2>nul
    call npx --yes vercel deploy --prod --yes --name move_on
) else (
    echo.
    echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    echo NOTICE: You are not logged in to Vercel.
    echo Please run the following commands manually:
    echo    1. npx vercel login
    echo    2. npx vercel deploy --prod
    echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
)

echo.
echo Done.
pause
