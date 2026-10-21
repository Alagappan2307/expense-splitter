@echo off
title Expense Splitter - Launcher
echo ============================================================
echo   Launching Expense Splitter with Debt Simplification
echo ============================================================
echo.
cd /d "%~dp0"

echo [1/2] Launching Spring Boot Backend on http://localhost:8080...
start "Expense Splitter - Backend" cmd /c "run-backend.bat"

echo Waiting 3 seconds for backend to initialize...
timeout /t 3 /nobreak >nul

echo [2/2] Launching React Vite Frontend on http://localhost:5173...
start "Expense Splitter - Frontend" cmd /c "run-frontend.bat"

echo.
echo ============================================================
echo Both servers have been launched!
echo Open your browser at: http://localhost:5173
echo ============================================================
timeout /t 5
