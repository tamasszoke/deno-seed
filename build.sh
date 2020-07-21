#!/bin/bash

echo "[DENO SEED] 1/3 - Initializing..."
rm -rf build
mkdir -p build

echo "[DENO SEED] 2/3 - Building frontend..."
(cd "frontend/" && npm run build > /dev/null 2>&1)
cp -r frontend/build/ build/

echo "[DENO SEED] 3/3 - Building backend..."
(cd "backend/" && deno bundle app.ts --unstable app.bundle.js > /dev/null 2>&1)
cp backend/app.bundle.js build/
cp -r backend/.env/ build/
cp backend/denon.json build/
