@echo off
echo Starting Love Lens Server...

:: Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running! Please install Docker Desktop and start it.
    pause
    exit /b
)

:: Build and Start
echo Building and starting containers...
docker-compose up -d --build

echo.
echo Server is running at http://localhost:3000
echo To stop the server, run: docker-compose down
pause
