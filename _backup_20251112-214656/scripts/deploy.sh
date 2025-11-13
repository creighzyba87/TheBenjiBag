#!/bin/bash

# TheBenjiBag Deployment Script for Unix/Linux/macOS

set -e

echo "🚀 TheBenjiBag Deployment Script"
echo "=================================="

# Check environment variables
if [ -z "$RENDER_API_KEY" ]; then
    echo "❌ Error: RENDER_API_KEY not set"
    exit 1
fi

if [ -z "$RENDER_SERVICE_ID" ]; then
    echo "❌ Error: RENDER_SERVICE_ID not set"
    exit 1
fi

echo "✅ Environment variables configured"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci
cd client && npm ci && cd ..

# Build frontend
echo "🔨 Building frontend..."
cd client && npm run build && cd ..

# Build backend
echo "🔨 Building backend..."
npm run build

# Run tests
echo "🧪 Running tests..."
npm test --if-present || true

# Create deployment artifact
echo "📦 Creating deployment artifact..."
zip -r thebenjibag-build.zip . \
    -x "node_modules/*" \
    "client/node_modules/*" \
    ".git/*" \
    ".env*" \
    "*.zip" \
    "dist/*"

# Deploy to Render
echo "🌐 Deploying to Render..."
curl -X POST \
    https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys \
    -H "Authorization: Bearer $RENDER_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"clearCache": "full"}'

echo "✅ Deployment initiated!"
echo "Monitor your deployment at: https://dashboard.render.com"
