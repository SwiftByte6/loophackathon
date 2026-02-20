#!/bin/bash

# Kill any existing processes on ports 5173 (Vite) and 8000 (FastAPI)
echo "Cleaning up existing processes..."
lsof -i :5173 -t | xargs kill -9 2>/dev/null
lsof -i :8000 -t | xargs kill -9 2>/dev/null

echo "Starting Frontend and Backend..."
npm run dev:all
