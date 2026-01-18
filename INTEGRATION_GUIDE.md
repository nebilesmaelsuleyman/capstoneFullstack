# School Management System - Integration Guide

This guide will help you set up and run the complete school management system with Next.js frontend and NestJS backend.

## System Requirements

- Node.js 18+ and npm/pnpm
- Docker and Docker Compose
- Git

## Project Structure

```
school-management-app/
├── app/                          # Next.js frontend pages
│   ├── attendance/              # Attendance management
│   ├── exams/                   # Exam and results management
│   ├── timetable/               # Class timetable/schedule
│   ├── announcements/           # School announcements
│   ├── fees/                    # Fee management
│   ├── library/                 # Library management
│   ├── students/                # Student management
│   ├── teachers/                # Teacher management
│   ├── classes/                 # Class management
│   ├── dashboard/               # Main dashboard
│   └── login/                   # Authentication
├── backend/                      # NestJS backend
│   ├── src/
│   │   ├── attendance/          # Attendance module
│   │   ├── exams/               # Exams module
│   │   ├── timetable/           # Timetable module
│   │   ├── announcements/       # Announcements module
│   │   ├── fees/                # Fee management module
│   │   ├── library/             # Library module
│   │   ├── students/            # Students module
│   │   ├── teachers/            # Teachers module
│   │   ├── classes/             # Classes module
│   │   ├── auth/                # Authentication
│   │   └── database/            # Database connection
│   ├── Dockerfile               # Backend Docker configuration
│   └── package.json
├── components/                   # React components
├── docker-compose.yml           # Docker services configuration
└── package.json                 # Frontend dependencies
```

## Step 1: Clone and Setup

```bash
# Navigate to your project directory
cd school-management-app

# Install frontend dependencies
npm install
# or
pnpm install

# Install backend dependencies
cd backend
npm install
cd ..
```

## Step 2: Environment Configuration

### Backend Environment (.env in backend folder)

Create `backend/.env` file:

```env
# Database Configuration
DATABASE_URL=postgresql://school_admin:school_password@localhost:5432/school_db

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3001
NODE_ENV=development
```

### Frontend Environment (.env.local in root folder)

Create `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Step 3: Start Docker Services

Start PostgreSQL and Redis using Docker Compose:

```bash
# Start database and Redis services
docker-compose up -d

# Verify services are running
docker-compose ps
```

The following services will be available:
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- pgAdmin (optional): `http://localhost:5050` (email: admin@admin.com, password: admin)

## Step 4: Initialize Database

The database will be automatically initialized with the schema when you start the services. The init.sql script includes:

- User management tables
- Student and teacher profiles
- Classes and subjects
- Attendance tracking
- Exam and grade management
- Timetable scheduling
- Announcements system
- Fee management
- Library management
- Sample data for testing

Default admin credentials:
- Email: `admin@school.com`
- Password: `Admin@123`

## Step 5: Start Backend Server

```bash
cd backend

# Development mode with hot reload
npm run start:dev

# Or production mode
npm run build
npm run start:prod
```

The backend API will be available at `http://localhost:3001`

### Backend API Endpoints

#### Authentication
- POST `/auth/login` - User login
- POST `/auth/register` - User registration
- GET `/auth/profile` - Get current user profile

#### Students
- GET `/students` - Get all students
- GET `/students/:id` - Get student by ID
- POST `/students` - Create new student
- PUT `/students/:id` - Update student
- DELETE `/students/:id` - Delete student

#### Teachers
- GET `/teachers` - Get all teachers
- GET `/teachers/:id` - Get teacher by ID
- POST `/teachers` - Create new teacher
- PUT `/teachers/:id` - Update teacher
- DELETE `/teachers/:id` - Delete teacher

#### Classes
- GET `/classes` - Get all classes
- GET `/classes/:id` - Get class by ID
- POST `/classes` - Create new class
- PUT `/classes/:id` - Update class
- DELETE `/classes/:id` - Delete class

#### Attendance
- POST `/attendance` - Mark single attendance
- POST `/attendance/bulk` - Mark bulk attendance
- GET `/attendance/student/:studentId` - Get student attendance
- GET `/attendance/class/:classId` - Get class attendance
- GET `/attendance/statistics/:studentId` - Get attendance statistics

#### Exams
- GET `/exams` - Get all exams
- GET `/exams/:id` - Get exam by ID
- POST `/exams` - Create new exam
- POST `/exams/:id/results` - Submit exam results
- GET `/exams/student/:studentId/results` - Get student results
- GET `/exams/:id/results` - Get exam results

#### Timetable
- GET `/timetable/class/:classId` - Get class timetable
- GET `/timetable/teacher/:teacherId` - Get teacher timetable
- POST `/timetable` - Create timetable entry
- DELETE `/timetable/:id` - Delete timetable entry

#### Announcements
- GET `/announcements` - Get all announcements
- GET `/announcements/:id` - Get announcement by ID
- POST `/announcements` - Create announcement
- DELETE `/announcements/:id` - Delete announcement

#### Fees
- GET `/fees/student/:studentId` - Get student fees
- GET `/fees/student/:studentId/payments` - Get student payments
- GET `/fees/structure` - Get fee structure
- POST `/fees/payment` - Record payment

