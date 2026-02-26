@echo off
title NEON PATH - Launcher
echo ==========================================
echo       STARTAR NEON PATH LOKALT...
echo ==========================================
echo.
echo Denna fil startar en liten lokal server sa att spelet funkar perfekt.
echo.
echo [1/2] Startar servern...
start /b cmd /c "npx -y serve -s dist/public -p 8082"
echo [2/2] Oppnar Chrome...
timeout /t 2 /nobreak > nul
start http://localhost:8082
echo.
echo Klart! Du kan stanga detta fonster nu om du vill, 
echo men servern slutar kora om du gor det.
echo.
pause
