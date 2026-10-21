@echo off
title Expense Splitter - Spring Boot Backend
echo ============================================================
echo   Expense Splitter with Debt Simplification - Backend
echo   Department of IT, Anna University / KRCE
echo ============================================================
echo.
cd /d "%~dp0"

if exist "backend\target\expense-splitter-backend-1.0.0.jar" (
    echo Starting Spring Boot via packaged JAR (Fast Start)...
    java -jar backend\target\expense-splitter-backend-1.0.0.jar %*
) else (
    echo Starting Spring Boot via Maven...
    call "apache-maven-3.9.9\bin\mvn.cmd" spring-boot:run -f backend\pom.xml %*
)

pause
