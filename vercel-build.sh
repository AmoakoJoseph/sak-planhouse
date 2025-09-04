#!/bin/bash

echo "Starting Vercel build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build client
echo "Building client..."
cd client
npm install
npm run build
cd ..

# Copy built files to root
echo "Copying built files to root..."
node build-client.js

echo "Build completed successfully!"
