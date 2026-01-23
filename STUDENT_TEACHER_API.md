# Student and Teacher Dashboard API Documentation

This document describes the API endpoints used by the student and teacher dashboards.

## Student Endpoints

### Get Student Grades
```
GET /grades/student/:id
```
Returns all grades for a specific student.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "student_id": 1,
      "subject_id": 1,
      "subject_name": "Mathematics",
      "subject_code": "MATH101",
      "class_id": 1,
      "class_name": "Grade 10 - A",
      "class_code": "G10-A",
      "exam_type": "midterm",
      "grade": 85.5,
      "max_grade": 100,
      "exam_date": "2024-03-15",
      "remarks": "Good performance",
      "created_at": "2024-03-16T10:00:00Z"
    }
  ]
}
```

### Get Student Classes
```
GET /classes/student/:studentId
```
Returns all classes a student is enrolled in.

**Response:**
```json
[
  {
    "id": 1,
    "class_name": "Grade 10 - Section A",
    "class_code": "G10-A",
    "grade_level": 10,
    "section": "A",
    "teacher_name": "John Doe",
    "room_number": "101",
    "enrollment_date": "2024-01-15",
    "enrollment_status": "active"
  }
]
```

### Get Student Attendance
```
GET /attendance/student/:studentId?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```
Returns attendance records for a student.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "student_id": 1,
      "class_id": 1,
      "class_name": "Grade 10 - A",
      "attendance_date": "2024-03-15",
      "status": "present",
      "remarks": null
    }
  ]
}
```

### Get Attendance Statistics
```
GET /attendance/statistics/:studentId
```
Returns attendance statistics for a student.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 100,
    "present": 92,
    "absent": 5,
    "late": 2,
    "excused": 1,
    "percentage": 92.0
  }
}
```

## Teacher Endpoints

### Get Teacher Profile
```
GET /teachers/:id
```
Returns teacher profile information.

**Response:**
```json
{
  "id": 1,
  "userId": 2,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@school.com",
  "phone": "+1234567890",
  "employeeId": "EMP-001",
  "department": "Mathematics",
  "subjects": "Mathematics, Physics",
  "qualification": "M.Sc. Mathematics",
  "dateOfBirth": "1985-05-15",
  "status": true
}
```

### Get Teacher Classes
```
GET /classes/teacher/:teacherId
```
Returns all classes assigned to a teacher.

**Response:**
```json
[
  {
    "id": 1,
    "class_name": "Grade 10 - Section A",
    "class_code": "G10-A",
    "grade_level": 10,
    "section": "A",
    "room_number": "101",
    "student_count": 30
  }
]
```

### Get Grades by Class and Subject
```
GET /grades/class/:classId/subject/:subjectId
```
Returns all grades for a specific class and subject.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "student_id": 1,
      "student_number": "STU-001",
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@school.com",
      "exam_type": "midterm",
      "grade": 85.5,
      "max_grade": 100,
      "exam_date": "2024-03-15",
      "remarks": "Good performance"
    }
  ]
}
```

### Create Grade
```
POST /grades
```
Creates a new grade record.

**Request Body:**
```json
{
  "student_id": 1,
  "subject_id": 1,
  "class_id": 1,
  "exam_type": "midterm",
  "grade": 85.5,
  "max_grade": 100,
  "exam_date": "2024-03-15",
  "remarks": "Good performance"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "student_id": 1,
    "subject_id": 1,
    "class_id": 1,
    "exam_type": "midterm",
    "grade": 85.5,
    "max_grade": 100,
    "exam_date": "2024-03-15",
    "remarks": "Good performance",
    "created_at": "2024-03-16T10:00:00Z"
  }
}
```

### Update Grade
```
PUT /grades/:id
```
Updates an existing grade record.

**Request Body:**
```json
{
  "grade": 90.0,
  "remarks": "Excellent improvement"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "student_id": 1,
    "subject_id": 1,
    "class_id": 1,
    "exam_type": "midterm",
    "grade": 90.0,
    "max_grade": 100,
    "exam_date": "2024-03-15",
    "remarks": "Excellent improvement"
  }
}
```

## Common Headers

All authenticated endpoints require the following header:
```
Authorization: Bearer <token>
```

## Error Responses

All endpoints may return error responses in the following format:
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

## Frontend Routes

- Student Dashboard: `/student/dashboard`
- Teacher Dashboard: `/teacher/dashboard`
