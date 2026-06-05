
@echo off
cd /d "%~dp0"
set PATH=C:\site source of tbs;C:\site source of tbs\package\bin;%PATH%
npm run dev
pause