#### Library
- GET `/library/books` - Get all books
- GET `/library/student/:studentId/issues` - Get student book issues
- POST `/library/issue` - Issue a book
- PUT `/library/return/:issueId` - Return a book

## Step 6: Start Frontend Development Server

In a new terminal (from the root directory):

```bash
# Development mode
npm run dev
# or
pnpm dev

# The app will be available at http://localhost:3000
```

## Step 7: Access the Application

1. Open your browser and navigate to `http://localhost:3000`
2. You'll see the landing page
3. Click "Sign In" or navigate to `/login`
4. Use the default admin credentials:
   - Email: `admin@school.com`
   - Password: `Admin@123`

## Available Features

### Dashboard
- Overview statistics
- Recent activity feed
- Class distribution charts
- Quick access to all modules

### Student Management
- Add, edit, delete students
- View student profiles
- Track enrollment status
- Parent contact information

### Teacher Management
- Manage teacher profiles
- Department assignments
- Qualifications tracking
- Contact information

### Class Management
- Create and manage classes
- Assign teachers to classes
- Set room numbers and capacity
- Track academic year

### Attendance Management
- Daily attendance marking
- Bulk attendance entry
- Attendance statistics and reports
- Present/Absent/Late/Excused status tracking

### Exam & Grade Management
- Create exams (midterm, final, quiz, assignment)
- Record and track results
- Grade calculation
- Performance analytics
- Student report cards

### Timetable System
- Weekly schedule view
- Subject-wise time slots
- Teacher assignment
- Room allocation
- Multiple class timetables

### Announcements
- Create announcements for different audiences
- Priority levels (high, medium, low)
- Types: general, academic, event, urgent, holiday
- Target specific groups (all, students, teachers, parents)

### Fee Management
- Fee structure setup
- Payment tracking
- Multiple payment methods
- Receipt generation
- Outstanding balance reports

### Library Management
- Book catalog
- Issue and return tracking
- Search functionality
- Overdue book alerts
- Fine calculation

## Security Features

The system includes comprehensive security measures:

### Rate Limiting
- 3 requests per second (short-term)
- 20 requests per 10 seconds (medium-term)
- 100 requests per minute (long-term)

### DDoS Protection
- Throttler guard on all routes
- Automatic IP-based rate limiting

### Authentication
- JWT-based authentication
- Bcrypt password hashing (10 rounds)
- 24-hour token expiration
- Protected routes with guards

### API Security
- Helmet security headers
- CORS protection
- Input validation with class-validator
- SQL injection prevention (parameterized queries)
- XSS protection

### Database Security
- Connection pooling
- Prepared statements
- Proper indexing for performance
- Cascading deletes for data integrity

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart PostgreSQL
docker-compose restart postgres

# View PostgreSQL logs
docker-compose logs postgres
```

### Backend Not Starting
```bash
# Clear node_modules and reinstall
cd backend
rm -rf node_modules
npm install

# Check for port conflicts
lsof -i :3001

# View backend logs
npm run start:dev
```

### Frontend Not Starting
```bash
# Clear .next cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Check for port conflicts
lsof -i :3000
```

### Redis Connection Issues
```bash
# Check Redis status
docker-compose ps redis

# Restart Redis
docker-compose restart redis

# Test Redis connection
docker exec -it school-management-redis redis-cli ping
```

## Production Deployment

### Backend Production Build
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend Production Build
```bash
npm run build
npm run start
```

### Docker Production Deployment
```bash
# Build all services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f
```

### Environment Variables for Production
- Change JWT_SECRET to a strong random string
- Update DATABASE_URL with production credentials
- Set NODE_ENV=production
- Configure proper CORS origins
- Use strong database passwords
- Enable SSL/TLS for database connections

## Database Backup

```bash
# Backup database
docker exec school-management-postgres pg_dump -U school_admin school_db > backup.sql

# Restore database
docker exec -i school-management-postgres psql -U school_admin school_db < backup.sql
```

## Performance Optimization

### Backend Optimization
- Redis caching for frequently accessed data
- Database connection pooling
- Query optimization with proper indexes
- Response compression

### Frontend Optimization
- Next.js automatic code splitting
- Image optimization
- Static generation where possible
- Lazy loading for heavy components

## Monitoring and Logging

### Backend Logging
The NestJS backend includes built-in logging:
```typescript
// Logs are automatically generated for:
- HTTP requests
- Database queries
- Error handling
- Authentication attempts
```

### Database Monitoring
Access pgAdmin at `http://localhost:5050`:
- Monitor query performance
- View active connections
- Analyze slow queries

## API Testing

Use the included REST client or tools like Postman:

```bash
# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"Admin@123"}'

# Get students (requires JWT token)
curl -X GET http://localhost:3001/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Support and Maintenance

### Regular Maintenance Tasks
1. Database backups (daily recommended)
2. Log rotation and cleanup
3. Security updates for dependencies
4. Performance monitoring
5. User access review

### Updating Dependencies
```bash
# Frontend
npm update

# Backend
cd backend
npm update
```

## Additional Resources

- NestJS Documentation: https://docs.nestjs.com
- Next.js Documentation: https://nextjs.org/docs
- PostgreSQL Documentation: https://www.postgresql.org/docs
- Docker Documentation: https://docs.docker.com

## License

This project is for educational purposes. Modify and use according to your university requirements.
