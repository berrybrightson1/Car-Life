@echo off
echo Starting Car Life System (Localhost:3001)...
echo Connected to Vercel Postgres (Online DB)
cd /d "%~dp0"
call npm run dev
pause
