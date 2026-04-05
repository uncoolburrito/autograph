#!/bin/bash

echo "🚀 Starting AutoGraph..."

# Trap Ctrl+C to kill both background processes gracefully
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM

# 1. Start the Python Backend
echo "Starting FastAPI backend on port 8000..."
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# 2. Start the Next.js Frontend
echo "Starting Next.js frontend on port 3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Both servers are booting up!"
echo ""
echo "🌐 Frontend URL: http://localhost:3000"
echo "⚙️  Backend API:  http://127.0.0.1:8000"
echo ""
echo "Press Ctrl+C to stop both servers."

# Wait for background processes to prevent script from exiting
wait
