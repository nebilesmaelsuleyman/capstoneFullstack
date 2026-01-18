# School Management System

A full-stack school management system built with Next.js frontend and NestJS backend.

## 🚀 Features

### Frontend (Next.js)
- Modern, dark-themed dashboard
- Student management with search and filtering
- Teacher directory
- Class management with capacity tracking
- Real-time activity feed
- Responsive design for all devices

### Backend (NestJS)
- RESTful API with JWT authentication
- Rate limiting & DDoS protection
- PostgreSQL database with Docker
- Redis caching
- Secure password hashing with bcrypt
- Helmet security headers
- CORS protection
- Input validation

## 📋 Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

## 🛠️ Setup Instructions

### 1. Start Database with Docker

```bash
# From project root
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379

### 2. Setup Backend

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run start:dev
```

Backend runs on http://localhost:4000

### 3. Setup Frontend

```bash
# From project root (Next.js is in the root)
npm install

# Start development server
npm run dev
```

Frontend runs on http://localhost:3000

## 🔒 Security Features

- **Rate Limiting**: 3 requests/second, 20/10seconds, 100/minute
- **DDoS Protection**: NestJS Throttler
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **SQL Injection Prevention**: Parameterized queries
- **CORS Protection**: Configured origins
- **Security Headers**: Helmet middleware
- **Input Validation**: class-validator decorators

## 📊 Database Schema

- **users**: Authentication and user profiles
- **students**: Student information and records
- **teachers**: Teacher profiles and qualifications
- **classes**: Class schedules and assignments
- **subjects**: Subject definitions
- **grades**: Student grades and assessments
- **attendance**: Attendance tracking

## 🎨 Design

Beautiful dark theme with:
- Professional color palette
- Smooth animations
- Responsive layouts
- Accessible components
- Modern typography

## 📚 Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui components

**Backend:**
- NestJS
- TypeScript
- PostgreSQL
- Redis
- JWT & Passport
- bcrypt

**DevOps:**
- Docker & Docker Compose
- Standard folder structure
```

```json file="" isHidden
# capstoneFullstack
