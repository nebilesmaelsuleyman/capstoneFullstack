-- Reset standard IDs for testing
BEGIN;

-- TRUNCATE all relevant tables to ensure a clean state for testing
-- Cascading to handle dependencies
TRUNCATE TABLE users, students, teachers, classes, subjects, class_subjects, student_classes, grades, attendance, timetable, announcements RESTART IDENTITY CASCADE;

-- 1. Create Users
-- Teacher User (ID 1 will be assigned due to RESTART IDENTITY)
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) 
VALUES ('teacher@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'teacher', 'John', 'Smith', '+1234567890', true);

-- Student User (ID 2 will be assigned)
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) 
VALUES ('student@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'student', 'Alice', 'Brown', '+1234567891', true);

-- Admin User (ID 3 will be assigned)
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) 
VALUES ('admin@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'admin', 'System', 'Administrator', '+1234567892', true);

-- 2. Create Teacher and Student records
INSERT INTO teachers (user_id, employee_id, date_of_birth, gender, department, specialization, qualification, hire_date) 
VALUES (1, 'EMP-001', '1985-05-15', 'Male', 'Mathematics', 'Pure Math, Calculus', 'M.Sc. Mathematics', '2020-01-15');

INSERT INTO students (user_id, student_id, date_of_birth, gender, grade_level, parent_name, parent_phone, parent_email, enrollment_date) 
VALUES (2, 'STU-001', '2008-03-10', 'Female', 10, 'Robert Brown', '+1234567895', 'robert.brown@email.com', '2023-09-01');

-- 3. Create Subjects
INSERT INTO subjects (subject_name, subject_code, description, credits) VALUES
('Mathematics', 'MATH101', 'Advanced Mathematics', 4),
('English Literature', 'ENG101', 'Classic English Literature', 3),
('Physics', 'PHY101', 'General Physics', 4),
('Computer Science', 'CS101', 'Introduction to Programming', 3);

-- 4. Create Classes
INSERT INTO classes (class_name, class_code, grade_level, section, teacher_id, room_number, capacity, academic_year) VALUES
('Grade 10 - Section A', 'G10-A', 10, 'A', 1, '101', 30, '2024-2025'),
('Grade 10 - Section B', 'G10-B', 10, 'B', 1, '102', 30, '2024-2025');

-- 5. Link Subjects to Classes (Teacher assignments)
INSERT INTO class_subjects (class_id, subject_id, teacher_id, schedule_day, schedule_time) VALUES
(1, 1, 1, 'Monday', '08:00-09:00'),
(1, 2, 1, 'Monday', '09:00-10:00'),
(1, 3, 1, 'Tuesday', '08:00-09:00'),
(2, 1, 1, 'Tuesday', '09:00-10:00');

-- 6. Enroll Student in Class
INSERT INTO student_classes (student_id, class_id, enrollment_date, status) VALUES
(1, 1, '2023-09-01', 'active');

-- 7. Populate Timetable
-- Monday for Grade 10-A
INSERT INTO timetable (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room_number) VALUES
(1, 1, 1, 'Monday', '08:00:00', '09:00:00', '101'),
(1, 2, 1, 'Monday', '09:00:00', '10:00:00', '101'),
(1, 3, 1, 'Monday', '10:00:00', '11:00:00', '101');

-- Tuesday for Grade 10-A
INSERT INTO timetable (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room_number) VALUES
(1, 4, 1, 'Tuesday', '08:00:00', '09:00:00', '101'),
(1, 1, 1, 'Tuesday', '09:00:00', '10:00:00', '101');

-- Wednesday for Grade 10-A
INSERT INTO timetable (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room_number) VALUES
(1, 2, 1, 'Wednesday', '08:00:00', '09:00:00', '101'),
(1, 3, 1, 'Wednesday', '09:00:00', '10:00:00', '101');

-- Thursday for Grade 10-A
INSERT INTO timetable (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room_number) VALUES
(1, 1, 1, 'Thursday', '08:00:00', '09:00:00', '101'),
(1, 4, 1, 'Thursday', '09:00:00', '10:00:00', '101');

-- Friday for Grade 10-A
INSERT INTO timetable (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room_number) VALUES
(1, 3, 1, 'Friday', '08:00:00', '09:00:00', '101'),
(1, 2, 1, 'Friday', '09:00:00', '10:00:00', '101');

-- 8. Add Attendance for the student (ID 1)
INSERT INTO attendance (student_id, class_id, attendance_date, status, remarks) VALUES
(1, 1, CURRENT_DATE - INTERVAL '1 day', 'present', 'On time'),
(1, 1, CURRENT_DATE - INTERVAL '2 days', 'present', 'Active participation'),
(1, 1, CURRENT_DATE - INTERVAL '3 days', 'late', 'Bus delay'),
(1, 1, CURRENT_DATE - INTERVAL '4 days', 'present', NULL),
(1, 1, CURRENT_DATE - INTERVAL '5 days', 'present', NULL),
(1, 1, CURRENT_DATE - INTERVAL '6 days', 'absent', 'Slight fever'),
(1, 1, CURRENT_DATE - INTERVAL '7 days', 'present', NULL);

-- 9. Add Grades for the student (ID 1)
INSERT INTO grades (student_id, subject_id, class_id, exam_type, grade, max_grade, exam_date, remarks) VALUES
(1, 1, 1, 'midterm', 92.5, 100, CURRENT_DATE - INTERVAL '1 month', 'Excellent logic'),
(1, 2, 1, 'midterm', 88.0, 100, CURRENT_DATE - INTERVAL '1 month', 'Great essay'),
(1, 3, 1, 'quiz', 95.0, 100, CURRENT_DATE - INTERVAL '2 weeks', 'Perfect score'),
(1, 4, 1, 'assignment', 90.0, 100, CURRENT_DATE - INTERVAL '1 week', 'Very detailed work');

-- 10. Add Announcements
INSERT INTO announcements (title, content, announcement_type, target_audience, posted_by, priority, posted_at) VALUES
('Welcome to the New Dashboard', 'We have upgraded the school management system with a more beautiful and responsive dashboard for both students and teachers.', 'general', 'all', 3, 'high', NOW()),
('Science Fair Next Week', 'The annual school science fair is scheduled for next Friday. All students are encouraged to participate.', 'event', 'students', 3, 'medium', NOW()),
('New Grading Policy', 'Please review the updated grading policy in the teachers handbook.', 'academic', 'teachers', 3, 'high', NOW()),
('Holiday Notice', 'School will be closed this Friday for a public holiday.', 'holiday', 'all', 3, 'medium', NOW());

COMMIT;
