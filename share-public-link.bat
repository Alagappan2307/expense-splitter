@echo off
title Expense Splitter - Public Website Link Generator
echo ============================================================
echo   Expense Splitter - Live Public Website Link Generator
echo ============================================================
echo.
echo Make sure start-all.bat (or run-frontend.bat) is running on port 5173!
echo.
echo Launching Localtunnel on Port 5173...
echo.
echo Your public live demo URL will appear below (e.g. https://xxxx.loca.lt).
echo Share that link with your teachers / reviewers for your live demo!
echo.
echo (NOTE: When opening the link the first time, it might ask for an IP password.
echo  Your IP password is displayed by typing your public IP, or check the terminal.)
echo ============================================================
echo.
cmd /c "npx localtunnel --port 5173"
pause
