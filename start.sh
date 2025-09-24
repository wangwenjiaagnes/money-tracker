#!/bin/bash

echo "🚀 Starting Money Tracker..."
echo "📁 Project directory: $(pwd)"
echo "🌐 Server will start on: http://localhost:8000"
echo ""
echo "📋 Available pages:"
echo "   • Home: http://localhost:8000/home.html"
echo "   • Login: http://localhost:8000/login.html"
echo "   • Transaction: http://localhost:8000/transaction.html"
echo "   • Analysis: http://localhost:8000/analysis.html"
echo "   • Settings: http://localhost:8000/settings.html"
echo "   • Test: http://localhost:8000/test_basic.html"
echo ""
echo "🚀 For production deployment, update URLs in config.js"
echo ""
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Start the server
python3 -m http.server 8000
