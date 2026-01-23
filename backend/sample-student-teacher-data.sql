-- Sample data for testing Student and Teacher Dashboards
-- Run this after init.sql to populate test data

-- Create sample teacher users
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('john.smith@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'teacher', 'John', 'Smith', '+1234567890', true),
('mary.johnson@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'teacher', 'Mary', 'Johnson', '+1234567891', true);

-- Create sample student users
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('alice.brown@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'student', 'Alice', 'Brown', '+1234567892', true),
('bob.wilson@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'student', 'Bob', 'Wilson', '+1234567893', true),
('carol.davis@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'student', 'Carol', 'Davis', '+1234567894', true);

-- Create teacher records
INSERT INTO teachers (user_id, employee_id, date_of_birth, gender, department, specialization, qualification, hire_date) VALUES
((SELECT id FROM users WHERE email = 'john.smith@school.com'), 'EMP-001', '1985-05-15', 'Male', 'Mathematics', 'Mathematics, Physics', 'M.Sc. Mathematics', '2020-01-15'),
((SELECT id FROM users WHERE email = 'mary.johnson@school.com'), 'EMP-002', '1988-08-20', 'Female', 'English', 'English Literature', 'M.A. English', '2019-08-01');

-- Create student records
INSERT INTO students (user_id, student_id, date_of_birth, gender, grade_level, parent_name, parent_phone, parent_email, enrollment_date) VALUES
((SELECT id FROM users WHERE email = 'alice.brown@school.com'), 'STU-001', '2008-03-10', 'Female', 10, 'Robert Brown', '+1234567895', 'robert.brown@email.com', '2023-09-01'),
((SELECT id FROM users WHERE email = 'bob.wilson@school.com'), 'STU-002', '2008-07-22', 'Male', 10, 'Sarah Wilson', '+1234567896', 'sarah.wilson@email.com', '2023-09-01'),
((SELECT id FROM users WHERE email = 'carol.davis@school.com'), 'STU-003', '2008-11-05', 'Female', 10, 'Michael Davis', '+1234567897', 'michael.davis@email.com', '2023-09-01');

-- Create sample classes
INSERT INTO classes (class_name, class_code, grade_level, section, teacher_id, room_number, capacity, academic_year) VALUES
('Grade 10 - Section A', 'G10-A', 10, 'A', (SELECT id FROM teachers WHERE employee_id = 'EMP-001'), '101', 30, '2024-2025'),
('Grade 10 - Section B', 'G10-B', 10, 'B', (SELECT id FROM teachers WHERE employee_id = 'EMP-002'), '102', 30, '2024-2025');

-- Enroll students in classes
INSERT INTO student_classes (student_id, class_id, enrollment_date, status) VALUES
((SELECT id FROM students WHERE student_id = 'STU-001'), (SELECT id FROM classes WHERE class_code = 'G10-A'), '2023-09-01', 'active'),
((SELECT id FROM students WHERE student_id = 'STU-002'), (SELECT id FROM classes WHERE class_code = 'G10-A'), '2023-09-01', 'active'),
((SELECT id FROM students WHERE student_id = 'STU-003'), (SELECT id FROM classes WHERE class_code = 'G10-B'), '2023-09-01', 'active');

-- Create sample grades for students
INSERT INTO grades (student_id, subject_id, class_id, exam_type, grade, max_grade, exam_date, remarks) VALUES
-- Alice's grades
((SELECT id FROM students WHERE student_id = 'STU-001'), 1, (SELECT id FROM classes WHERE class_code = 'G10-A'), 'midterm', 85.5, 100, '2024-03-15', 'Good performance'),
((SELECT id FROM students WHERE student_id = 'STU-001'), 2, (SELECT id FROM classes WHERE class_code = 'G10-A'), 'midterm', 92.0, 100, '2024-03-16', 'Excellent work'),
((SELECT id FROM students WHERE student_id = 'STU-001'), 3, (SELECT id FROM classes WHERE class_code = 'G10-A'), 'quiz', 78.0, 100, '2024-03-10', 'Needs improvement'),
((SELECT id FROM students WHERE student_id = 'STU-001'), 1, (SELECT id FROM classes WHERE class_code = 'G10-A'), 'assignment', 88.0, 100, '2024-03-20', 'Well done'),

-- Bob's grades
((SELECT id FROM students WHERE student_id = 'STU-002'), 1, (SELECT id FROM classes WHERE class_code = 'G10-A'), 'midterm', 75.0, 100, '2024-03-15', 'Satisfactory'),
((SELECT id FROM students WHERE student_id = 'STU-002'), 2, (SELECT id FROM classes WHERE class_code = 'G10-A'), 'midterm', 82.5, 100, '2024-03-16', 'Good effort'),
((SELECT id FROM students WHERE student_id = 'STU-002'), 3, (SELECT id FROM classes WHERE class_code = 'G10-A'), 'quiz', 90.0, 100, '2024-03-10', 'Excellent'),

-- Carol's grades
((SELECT id FROM students WHERE student_id = 'STU-003'), 2, (SELECT id FROM classes WHERE class_code = 'G10-B'), 'midterm', 95.0, 100, '2024-03-16', 'Outstanding performance'),
((SELECT id FROM students WHERE student_id = 'STU-003'), 3, (SELECT id FROM classes WHERE class_code = 'G10-B'), 'quiz', 88.5, 100, '2024-03-10', 'Very good');

-- Create sample attendance records
INSERT INTO attendance (student_id, class_id, attendance_date, status, remarks) VALUES
-- Alice's attendance
((SELECT id FROM students WHERE student_id = 'STU-001'), (SELECT id FROM classes WHERE class_code = 'G10-A'), '2024-03-01', 'present', NULL),
((SELECT id FROM students WHERE student_id = 'STU-001'), (SELECT id FROM classes WHERE class_code = 'G10-A'), '2024-03-02', 'present', NULL),
((SELECT id FROM students WHERE student_id = 'STU-001'), (SELECT id FROM classes WHERE class_code = 'G10-A'), '2024-03-03', 'absent', 'Sick'),
((SELECT id FROM students WHERE student_id = 'STU-001'), (SELECT id FROM classes WHERE class_code = 'G10-A'), '2024-03-04', 'present', NULL),
((SELECT id FROM students WHERE student_id = 'STU-001'), (SELECT id FROM classes WHERE class_code = 'G10-A'), '2024-03-05', 'present', NULL),
((SELECT id FROM students WHERE student_id = 'STU-001'), (SELECT id FROM classes WHERE class_code = 'G10-A'), '2024-03-06', 'late', 'Traffic'),
((SELECT id FROM students WHERE student_id = 'STU-001'), (SELECT id FROM classes WHERE class_code = 'G10-A'), '2024-03-07', 'present', NULL),
((SELECT id FROM students WHERE student_id = 'STU-001'), (SELECT id FROM classes WHERE class_code = 'G10-A'), '2024-03-08', 'present', NULL),

-- Bob's attendance
((SELECT id FROM students WHERE student_id = 'STU-002'), (SELECT id FROM classes WHERE class_code = 'G10-A'), '2024-03-01', 'present', NULL),
((SELECT id FROM students WHERE student_id = 'STU-002'), (SELECT id FROM classes WHERE class_code = 'G10-A'), '2024-03-02', 'present', NULL),
((SELECT id FROM students WHERE student_id = 'STU-002'), (SELECT id FROM classes WHERE class_code = 'G10-A'), '2024-03-03', 'present', NULL),
((SELECT id FROM students WHERE student_id = 'STU-002'), (SELECT id FROM classes WHERE class_code = 'G10-A'), '2024-03-04', 'excused', 'Medical appointment'),
((SELECT id FROM students WHERE student_id = 'STU-002'), (SELECT id FROM classes WHERE class_code = 'G10-A'), '2024-03-05', 'present', NULL),

-- Carol's attendance
((SELECT id FROM students WHERE student_id = 'STU-003'), (SELECT id FROM classes WHERE class_code = 'G10-B'), '2024-03-01', 'present', NULL),
((SELECT id FROM students WHERE student_id = 'STU-003'), (SELECT id FROM classes WHERE class_code = 'G10-B'), '2024-03-02', 'present', NULL),
((SELECT id FROM students WHERE student_id = 'STU-003'), (SELECT id FROM classes WHERE class_code = 'G10-B'), '2024-03-03', 'present', NULL),
((SELECT id FROM students WHERE student_id = 'STU-003'), (SELECT id FROM classes WHERE class_code = 'G10-B'), '2024-03-04', 'present', NULL),
((SELECT id FROM students WHERE student_id = 'STU-003'), (SELECT id FROM classes WHERE class_code = 'G10-B'), '2024-03-05', 'present', NULL);

-- Display summary
SELECT 'Sample data created successfully!' as message;
SELECT 'Teachers created: ' || COUNT(*) as summary FROM teachers;
SELECT 'Students created: ' || COUNT(*) as summary FROM students;
SELECT 'Classes created: ' || COUNT(*) as summary FROM classes;
SELECT 'Grades created: ' || COUNT(*) as summary FROM grades;
SELECT 'Attendance records created: ' || COUNT(*) as summary FROM attendance;
