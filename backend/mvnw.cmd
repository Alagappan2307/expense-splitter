@REM Maven wrapper batch file for local repository
@echo off
if exist "%~dp0..\apache-maven-3.9.9\bin\mvn.cmd" (
    "%~dp0..\apache-maven-3.9.9\bin\mvn.cmd" %*
) else (
    mvn %*
)
