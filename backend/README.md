# School Management Backend

NestJS backend with comprehensive security features.

## Features

- ✅ Rate Limiting & DDoS Protection (Throttler)
- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt)
- ✅ Helmet Security Headers
- ✅ CORS Protection
- ✅ Input Validation
- ✅ PostgreSQL Database
- ✅ Redis Caching
- ✅ Role-Based Access Control

## Setup

1. Start Docker containers:
```bash
docker-compose up -d
```

2. Install dependencies:
```bash
cd backend
npm install
```

3. Create .env file:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run start:dev
```

Server runs on http://localhost:4000

## API Endpoints

### Authentication
- POST /api/auth/login
- POST /api/auth/register

### Students
- GET /api/students
- GET /api/students/:id
- POST /api/students
- PUT /api/students/:id
- DELETE /api/students/:id

### Teachers
- GET /api/teachers
- GET /api/teachers/:id

### Classes
- GET /api/classes
- GET /api/classes/:id
