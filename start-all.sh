#!/bin/bash
set -e

echo "[1/4] Installing frontend dependencies..."
npm install

echo "[2/4] Installing backend dependencies..."
cd backend && npm install && cd ..

echo "[3/4] Building frontend for production..."
npm run build

echo "[4/4] Starting all services with Docker Compose..."
echo "(Note: npm run build must complete before docker-compose up --build, so dist/ exists for nginx static serving)"
docker-compose up --build
