-- Seeding new teacher and student with password '123456789'
-- Hash for '123456789': $2b$10$H8ZPIOaE5lihfSJHLNYqO.9N4iRz0J3RmBWTlxQV8RZJPr7edB.Ey

BEGIN;

-- 1. Create New Users
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) 
VALUES ('newteacher@school.com', '$2b$10$H8ZPIOaE5lihfSJHLNYqO.9N4iRz0J3RmBWTlxQV8RZJPr7edB.Ey', 'teacher', 'David', 'Miller', '+9876543210', true);

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) 
VALUES ('newstudent@school.com', '$2b$10$H8ZPIOaE5lihfSJHLNYqO.9N4iRz0J3RmBWTlxQV8RZJPr7edB.Ey', 'student', 'Emily', 'Clark', '+9876543211', true);

-- 2. Create Teacher and Student records
INSERT INTO teachers (user_id, employee_id, date_of_birth, gender, department, specialization, qualification, hire_date) 
VALUES ((SELECT id FROM users WHERE email = 'newteacher@school.com'), 'EMP-999', '1990-12-10', 'Male', 'Science', 'Chemistry, Biology', 'Ph.D. Chemistry', '2023-01-01');

INSERT INTO students (user_id, student_id, date_of_birth, gender, grade_level, parent_name, parent_phone, parent_email, enrollment_date) 
VALUES ((SELECT id FROM users WHERE email = 'newstudent@school.com'), 'STU-999', '2010-05-20', 'Female', 9, 'Sarah Clark', '+9876543212', 'sarah.clark@email.com', '2024-01-01');

-- 3. Ensure some subjects exist for them
INSERT INTO subjects (subject_name, subject_code, description, credits) 
SELECT 'Advanced Chemistry', 'CHEM201', 'Advanced Chemistry for Grade 9', 4
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE subject_code = 'CHEM201');

INSERT INTO subjects (subject_name, subject_code, description, credits) 
SELECT 'Biology Basics', 'BIO101', 'Introductory Biology', 3
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE subject_code = 'BIO101');

-- 4. Create a Class for the new student/teacher
INSERT INTO classes (class_name, class_code, grade_level, section, teacher_id, room_number, capacity, academic_year) 
VALUES ('Grade 9 - Advanced', 'G9-ADV', 9, 'A', (SELECT id FROM teachers WHERE employee_id = 'EMP-999'), '303', 25, '2024-2025');

-- 5. Link Subjects to the new Class
INSERT INTO class_subjects (class_id, subject_id, teacher_id, schedule_day, schedule_time) VALUES
((SELECT id FROM classes WHERE class_code = 'G9-ADV'), (SELECT id FROM subjects WHERE subject_code = 'CHEM201'), (SELECT id FROM teachers WHERE employee_id = 'EMP-999'), 'Monday', '08:00-09:30'),
((SELECT id FROM classes WHERE class_code = 'G9-ADV'), (SELECT id FROM subjects WHERE subject_code = 'BIO101'), (SELECT id FROM teachers WHERE employee_id = 'EMP-999'), 'Wednesday', '10:00-11:30');

-- 6. Enroll New Student in New Class
INSERT INTO student_classes (student_id, class_id, enrollment_date, status) VALUES
((SELECT id FROM students WHERE student_id = 'STU-999'), (SELECT id FROM classes WHERE class_code = 'G9-ADV'), '2024-01-01', 'active');

-- 7. Populate Timetable for the new student/teacher
INSERT INTO timetable (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room_number) VALUES
((SELECT id FROM classes WHERE class_code = 'G9-ADV'), (SELECT id FROM subjects WHERE subject_code = 'CHEM201'), (SELECT id FROM teachers WHERE employee_id = 'EMP-999'), 'Monday', '08:00:00', '09:00:00', '303'),
((SELECT id FROM classes WHERE class_code = 'G9-ADV'), (SELECT id FROM subjects WHERE subject_code = 'BIO101'), (SELECT id FROM teachers WHERE employee_id = 'EMP-999'), 'Wednesday', '10:00:00', '11:00:00', '303'),
((SELECT id FROM classes WHERE class_code = 'G9-ADV'), (SELECT id FROM subjects WHERE subject_code = 'MATH101'), (SELECT id FROM teachers WHERE employee_id = 'EMP-999'), 'Friday', '09:00:00', '10:00:00', '303');

-- 8. Add Attendance for the new student
INSERT INTO attendance (student_id, class_id, attendance_date, status, remarks) VALUES
((SELECT id FROM students WHERE student_id = 'STU-999'), (SELECT id FROM classes WHERE class_code = 'G9-ADV'), CURRENT_DATE - INTERVAL '1 day', 'present', 'On time'),
((SELECT id FROM students WHERE student_id = 'STU-999'), (SELECT id FROM classes WHERE class_code = 'G9-ADV'), CURRENT_DATE - INTERVAL '2 days', 'present', 'Excellent'),
((SELECT id FROM students WHERE student_id = 'STU-999'), (SELECT id FROM classes WHERE class_code = 'G9-ADV'), CURRENT_DATE - INTERVAL '3 days', 'present', NULL);

-- 9. Add Grades for the new student
INSERT INTO grades (student_id, subject_id, class_id, exam_type, grade, max_grade, exam_date, remarks) VALUES
((SELECT id FROM students WHERE student_id = 'STU-999'), (SELECT id FROM subjects WHERE subject_code = 'CHEM201'), (SELECT id FROM classes WHERE class_code = 'G9-ADV'), 'midterm', 94.0, 100, CURRENT_DATE - INTERVAL '2 weeks', 'Top of the class'),
((SELECT id FROM students WHERE student_id = 'STU-999'), (SELECT id FROM subjects WHERE subject_code = 'BIO101'), (SELECT id FROM classes WHERE class_code = 'G9-ADV'), 'midterm', 89.5, 100, CURRENT_DATE - INTERVAL '2 weeks', 'Very thorough'),
((SELECT id FROM students WHERE student_id = 'STU-999'), (SELECT id FROM subjects WHERE subject_code = 'MATH101'), (SELECT id FROM classes WHERE class_code = 'G9-ADV'), 'quiz', 91.0, 100, CURRENT_DATE - INTERVAL '1 week', 'Good logic');

-- 10. Add Announcements for them
INSERT INTO announcements (title, content, announcement_type, target_audience, posted_by, priority, posted_at) VALUES
('Welcome Emily and David!', 'A warm welcome to our new student Emily Clark and teacher David Miller.', 'general', 'all', (SELECT id FROM users WHERE role = 'admin' LIMIT 1), 'high', NOW());

-- 11. Add Library Record for student
INSERT INTO book_issues (book_id, student_id, issue_date, due_date, status) VALUES
((SELECT id FROM library_books LIMIT 1), (SELECT id FROM students WHERE student_id = 'STU-999'), CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE + INTERVAL '10 days', 'issued');

COMMIT;
