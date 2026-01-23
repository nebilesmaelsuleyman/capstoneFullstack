# 🧪 Quick Testing Guide - Attendance & Exams

## 🚀 Prerequisites

1. **Backend Running**: `npm run start:dev` in `/backend`
2. **Frontend Running**: `npm run dev` in root
3. **Database**: PostgreSQL with schema from `init.sql`
4. **Authentication**: Login as admin user

---

## 📋 Testing Attendance Management

### **Step 1: Navigate to Page**
```
http://localhost:3000/admin/attendance
```

### **Step 2: Select Class**
1. Click the "Class" dropdown
2. Select any class (e.g., "Grade 9 - Section A")
3. Students should load automatically

### **Step 3: Mark Attendance**
1. Click status buttons for each student:
   - **Present** → Green badge
   - **Absent** → Red badge
   - **Late** → Yellow badge
   - **Excused** → Blue badge
2. Watch stats update in real-time

### **Step 4: Save**
1. Click "Save Attendance" button
2. Wait for success toast notification
3. Refresh page to verify data persisted

### **Expected Results**
- ✅ Stats cards show correct counts
- ✅ Attendance percentage calculates correctly
- ✅ Status badges update immediately
- ✅ Save button shows loading spinner
- ✅ Success toast appears
- ✅ Data persists after refresh

### **API Calls to Verify**
```bash
# Check classes endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/classes

# Check attendance for class
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/attendance/class/1?date=2026-01-23"

# Save attendance (check network tab in browser)
```

---

## 📝 Testing Exams Management

### **Step 1: Navigate to Page**
```
http://localhost:3000/admin/exams
```

### **Step 2: View Existing Exams**
1. Check the "Exam Schedule" tab
2. Verify stats cards show correct numbers
3. Check if exams are displayed in table

### **Step 3: Create New Exam**
1. Click "Create Exam" button
2. Fill in the form:
   ```
   Exam Name: "Final Mathematics Exam"
   Exam Type: "final"
   Subject: Select from dropdown
   Class: Select from dropdown
   Date: "2026-02-15"
   Duration: "120"
   Total Marks: "100"
   Description: "Comprehensive final exam covering all topics"
   ```
3. Click "Create Exam"
4. Wait for success toast

### **Step 4: Verify Creation**
1. Check if new exam appears in table
2. Verify stats updated:
   - Total exams increased
   - Upcoming count increased (if future date)
3. Check exam details in table

### **Expected Results**
- ✅ Dialog opens smoothly
- ✅ Dropdowns populate with data
- ✅ Form validation works (try submitting empty)
- ✅ Create button shows loading spinner
- ✅ Success toast appears
- ✅ New exam appears in table
- ✅ Stats update automatically
- ✅ Dialog closes after creation

### **API Calls to Verify**
```bash
# Check classes endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/classes

# Check subjects endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/subjects

# Check exams endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/exams

# Create exam (check network tab in browser)
```

---

## 🔍 Common Issues & Solutions

### **Issue: "Failed to fetch classes"**
**Solution**: 
- Check backend is running on port 3001
- Verify JWT token in localStorage
- Check browser console for errors

### **Issue: "No students found in this class"**
**Solution**:
- Verify students are enrolled in the class
- Check `student_classes` table in database
- Ensure students have `status = 'active'`

### **Issue: "Failed to save attendance"**
**Solution**:
- Check network tab for error details
- Verify attendance endpoint is working
- Check database constraints

### **Issue: "Dropdowns are empty"**
**Solution**:
- Verify classes/subjects exist in database
- Check API endpoints return data
- Look for CORS errors in console

---

## 🗄️ Database Verification

### **Check Attendance Records**
```sql
-- View all attendance records
SELECT 
  a.*,
  u.first_name,
  u.last_name,
  c.class_name
FROM attendance a
JOIN students s ON a.student_id = s.id
JOIN users u ON s.user_id = u.id
JOIN classes c ON a.class_id = c.id
ORDER BY a.attendance_date DESC
LIMIT 10;
```

