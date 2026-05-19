@echo off
echo Tournament Registration - Quick Start
echo =====================================
echo.

REM Check if Node is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found! Please install Node.js 16+
    pause
    exit /b 1
)

REM Check if PHP is installed
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PHP not found! Please install PHP 8.1+
    pause
    exit /b 1
)

REM Check if Composer is installed
composer --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Composer not found! Please install Composer
    pause
    exit /b 1
)

REM Check if PostgreSQL is running
echo Checking PostgreSQL connection...
psql -U postgres -d postgres -c "SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Could not connect to PostgreSQL. Make sure it's running!
    echo.
)

echo Starting servers...
echo.

REM Start backend in new window
echo Starting Laravel backend on http://localhost:8000
start cmd /k "cd backend-laravel && php artisan serve"

timeout /t 3 /nobreak

REM Start frontend in new window
echo Starting React frontend on http://localhost:3000
start cmd /k "cd frontend-react && npm run dev"

echo.
echo =====================================
echo Servers starting...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000
echo.
echo Press Ctrl+C in either window to stop servers
echo =====================================
pause
