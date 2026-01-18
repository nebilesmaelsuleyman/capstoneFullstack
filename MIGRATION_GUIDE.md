# School Management System - Database Migration & Setup Guide

## Prerequisites
- Docker & Docker Compose installed
- Node.js 18+ installed
- Git

## Step 1: Clone and Setup Project

```bash
# Clone the repository
git clone <your-repo-url>
cd school-management-system

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

## Step 2: Database Setup with Docker

### Start Docker Containers
```bash
# Start PostgreSQL and Redis containers
docker-compose up -d

# Verify containers are running
docker ps
```

You should see:
- `school-management-system-postgres-1` (PostgreSQL)
- `school-management-system-redis-1` (Redis)

### Initialize Database Schema

```bash
# Connect to PostgreSQL container
docker exec -it school-management-system-postgres-1 psql -U schooladmin -d schooldb -f /docker-entrypoint-initdb.d/init.sql

# Or run the SQL file directly
docker exec -i school-management-system-postgres-1 psql -U schooladmin -d schooldb < backend/init.sql
```

### Populate Seed Data

```bash
# Run the comprehensive seed data migration
docker exec -i school-management-system-postgres-1 psql -U schooladmin -d schooldb < backend/seed-data.sql

# Verify data was inserted
docker exec school-management-system-postgres-1 psql -U schooladmin -d schooldb -c "SELECT COUNT(*) FROM users;"
docker exec school-management-system-postgres-1 psql -U schooladmin -d schooldb -c "SELECT COUNT(*) FROM students;"
```

## Step 3: Environment Configuration

### Backend Configuration
Create `.env` file in the `backend` directory:

```env
# Database Configuration
DATABASE_URL=postgresql://schooladmin:schoolpass@localhost:5432/schooldb

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=24h

# Server Configuration
PORT=3001
NODE_ENV=development

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
```

### Frontend Configuration
Create `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

## Step 4: Run the Application

### Start Backend Server

```bash
# Navigate to backend directory
cd backend

# Start NestJS development server
npm run start:dev

# Expected output:
# [Nest] 12345 - 01/15/2024, 10:30:00 AM     LOG [NestFactory] Starting Nest application...
# [Nest] 12345 - 01/15/2024, 10:30:02 AM     LOG [InstanceLoader] TypeOrmModule dependencies initialized...
# [Nest] 12345 - 01/15/2024, 10:30:03 AM     LOG [RouterExplorer] Mapped /api/students GET route...
# Server running on http://localhost:3001
```

### Start Frontend Server (in a new terminal)

```bash
# From the project root directory
npm run dev

# Expected output:
# ▲ Next.js 14.0.0
# - Local: http://localhost:3000
```

## Step 5: Access the Application

Open your browser and navigate to: `http://localhost:3000`

## Default Login Credentials

### Admin Account
- **Email**: admin@school.com
- **Password**: Admin@123

### Teacher Account
- **Email**: john.teacher@school.com
- **Password**: (from seed data - typically same as initial)

### Student Account
- **Email**: ali.student@school.com
- **Password**: (from seed data - typically same as initial)

## Database Schema Overview

### Core Tables
- **users**: System users with roles (admin, teacher, student)
- **students**: Student information linked to users
- **teachers**: Teacher information linked to users
- **classes**: Classes with grade levels and sections

### Academic Tables
- **subjects**: Subject/course information
- **class_subjects**: Mapping of subjects to classes and teachers
- **student_classes**: Student enrollment in classes
- **grades**: Student grades for subjects
- **exams**: Exam definitions and schedules
- **exam_results**: Individual exam results

### Support Tables
- **attendance**: Student attendance records
- **timetable**: Class timetable schedule
- **announcements**: School announcements
- **fee_structure**: Fee types and amounts
- **fee_payments**: Student fee payment records
- **library_books**: Library book inventory
- **book_issues**: Book issue and return tracking
- **leave_requests**: Student leave requests
- **notifications**: User notifications
- **parent_student_relation**: Parent-student relationships

## Seed Data Included

The `seed-data.sql` file includes:
- 1 Admin User
- 4 Teachers with different departments
- 10 Students across two grade levels
- 4 Classes (Grade 9-A, 9-B, 10-A, 10-B)
- 7 Subjects
- 7 Exams with schedules
- 13 Grade records
- 25 Attendance records
- 13 Timetable entries
- 6 Announcements
- 10 Fee structure entries
- 8 Fee payment records
- 10 Library books
- 8 Book issue records
- 4 Leave requests
- 5 Notifications

## Verifying the Setup

### Check Database Connection
```bash
docker exec school-management-system-postgres-1 psql -U schooladmin -d schooldb -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public';"
```

### Check API Endpoints
```bash
# Get all students
curl http://localhost:3001/api/students

# Get all teachers
curl http://localhost:3001/api/teachers

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"Admin@123"}'
```

### Check Frontend
- Navigate to http://localhost:3000
- Login with admin credentials
- Navigate through different modules (Students, Teachers, Grades, etc.)

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL container logs
docker logs school-management-system-postgres-1

# Verify container is running
docker exec school-management-system-postgres-1 psql -U schooladmin -d schooldb -c "SELECT version();"
```

### Redis Connection Issues
```bash
# Check Redis container logs
docker logs school-management-system-redis-1

# Test Redis connection
docker exec school-management-system-redis-1 redis-cli ping
# Expected response: PONG
```

### Backend Connection Issues
```bash
# Check if backend server is running
curl http://localhost:3001/api/health

# Check backend logs for errors
# The console should show detailed error messages
```

### Frontend Connection Issues
```bash
# Check if frontend is running
curl http://localhost:3000

# Check browser console for API errors
# DevTools → Console tab for JavaScript errors
```

## Next Steps

1. **Explore the Dashboard**: Navigate through all modules to familiarize with the system
2. **Create New Records**: Use the "Add" buttons to create new students, teachers, etc.
3. **Test CRUD Operations**: 
   - Create new entries
   - Edit existing entries
   - Delete entries (confirm deletion works)
   - Search and filter data
4. **Verify Data Persistence**: Refresh the page to ensure data persists
5. **Check API Responses**: Monitor network tab in DevTools to see API calls
6. **Test Authentication**: Logout and login with different user roles

## Production Deployment

For production deployment:

1. **Environment Variables**: Use secure production values
2. **Database**: Use managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
3. **Redis**: Use managed Redis service (AWS ElastiCache, etc.)
4. **Backend**: Deploy to container service (Docker, Kubernetes, etc.)
5. **Frontend**: Deploy to CDN (Vercel, Netlify, etc.)
6. **SSL/TLS**: Enable HTTPS with valid certificates
7. **Backups**: Configure automated database backups
8. **Monitoring**: Set up logging and monitoring

## API Documentation

See `API_DOCUMENTATION.md` for complete API endpoint reference.

## Support

For issues or questions, refer to:
- Backend logs: Check NestJS console output
- Frontend logs: Check browser DevTools console
- Database logs: `docker logs school-management-system-postgres-1`
