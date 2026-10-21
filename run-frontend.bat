@echo off
title Expense Splitter - React Frontend
echo ============================================================
echo   Expense Splitter with Debt Simplification - Frontend
echo   React + Vite Fintech Dashboard
echo ============================================================
echo.
cd /d "%~dp0\frontend"

echo Starting Vite development server on http://localhost:5173...
cmd /c "npm run dev -- --host --port 5173"

pause
