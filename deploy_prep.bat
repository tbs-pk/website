@echo off
echo ===================================================
echo   Preparing and Pushing to GitHub
echo ===================================================

echo.
echo 1. Initializing Git repository...
if not exist .git (
    git init
    echo Git repository initialized.
) else (
    echo Git repository already exists.
)

echo.
echo 2. Configuring remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/codewith-mr/move_on.git
echo Remote origin set to https://github.com/codewith-mr/move_on.git

echo.
echo 3. Staging files...
git add .

echo.
echo 4. Committing changes...
git commit -m "Prepare for Vercel deployment: Fix 404s, update config, optimize build"

echo.
echo 5. Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ===================================================
echo   Done!
echo   If you see errors above, please check your Git installation
echo   and ensure you are logged in.
echo ===================================================
pause
