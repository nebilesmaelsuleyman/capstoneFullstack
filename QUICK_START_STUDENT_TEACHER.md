# Quick Start Guide - Student & Teacher Dashboards

This guide will help you quickly set up and test the student and teacher dashboard features.

## Prerequisites

✅ Backend server running on `http://localhost:3001`  
✅ Frontend server running on `http://localhost:3000`  
✅ PostgreSQL database initialized with `init.sql`

## Step 1: Load Sample Data

Load the sample data to test the dashboards:

```bash
cd backend
psql -U postgres -d school_management -f sample-student-teacher-data.sql
```

This will create:
- 2 Teachers (John Smith, Mary Johnson)
- 3 Students (Alice Brown, Bob Wilson, Carol Davis)
- 2 Classes (Grade 10 - Section A & B)
- Multiple grades and attendance records

## Step 2: Test Accounts

### Sample Teacher Account
- **Email**: `john.smith@school.com`
- **Password**: (default password from hash)
- **Employee ID**: EMP-001
- **Department**: Mathematics
- **Teacher ID**: Check database after running sample data

### Sample Student Account
- **Email**: `alice.brown@school.com`
- **Password**: (default password from hash)
- **Student ID**: STU-001
- **Grade Level**: 10
- **Student ID (database)**: Check database after running sample data

## Step 3: Access Dashboards

### Student Dashboard
1. Navigate to: `http://localhost:3000/student/dashboard`
2. The page will load with student ID = 1 (hardcoded for now)
3. You should see:
   - Overview statistics
   - Grades tab with subject grades
   - Classes tab with enrolled classes
   - Attendance tab with attendance records

### Teacher Dashboard
1. Navigate to: `http://localhost:3000/teacher/dashboard`
2. The page will load with teacher ID = 1 (hardcoded for now)
3. You should see:
   - Overview statistics
   - My Classes tab with assigned classes
   - Manage Grades tab with grade creation
   - Profile tab with teacher information

## Step 4: Test Features

### For Students:

#### View Grades
1. Go to "Grades" tab
2. You should see grades for:
   - Mathematics (85.5%)
   - English (92%)
   - Science (78%)
   - And more...

#### View Classes
1. Go to "Classes" tab
2. You should see enrolled class:
   - Grade 10 - Section A
   - Teacher: John Smith
   - Room: 101

#### View Attendance
1. Go to "Attendance" tab
2. You should see attendance records with statuses:
   - Present (green)
   - Absent (red)
   - Late (yellow)
   - Excused (blue)

### For Teachers:

#### View Classes
1. Go to "My Classes" tab
2. You should see assigned classes with student counts

#### Create a Grade
1. Go to "Manage Grades" tab
2. Click "Add Grade" button
3. Fill in the form:
   ```
   Student ID: 1
   Class: Select "Grade 10 - Section A"
   Subject ID: 1
   Exam Type: Select "quiz"
   Grade: 95
   Max Grade: 100
   Exam Date: Select today's date
   Remarks: "Excellent work!"
   ```
4. Click "Add Grade"
5. The grade should be created successfully

#### View Class Grades
1. In "Manage Grades" tab
2. Select a class from dropdown
3. Enter subject ID (e.g., 1 for Mathematics)
4. View all student grades for that class and subject

#### View Profile
1. Go to "Profile" tab
2. View your teacher information:
   - Name, Email
   - Employee ID
   - Department
   - Specialization
   - Qualification

## Step 5: Verify Backend Endpoints

You can test the backend endpoints directly using curl or Postman:

### Get Student Grades
```bash
curl -X GET http://localhost:3001/grades/student/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Student Classes
```bash
curl -X GET http://localhost:3001/classes/student/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Teacher Classes
```bash
curl -X GET http://localhost:3001/classes/teacher/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Grade
```bash
curl -X POST http://localhost:3001/grades \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "student_id": 1,
    "subject_id": 1,
    "class_id": 1,
    "exam_type": "quiz",
    "grade": 95,
    "max_grade": 100,
    "exam_date": "2024-03-25",
    "remarks": "Excellent work"
  }'
```

## Troubleshooting

### Issue: No data showing on dashboard

**Solution:**
1. Check if sample data was loaded:
   ```sql
   SELECT COUNT(*) FROM students;
   SELECT COUNT(*) FROM teachers;
   SELECT COUNT(*) FROM grades;
   ```
2. Verify the IDs in the database match the hardcoded IDs in the frontend
3. Check browser console for errors

### Issue: 401 Unauthorized

**Solution:**
1. Make sure you're logged in
2. Check if JWT token exists in localStorage:
   ```javascript
   console.log(localStorage.getItem('token'))
   ```
3. If no token, you need to implement login first

### Issue: Backend not responding

**Solution:**
1. Check if backend is running:
   ```bash
   curl http://localhost:3001/
   ```
2. Check backend logs for errors
3. Restart backend:
   ```bash
   cd backend
   npm run start:dev
   ```

### Issue: Frontend not loading

**Solution:**
1. Check if frontend is running:
   ```bash
   curl http://localhost:3000/
   ```
2. Check for build errors in terminal
3. Restart frontend:
   ```bash
   npm run dev
   ```

## Database Queries for Testing

### Get Student ID
```sql
SELECT s.id, s.student_id, u.first_name, u.last_name 
FROM students s 
JOIN users u ON s.user_id = u.id;
```

### Get Teacher ID
```sql
SELECT t.id, t.employee_id, u.first_name, u.last_name 
FROM teachers t 
JOIN users u ON t.user_id = u.id;
```

### Get All Grades for Student
```sql
SELECT g.*, s.subject_name, c.class_name 
FROM grades g
JOIN subjects s ON g.subject_id = s.id
LEFT JOIN classes c ON g.class_id = c.id
WHERE g.student_id = 1;
```

### Get All Classes for Teacher
```sql
SELECT c.*, COUNT(sc.student_id) as student_count
FROM classes c
LEFT JOIN student_classes sc ON c.id = sc.class_id
WHERE c.teacher_id = 1
GROUP BY c.id;
```

## Next Steps

### Integration with Authentication
Currently, the dashboards use hardcoded IDs. To integrate with authentication:

1. Create an auth context:
   ```typescript
   // contexts/AuthContext.tsx
   const AuthContext = createContext({
     user: null,
     userId: null,
     role: null
   })
   ```

2. Update dashboards to use auth context:
   ```typescript
   const { userId, role } = useAuth()
   if (role === 'student') {
     fetchStudentData(userId)
   }
   ```

### Add Navigation Links
Add links to the main navigation:

```typescript
// In dashboard-nav.tsx or main menu
{ name: "Student Dashboard", href: "/student/dashboard", icon: User },
{ name: "Teacher Dashboard", href: "/teacher/dashboard", icon: GraduationCap },
```

### Enhance Features
- Add grade editing
- Add grade deletion
- Add student search in grade creation
- Add subject dropdown
- Add attendance marking for teachers
- Add charts and analytics

## Support

For issues or questions:
1. Check the `STUDENT_TEACHER_IMPLEMENTATION.md` for detailed documentation
2. Check the `STUDENT_TEACHER_API.md` for API reference
3. Review the backend logs for errors
4. Check the browser console for frontend errors

## Summary

You now have:
- ✅ Fully functional student dashboard
- ✅ Fully functional teacher dashboard
- ✅ Backend API endpoints
- ✅ Sample data for testing
- ✅ Complete documentation

Happy testing! 🎉