### **Check Exams**
```sql
-- View all exams
SELECT 
  e.*,
  s.subject_name,
  c.class_name
FROM exams e
JOIN subjects s ON e.subject_id = s.id
JOIN classes c ON e.class_id = c.id
ORDER BY e.exam_date DESC;
```

### **Check Student Enrollment**
```sql
-- View students in a class
SELECT 
  s.id,
  s.student_id,
  u.first_name,
  u.last_name,
  sc.status
FROM students s
JOIN users u ON s.user_id = u.id
JOIN student_classes sc ON s.id = sc.student_id
WHERE sc.class_id = 1 AND sc.status = 'active';
```

---

## 📊 Sample Test Data

### **Create Test Attendance**
```sql
-- Mark attendance for student 1 in class 1
INSERT INTO attendance (student_id, class_id, attendance_date, status, remarks)
VALUES (1, 1, '2026-01-23', 'present', 'On time')
ON CONFLICT (student_id, class_id, attendance_date)
DO UPDATE SET status = 'present', remarks = 'On time';
```

### **Create Test Exam**
```sql
-- Create a sample exam
INSERT INTO exams (
  exam_name, 
  exam_type, 
  subject_id, 
  class_id, 
  exam_date, 
  total_marks, 
  duration_minutes, 
  description
)
VALUES (
  'Mid-term Mathematics',
  'midterm',
  1,
  1,
  '2026-02-10',
  100,
  90,
  'Mid-term exam covering chapters 1-5'
);
```

---

## ✅ Testing Checklist

### **Attendance Page**
- [ ] Page loads without errors
- [ ] Classes dropdown populates
- [ ] Date picker works
- [ ] Students load when class selected
- [ ] Status buttons work
- [ ] Stats update in real-time
- [ ] Save button works
- [ ] Success toast appears
- [ ] Data persists after refresh
- [ ] Loading states show correctly
- [ ] Error handling works

### **Exams Page**
- [ ] Page loads without errors
- [ ] Stats cards show correct data
- [ ] Create button opens dialog
- [ ] Classes dropdown populates
- [ ] Subjects dropdown populates
- [ ] Exam type dropdown works
- [ ] Date picker works
- [ ] Form validation works
- [ ] Create button works
- [ ] Success toast appears
- [ ] New exam appears in table
- [ ] Stats update automatically
- [ ] Loading states show correctly
- [ ] Error handling works

---

## 🎯 Performance Testing

### **Load Test**
1. Create 50+ exams
2. Mark attendance for 100+ students
3. Verify page loads quickly
4. Check table scrolling is smooth

### **Network Test**
1. Open browser DevTools → Network tab
2. Perform actions
3. Verify:
   - API calls are efficient
   - No unnecessary requests
   - Proper caching headers
   - Response times < 500ms

---

## 🐛 Debugging Tips

### **Enable Detailed Logging**
```typescript
// In attendance/exams page
console.log('Classes:', classes)
console.log('Students:', students)
console.log('Exams:', exams)
```

### **Check Network Requests**
1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Check request/response for each API call
4. Verify status codes (200 = success)

### **Check Backend Logs**
```bash
# In backend terminal
# Watch for errors or warnings
# Verify SQL queries are correct
```

---

## 🎉 Success Criteria

Both pages are working correctly if:
- ✅ All API calls succeed (200 status)
- ✅ Data loads and displays correctly
- ✅ Forms submit successfully
- ✅ Database updates persist
- ✅ No console errors
- ✅ Loading states work
- ✅ Toast notifications appear
- ✅ UI is responsive
- ✅ Stats calculate correctly

---

**Ready to Test!** 🚀

Navigate to:
- **Attendance**: `http://localhost:3000/admin/attendance`
- **Exams**: `http://localhost:3000/admin/exams`
