# School Management System - API Documentation

Complete API reference for the school management system backend.

## Base URL
```
http://localhost:3001
```

## Authentication

All API endpoints except `/auth/login` and `/auth/register` require JWT authentication.

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### POST /auth/login
Login to the system

**Request Body:**
```json
{
  "email": "admin@school.com",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@school.com",
      "role": "admin",
      "firstName": "System",
      "lastName": "Administrator"
    }
  }
}
```

### POST /auth/register
Register a new user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "role": "teacher",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

## Students API

### GET /students
Get all students

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or student ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "studentId": "STU001",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@example.com",
      "dateOfBirth": "2008-05-15",
      "gender": "male",
      "gradeLevel": 9,
      "enrollmentDate": "2023-09-01"
    }
  ]
}
```

### GET /students/:id
Get student by ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "studentId": "STU001",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "dateOfBirth": "2008-05-15",
    "gender": "male",
    "gradeLevel": 9,
    "address": "123 Main St, City",
    "parentName": "Jane Smith",
    "parentPhone": "+1234567890",
    "parentEmail": "jane.smith@example.com"
  }
}
```

### POST /students
Create new student

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Smith",
  "studentId": "STU001",
  "dateOfBirth": "2008-05-15",
  "gender": "male",
  "gradeLevel": 9,
  "address": "123 Main St, City",
  "parentName": "Jane Smith",
  "parentPhone": "+1234567890",
  "parentEmail": "jane.smith@example.com"
}
```

## Attendance API

### POST /attendance
Mark single student attendance

**Request Body:**
```json
{
  "studentId": 1,
  "classId": 1,
  "attendanceDate": "2024-03-20",
  "status": "present",
  "remarks": "On time"
}
```

**Status values:** `present`, `absent`, `late`, `excused`

### POST /attendance/bulk
Mark attendance for multiple students

**Request Body:**
```json
{
  "classId": 1,
  "date": "2024-03-20",
  "records": [
    {
      "studentId": 1,
      "status": "present",
      "remarks": ""
    },
    {
      "studentId": 2,
      "status": "absent",
      "remarks": "Sick leave"
    }
  ]
}
```

### GET /attendance/student/:studentId
Get student attendance history

**Query Parameters:**
- `startDate` (optional): Filter from date (YYYY-MM-DD)
- `endDate` (optional): Filter to date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "attendanceDate": "2024-03-20",
      "status": "present",
      "className": "Grade 9-A",
      "remarks": null
    }
  ]
}
```

### GET /attendance/statistics/:studentId
Get attendance statistics for a student

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDays": 150,
    "presentDays": 142,
    "absentDays": 5,
    "lateDays": 3,
    "excusedDays": 0,
    "attendancePercentage": 94.67
  }
}
```

## Exams API

### POST /exams
Create a new exam

**Request Body:**
```json
{
  "examName": "Mid-term Mathematics",
  "examType": "midterm",
  "subjectId": 1,
  "classId": 1,
  "examDate": "2024-03-15",
  "totalMarks": 100,
  "durationMinutes": 120,
  "description": "Mid-term exam covering chapters 1-5"
}
```

**Exam Types:** `midterm`, `final`, `quiz`, `assignment`, `project`

### GET /exams
Get all exams

**Query Parameters:**
- `classId` (optional): Filter by class
- `subjectId` (optional): Filter by subject
- `examType` (optional): Filter by exam type

### POST /exams/:id/results
Submit exam result for a student

**Request Body:**
```json
{
  "studentId": 1,
  "marksObtained": 85,
  "gradeLetter": "A",
  "remarks": "Excellent performance"
}
```

### GET /exams/student/:studentId/results
Get all results for a student

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "examName": "Mid-term Mathematics",
      "examType": "midterm",
      "subjectName": "Mathematics",
      "className": "Grade 9-A",
      "marksObtained": 85,
      "totalMarks": 100,
      "gradeLetter": "A",
      "examDate": "2024-03-15"
    }
  ]
}
```

## Timetable API

### POST /timetable
Create timetable entry

**Request Body:**
```json
{
  "classId": 1,
  "subjectId": 1,
  "teacherId": 1,
  "dayOfWeek": "Monday",
  "startTime": "09:00",
  "endTime": "10:00",
  "roomNumber": "101"
}
```

### GET /timetable/class/:classId
Get timetable for a class

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "dayOfWeek": "Monday",
      "startTime": "09:00:00",
      "endTime": "10:00:00",
      "subjectName": "Mathematics",
      "teacherFirstName": "John",
      "teacherLastName": "Doe",
      "roomNumber": "101"
    }
  ]
}
```

## Announcements API

### POST /announcements
Create announcement

**Request Body:**
```json
{
  "title": "Mid-term Exams Schedule",
  "content": "Mid-term examinations will be conducted from March 15 to March 25.",
  "announcementType": "academic",
  "targetAudience": "students",
  "postedBy": 1,
  "priority": "high",
  "expiresAt": "2024-03-25T23:59:59Z"
}
```

**Announcement Types:** `general`, `academic`, `event`, `urgent`, `holiday`
**Target Audience:** `all`, `students`, `teachers`, `parents`
**Priority:** `low`, `medium`, `high`

### GET /announcements
Get all active announcements

**Query Parameters:**
- `type` (optional): Filter by announcement type
- `audience` (optional): Filter by target audience

## Fees API

### POST /fees/payment
Record a fee payment

**Request Body:**
```json
{
  "studentId": 1,
  "feeStructureId": 1,
  "amountPaid": 15000,
  "paymentDate": "2024-03-20",
  "paymentMethod": "bank_transfer",
  "transactionId": "TXN123456",
  "remarks": "Full tuition fee payment"
}
```

**Payment Methods:** `cash`, `card`, `bank_transfer`, `online`, `check`

### GET /fees/student/:studentId
Get fee structure and balances for a student

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "feeType": "Tuition Fee",
      "amount": 15000,
      "totalPaid": 15000,
      "balance": 0,
      "dueDate": "2024-04-30",
      "academicYear": "2024-2025"
    }
  ]
}
```

### GET /fees/student/:studentId/payments
Get payment history for a student

## Library API

### GET /library/books
Get all books

**Query Parameters:**
- `search` (optional): Search by title, author, or ISBN
- `category` (optional): Filter by category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee",
      "isbn": "978-0061120084",
      "category": "Fiction",
      "totalCopies": 5,
      "availableCopies": 3,
      "publishedYear": 1960
    }
  ]
}
```

### POST /library/issue
Issue a book to a student

**Request Body:**
```json
{
  "bookId": 1,
  "studentId": 1,
  "dueDate": "2024-04-05"
}
```

### PUT /library/return/:issueId
Return a book

**Request Body:**
```json
{
  "fineAmount": 0
}
```

### GET /library/student/:studentId/issues
Get book issue history for a student

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee",
      "issueDate": "2024-03-20",
      "dueDate": "2024-04-05",
      "returnDate": null,
      "status": "issued",
      "fineAmount": 0
    }
  ]
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests (Rate Limit)
- `500` - Internal Server Error

## Rate Limits

The API implements multi-tier rate limiting:
- **Short-term:** 3 requests per second
- **Medium-term:** 20 requests per 10 seconds
- **Long-term:** 100 requests per minute

Exceeding these limits will result in a `429 Too Many Requests` response.
