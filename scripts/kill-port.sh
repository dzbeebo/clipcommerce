#!/bin/bash

# Kill processes on port 3000 (or specified port)
PORT=${1:-3000}

echo "🔍 Checking for processes on port $PORT..."

# Find and kill processes on the specified port
if command -v lsof >/dev/null 2>&1; then
    PIDS=$(lsof -ti:$PORT)
    if [ -n "$PIDS" ]; then
        echo "🔪 Killing processes on port $PORT: $PIDS"
        echo $PIDS | xargs kill -9
        echo "✅ Successfully killed processes on port $PORT"
    else
        echo "✅ No process found running on port $PORT"
    fi
else
    echo "❌ lsof command not found. Please install it or use the Node.js version."
    exit 1
fi

echo "🚀 Port $PORT is now available for use"
