@echo off
title Love Lens Server
color 0A
echo ==========================================
echo       LOVE LENS - SERVER LAUNCHER
echo ==========================================
echo.

:: 1. Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

:: 2. Check for .env
if not exist ".env" (
    color 0C
    echo [ERROR] .env file is missing!
    echo Please create a .env file with your Google Credentials.
    pause
    exit /b
)

:: 3. Install Dependencies (if needed)
if not exist "node_modules" (
    echo [INFO] Installing dependencies (this happens only once)...
    call npm install
)

:: 4. Database Setup
echo [INFO] Checking database...
call npx prisma migrate deploy

:: 5. Build (if needed)
if not exist ".next" (
    echo [INFO] Building application (this may take a minute)...
    call npm run build
)

:: 6. Start Server
cls
echo ==========================================
echo       LOVE LENS IS RUNNING!
echo ==========================================
echo.
echo [LOCAL] Access your app at: http://localhost:3000
echo.
echo [NOTE]  To stop the server, press Ctrl+C
echo.

call npm start
pause
