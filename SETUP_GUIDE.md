# Setup Guide - Loan Application System

## Architecture Overview

This is a simplified loan application system with:
- **Backend**: Single Python FastAPI application
- **Frontend**: React + TypeScript + Vite (runs locally, no Docker)
- **Database**: PostgreSQL (Docker only)

## Prerequisites

- Python 3.9 or higher
- Node.js 18 or higher
- Docker & Docker Compose
- pip (Python package manager)
- npm (Node package manager)

## Step 1: Clone and Setup Environment

```bash
git clone <your-repo>
cd loan-app

# Copy environment file
cp .env.example .env
```

## Step 2: Start PostgreSQL Database

```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Verify database is running
docker-compose ps
docker-compose logs postgres
```

This will:
- Start PostgreSQL on port 5432
- Create database with schema from `postgres/init.sql`
- Insert sample loan products

## Step 3: Setup Python Backend

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run the backend
python main.py
```

Backend will start on: **http://localhost:5000**

API Documentation available at:
- Swagger UI: http://localhost:5000/docs
- ReDoc: http://localhost:5000/redoc

## Step 4: Setup React Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

Frontend will start on: **http://localhost:5173**

## Testing the Application

### 1. Test Backend API

```bash
# Health check
curl http://localhost:5000/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "first_name": "Test",
    "last_name": "User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'

# Get loan products
curl http://localhost:5000/api/loans/products
```

### 2. Test Frontend

Open browser and go to: http://localhost:5173

## Common Commands

### Database Management

```bash
# Stop database
docker-compose down

# Stop and remove volumes (fresh start)
docker-compose down -v

# View logs
docker-compose logs -f postgres

# Access PostgreSQL CLI
docker exec -it loan-app-db psql -U loanuser -d loan_db
```

### Backend Development

```bash
# Run with auto-reload
uvicorn main:app --reload --port 5000

# View logs
# (output in terminal where you ran python main.py)
```

### Frontend Development

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
loan-app/
├── backend/              # Python FastAPI backend
│   ├── main.py          # Main application file
│   ├── requirements.txt # Python dependencies
│   ├── .env.example     # Environment variables template
│   └── README.md        # Backend documentation
│
├── frontend/            # React frontend
│   ├── src/            # Source code
│   ├── package.json    # Node dependencies
│   └── .env.example    # Frontend environment variables
│
├── postgres/           # PostgreSQL configuration
│   └── init.sql       # Database schema and seed data
│
├── docker-compose.yml # PostgreSQL container only
├── .env.example       # Root environment variables
└── README.md          # This file
```

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=loan_db
DB_USER=loanuser
DB_PASSWORD=loanpass123
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `docker-compose ps`
- Check logs: `docker-compose logs postgres`
- Verify port 5432 is not in use by another service

### Backend Issues
- Ensure Python 3.9+ is installed: `python --version`
- Check all dependencies are installed: `pip list`
- Verify database is accessible
- Check .env file has correct database credentials

### Frontend Issues
- Ensure Node.js 18+ is installed: `node --version`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check .env file has correct API URL
- Verify backend is running on port 5000

## Development Workflow

1. Start PostgreSQL: `docker-compose up -d`
2. Start Backend: `cd backend && python main.py`
3. Start Frontend: `cd frontend && npm run dev`
4. Make changes to code (auto-reloads in both backend and frontend)
5. Test in browser at http://localhost:5173

## Stopping the Application

```bash
# Stop frontend (Ctrl+C in terminal)

# Stop backend (Ctrl+C in terminal)

# Stop database
docker-compose down
```

## Next Steps

- Add more API endpoints
- Implement admin dashboard
- Add document upload functionality
- Deploy to cloud platform
- Add automated tests
