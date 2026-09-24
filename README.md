# Airtel Local Call Plans
test

A simplified Airtel Local Call Plans with Python FastAPI backend and React frontend.

## Architecture

- **Backend**: Python FastAPI (unified backend)
- **Frontend**: React + TypeScript + Vite (no Docker)
- **Database**: PostgreSQL (Docker only)

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- Docker & Docker Compose (for PostgreSQL only)

### 1. Start PostgreSQL Database
```bash
docker-compose up -d
```

### 2. Start Backend (Python FastAPI)
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Backend runs on: http://localhost:5000

### 3. Start Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

## API Documentation

Interactive API docs available at:
- Swagger UI: http://localhost:5000/docs
- ReDoc: http://localhost:5000/redoc

## Features

- User authentication (register/login)
- Browse loan products
- Calculate loan payments
- Submit loan applications
- Track application status

## Project Structure

```
loan-app/
├── backend/          # Python FastAPI backend
├── frontend/         # React frontend
├── postgres/         # PostgreSQL init scripts
└── docker-compose.yml # PostgreSQL container only
```

See SETUP_GUIDE.md for detailed setup instructions.
