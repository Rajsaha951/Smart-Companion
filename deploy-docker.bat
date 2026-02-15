@echo off
REM Smart Companion - Complete Docker Deployment Script (Windows)
REM This script automates the entire Docker setup process

setlocal EnableDelayedExpansion

echo ========================================
echo Smart Companion - Docker Deployment
echo ========================================
echo.

REM Check if Docker is installed
echo [1/8] Checking prerequisites...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Docker is not installed!
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Docker Compose is not installed!
    echo Please install Docker Desktop which includes Compose
    pause
    exit /b 1
)

echo [OK] Docker and Docker Compose are installed
echo.

REM Check if Docker daemon is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Docker daemon is not running!
    echo Please start Docker Desktop and try again
    pause
    exit /b 1
)

echo [OK] Docker daemon is running
echo.

REM Create directory structure if needed
echo [2/8] Setting up directory structure...
if not exist "backend" mkdir backend
if not exist "frontend" mkdir frontend
if not exist "llm_api" mkdir llm_api
echo [OK] Directory structure ready
echo.

REM Copy Dockerfiles to correct locations
echo [3/8] Copying Dockerfiles...

if exist "backend-Dockerfile" (
    copy /Y backend-Dockerfile backend\Dockerfile >nul
    echo [OK] Backend Dockerfile copied
) else (
    echo [!] backend-Dockerfile not found, skipping...
)

if exist "llm_api-Dockerfile" (
    copy /Y llm_api-Dockerfile llm_api\Dockerfile >nul
    echo [OK] LLM API Dockerfile copied
) else (
    echo [!] llm_api-Dockerfile not found, skipping...
)

if exist "frontend-Dockerfile" (
    copy /Y frontend-Dockerfile frontend\Dockerfile >nul
    echo [OK] Frontend Dockerfile copied
) else (
    echo [!] frontend-Dockerfile not found, skipping...
)
echo.

REM Copy nginx config
echo [4/8] Copying nginx configuration...
if exist "frontend-nginx.conf" (
    copy /Y frontend-nginx.conf frontend\nginx.conf >nul
    echo [OK] Nginx config copied
) else (
    echo [!] frontend-nginx.conf not found, skipping...
)
echo.

REM Copy .dockerignore files
echo [5/8] Copying .dockerignore files...

if exist "backend.dockerignore" (
    copy /Y backend.dockerignore backend\.dockerignore >nul
    echo [OK] Backend .dockerignore copied
)

if exist "llm_api.dockerignore" (
    copy /Y llm_api.dockerignore llm_api\.dockerignore >nul
    echo [OK] LLM API .dockerignore copied
)

if exist "frontend.dockerignore" (
    copy /Y frontend.dockerignore frontend\.dockerignore >nul
    echo [OK] Frontend .dockerignore copied
)
echo.

REM Setup environment file
echo [6/8] Setting up environment variables...
if exist ".env" (
    echo [!] .env file already exists
    set /p OVERWRITE="Do you want to overwrite it? (y/N): "
    if /i "!OVERWRITE!"=="y" (
        if exist ".env.docker.example" (
            copy /Y .env.docker.example .env >nul
            echo [OK] .env file created from template
        )
    )
) else (
    if exist ".env.docker.example" (
        copy /Y .env.docker.example .env >nul
        echo [OK] .env file created from template
    ) else (
        echo [X] .env.docker.example not found!
        pause
        exit /b 1
    )
)
echo.

REM Check if .env has required values
echo [i] Checking environment variables...
findstr /C:"your_actual_gemini_api_key_here" .env >nul 2>&1
if %errorlevel% equ 0 (
    echo [X] GEMINI_API_KEY not set in .env file!
    echo.
    echo Please edit .env file and add your actual API keys:
    echo   notepad .env
    echo.
    echo Required:
    echo   - GEMINI_API_KEY: Get from https://ai.google.dev/
    echo   - JWT_SECRET: Generate a random 32+ character string
    echo.
    pause
)
echo.

REM Copy docker-compose.yml
echo [7/8] Setting up Docker Compose...
if exist "docker-compose-complete.yml" (
    copy /Y docker-compose-complete.yml docker-compose.yml >nul
    echo [OK] Docker Compose file ready
) else (
    echo [X] docker-compose-complete.yml not found!
    pause
    exit /b 1
)
echo.

REM Build and start containers
echo [8/8] Building and starting containers...
echo This may take several minutes on first run...
echo.

echo [i] Building images...
docker-compose build --no-cache
if %errorlevel% equ 0 (
    echo [OK] All images built successfully
) else (
    echo [X] Build failed! Check errors above
    pause
    exit /b 1
)
echo.

echo [i] Starting services...
docker-compose up -d
if %errorlevel% equ 0 (
    echo [OK] All services started
) else (
    echo [X] Failed to start services! Check errors above
    pause
    exit /b 1
)
echo.

REM Wait for services to be healthy
echo Waiting for services to be healthy...
timeout /t 10 /nobreak >nul

REM Check service status
echo.
echo Checking service health...
docker-compose ps
echo.

REM Test endpoints
echo Testing endpoints...
timeout /t 5 /nobreak >nul

curl -f http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] LLM API is healthy (port 8000^)
) else (
    echo [!] LLM API is not responding yet
)

curl -f http://localhost:5000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend is healthy (port 5000^)
) else (
    echo [!] Backend is not responding yet
)

curl -f http://localhost:5500 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Frontend is healthy (port 3000^)
) else (
    echo [!] Frontend is not responding yet
)
echo.

REM Summary
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Services running:
echo   - Frontend:  http://localhost:5500
echo   - Backend:   http://localhost:5000
echo   - LLM API:   http://localhost:8000/docs
echo   - MongoDB:   mongodb://localhost:27017
echo.
echo Useful commands:
echo   - View logs:      docker-compose logs -f
echo   - Stop services:  docker-compose down
echo   - Restart:        docker-compose restart
echo   - Check status:   docker-compose ps
echo.
echo Access your application at: http://localhost:5500
echo.
echo [OK] Setup complete!
echo.
pause