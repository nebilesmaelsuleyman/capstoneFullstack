# School Management System - Complete Setup Guide

## 📦 What You'll Build

A complete full-stack school management system with:
- **Frontend**: Next.js 16 with beautiful dark theme
- **Backend**: NestJS with enterprise security features
- **Database**: PostgreSQL with Docker
- **Caching**: Redis for performance
- **Security**: Rate limiting, DDoS protection, JWT auth, bcrypt

---

## 🚀 Quick Start (5 minutes)

### Step 1: Start the Database

```bash
# Start PostgreSQL and Redis with Docker
docker-compose up -d

# Verify containers are running
docker ps
```

You should see `school_db` and `school_redis` running.

---

### Step 2: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the backend server
npm run start:dev
```

Backend will run on **http://localhost:4000**

Test it: `curl http://localhost:4000/api`

---

### Step 3: Setup Frontend

```bash
# From project root
npm install

# Create environment file
cp .env.example .env

# Start the frontend
npm run dev
```

Frontend will run on **http://localhost:3000**

---

### Step 4: Login

Open http://localhost:3000/login

**Default Admin Credentials:**
- Email: `admin@school.com`
- Password: `Admin@123`

---

## 📁 Project Structure

```
school-management/
├── app/                      # Next.js frontend (App Router)
│   ├── dashboard/           # Dashboard pages
│   ├── students/            # Student management
│   ├── teachers/            # Teacher management
│   ├── classes/             # Class management
│   └── login/               # Authentication
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   ├── dashboard/          # Dashboard components
│   ├── students/           # Student components
│   └── teachers/           # Teacher components
├── lib/                    # Utilities
│   ├── api-client.ts      # API client
│   └── auth-context.tsx   # Auth provider
├── backend/                # NestJS backend
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── students/      # Students module
│   │   ├── teachers/      # Teachers module
│   │   ├── classes/       # Classes module
│   │   ├── database/      # Database connection
│   │   └── redis/         # Redis connection
│   ├── init.sql           # Database schema
│   └── package.json
├── docker-compose.yml     # Docker configuration
└── README.md
```

---

## 🔒 Security Features

### 1. Rate Limiting
- 3 requests per second
- 20 requests per 10 seconds
- 100 requests per minute

### 2. DDoS Protection
NestJS Throttler guard applied globally

### 3. Authentication
- JWT tokens with 24h expiration
- bcrypt password hashing (10 rounds)
- HTTP-only cookies support

### 4. Security Headers
Helmet middleware adds:
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- And more...

### 5. Input Validation
class-validator decorators on all DTOs

### 6. SQL Injection Prevention
Parameterized queries with pg library

---

## 🗄️ Database Schema

### Users Table
- id, email, password_hash, role, first_name, last_name
- Roles: admin, teacher, student

### Students Table
- User info + student_id, grade_level, parent info

### Teachers Table
- User info + employee_id, department, specialization

### Classes Table
- class_name, grade_level, teacher_id, capacity

### Grades Table
- student_id, subject_id, grade, exam_date

### Attendance Table
- student_id, class_id, date, status

---

## 🔧 Environment Variables

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Backend (backend/.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=school_management
DB_USER=school_admin
DB_PASSWORD=school_secure_pass_2024

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your-secret-key-change-in-production
PORT=4000
FRONTEND_URL=http://localhost:3000
```

---

## 🧪 Testing the API

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"Admin@123"}'
```

### Get Students (with auth token)
```bash
curl http://localhost:4000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🐳 Docker Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Restart containers
docker-compose restart

# Remove all data (caution!)
docker-compose down -v
```

---

## 📝 Common Issues

### Port Already in Use
```bash
# Check what's using port 5432
lsof -i :5432

# Kill the process
kill -9 <PID>
```

### Database Connection Failed
1. Ensure Docker is running
2. Check containers: `docker ps`
3. Restart: `docker-compose restart`

### Cannot Login
1. Check backend is running on port 4000
2. Verify database has admin user
3. Check browser console for errors

---

## 🚢 Production Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Backend (Docker)
```bash
# Build image
docker build -t school-backend ./backend

# Run container
docker run -p 4000:4000 school-backend
```

### Environment Variables
Remember to update:
- JWT_SECRET to a strong random string
- Database credentials
- CORS origins
- API URLs

---

## 🎨 Customization

### Change Theme Colors
Edit `app/globals.css` - modify the dark theme variables:
```css
.dark {
  --primary: oklch(0.65 0.25 265);  /* Change this */
  --background: oklch(0.12 0 0);
}
```

### Add New Module
1. Create NestJS module: `nest g module feature`
2. Add controller: `nest g controller feature`
3. Add service: `nest g service feature`
4. Create frontend page in `app/feature/page.tsx`

---

## 📚 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend**: NestJS, TypeScript, PostgreSQL, Redis
- **Auth**: JWT, Passport, bcrypt
- **Security**: Helmet, Throttler, CORS
- **UI**: shadcn/ui, Radix UI
- **DevOps**: Docker, Docker Compose

---

## 🤝 Support

Need help? Check:
1. Backend logs: `cd backend && npm run start:dev`
2. Frontend logs: Browser console
3. Database logs: `docker-compose logs postgres`

---

## ✅ Checklist

- [ ] Docker installed and running
- [ ] Node.js 18+ installed
- [ ] Ports 3000, 4000, 5432, 6379 available
- [ ] Environment files created
- [ ] Dependencies installed
- [ ] Database containers running
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Can login successfully

---

**You're all set! Start managing your school with confidence.** 🎓
