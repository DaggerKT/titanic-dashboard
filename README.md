
# Titanic Dashboard (React + Express + PostgreSQL + Docker)

## Quick Start

### Recommended: One-command setup

Just run:
```bash
bash start-all.sh
```
This will:
- Install all dependencies (frontend & backend)
- Build the frontend for production
- Start all services (PostgreSQL, backend, frontend, nginx) with Docker Compose
- Serve the app at [http://localhost](http://localhost)

### Manual Setup (if you prefer step-by-step)

1. Install dependencies:
   ```bash
   npm install
   cd backend && npm install
   ```
2. Build frontend for production:
   ```bash
   npm run build
   ```
3. Start all services:
   ```bash
   docker-compose up --build
   ```
4. Access the app at [http://localhost](http://localhost)

## Features
- Dashboard with charts and shared comments (Ant Design, Recharts)
- Full-stack: React frontend, Express backend, PostgreSQL database
- Docker Compose for easy deployment
- Production-ready: nginx reverse proxy, static build, API proxy

## File Structure
- `src/` - React frontend
- `backend/` - Express API
- `public/` - Static assets (Titanic Dataset.csv, etc.)
- `nginx.conf` - nginx reverse proxy config
- `docker-compose.yml` - Multi-service orchestration
- `start-all.sh` - One-command setup script

## Troubleshooting
- If you see 403 Forbidden from nginx, check file permissions in `dist/`
- If build fails with EACCES, fix permissions:
  ```bash
  sudo chown -R $USER:$USER public/
  chmod -R a+r public/
  rm -rf dist
  npm run build
  ```
- For API errors, check backend logs and database connection

## Tools
Built with React, Vite, Express, PostgreSQL, Docker, nginx, Ant Design, Recharts
