#!/bin/bash

echo "Tournament Registration - Quick Start"
echo "====================================="
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not found! Please install Node.js 16+"
    exit 1
fi

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "ERROR: PHP not found! Please install PHP 8.1+"
    exit 1
fi

# Check if Composer is installed
if ! command -v composer &> /dev/null; then
    echo "ERROR: Composer not found! Please install Composer"
    exit 1
fi

# Check if PostgreSQL is running
echo "Checking PostgreSQL connection..."
psql -U postgres -d postgres -c "SELECT 1" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "WARNING: Could not connect to PostgreSQL. Make sure it's running!"
    echo ""
fi

echo "Starting servers..."
echo ""

# Start backend
echo "Starting Laravel backend on http://localhost:8000"
cd backend-laravel
php artisan serve &
BACKEND_PID=$!

# Give it a second to start
sleep 2

# Start frontend in background too, but print output
cd ../frontend-react
npm run dev &
FRONTEND_PID=$!

echo ""
echo "====================================="
echo "Servers starting..."
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop servers"
echo "====================================="

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
