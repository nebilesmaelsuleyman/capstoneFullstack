-- Comprehensive Seed Script for 10 Students and expanded school data
-- Password for all new users: '12345678'
-- Hash: $2b$10$H8ZPIOaE5lihfSJHLNYqO.9N4iRz0J3RmBWTlxQV8RZJPr7edB.Ey

BEGIN;

-- 1. Create New Teachers
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('teacher.liam@school.com', '$2b$10$H8ZPIOaE5lihfSJHLNYqO.9N4iRz0J3RmBWTlxQV8RZJPr7edB.Ey', 'teacher', 'Liam', 'Andersson', '+1234567801', true),
('teacher.olivia@school.com', '$2b$10$H8ZPIOaE5lihfSJHLNYqO.9N4iRz0J3RmBWTlxQV8RZJPr7edB.Ey', 'teacher', 'Olivia', 'Berg', '+1234567802', true);

INSERT INTO teachers (user_id, employee_id, date_of_birth, gender, department, specialization, qualification, hire_date) VALUES
((SELECT id FROM users WHERE email = 'teacher.liam@school.com'), 'EMP-201', '1982-03-15', 'Male', 'Mathematics', 'Statistics', 'M.Sc. Statistics', '2022-01-10'),
((SELECT id FROM users WHERE email = 'teacher.olivia@school.com'), 'EMP-202', '1985-07-22', 'Female', 'English', 'Lingustics', 'M.A. Linguistics', '2021-08-15');

-- 2. Create New Students
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('student.noah@school.com', '$2b$10$H8ZPIOaE5lihfSJHLNYqO.9N4iRz0J3RmBWTlxQV8RZJPr7edB.Ey', 'student', 'Noah', 'Williams', '+1234567811', true),
('student.emma@school.com', '$2b$10$H8ZPIOaE5lihfSJHLNYqO.9N4iRz0J3RmBWTlxQV8RZJPr7edB.Ey', 'student', 'Emma', 'Jones', '+1234567812', true),
('student.james@school.com', '$2b$10$H8ZPIOaE5lihfSJHLNYqO.9N4iRz0J3RmBWTlxQV8RZJPr7edB.Ey', 'student', 'James', 'Brown', '+1234567813', true),
('student.sophia@school.com', '$2b$10$H8ZPIOaE5lihfSJHLNYqO.9N4iRz0J3RmBWTlxQV8RZJPr7edB.Ey', 'student', 'Sophia', 'Davis', '+1234567814', true),
('student.logan@school.com', '$2b$10$H8ZPIOaE5lihfSJHLNYqO.9N4iRz0J3RmBWTlxQV8RZJPr7edB.Ey', 'student', 'Logan', 'Miller', '+1234567815', true),
('student.isabella@school.com', '$2b$10$H8ZPIOaE5lihfSJHLNYqO.9N4iRz0J3RmBWTlxQV8RZJPr7edB.Ey', 'student', 'Isabella', 'Wilson', '+1234567816', true),
('student.mason@school.com', '$2b$10$H8ZPIOaE5lihfSJHLNYqO.9N4iRz0J3RmBWTlxQV8RZJPr7edB.Ey', 'student', 'Mason', 'Moore', '+1234567817', true),
('student.mia@school.com', '$2b$10$H8ZPIOaE5lihfSJHLNYqO.9N4iRz0J3RmBWTlxQV8RZJPr7edB.Ey', 'student', 'Mia', 'Taylor', '+1234567818', true),
('student.lucas@school.com', '$2b$10$H8ZPIOaE5lihfSJHLNYqO.9N4iRz0J3RmBWTlxQV8RZJPr7edB.Ey', 'student', 'Lucas', 'Anderson', '+1234567819', true),
('student.ava@school.com', '$2b$10$H8ZPIOaE5lihfSJHLNYqO.9N4iRz0J3RmBWTlxQV8RZJPr7edB.Ey', 'student', 'Ava', 'Thomas', '+1234567820', true);

INSERT INTO students (user_id, student_id, date_of_birth, gender, grade_level, parent_name, parent_phone, parent_email, enrollment_date) VALUES
((SELECT id FROM users WHERE email = 'student.noah@school.com'), 'STU-101', '2010-01-05', 'Male', 9, 'Parent Noah', '+1234567821', 'parent.noah@email.com', '2024-01-01'),
((SELECT id FROM users WHERE email = 'student.emma@school.com'), 'STU-102', '2010-02-10', 'Female', 9, 'Parent Emma', '+1234567822', 'parent.emma@email.com', '2024-01-01'),
((SELECT id FROM users WHERE email = 'student.james@school.com'), 'STU-103', '2010-03-15', 'Male', 9, 'Parent James', '+1234567823', 'parent.james@email.com', '2024-01-01'),
((SELECT id FROM users WHERE email = 'student.sophia@school.com'), 'STU-104', '2010-04-20', 'Female', 9, 'Parent Sophia', '+1234567824', 'parent.sophia@email.com', '2024-01-01'),
((SELECT id FROM users WHERE email = 'student.logan@school.com'), 'STU-105', '2010-05-25', 'Male', 9, 'Parent Logan', '+1234567825', 'parent.logan@email.com', '2024-01-01'),
((SELECT id FROM users WHERE email = 'student.isabella@school.com'), 'STU-106', '2010-06-30', 'Female', 9, 'Parent Isabella', '+1234567826', 'parent.isabella@email.com', '2024-01-01'),
((SELECT id FROM users WHERE email = 'student.mason@school.com'), 'STU-107', '2010-07-05', 'Male', 9, 'Parent Mason', '+1234567827', 'parent.mason@email.com', '2024-01-01'),
((SELECT id FROM users WHERE email = 'student.mia@school.com'), 'STU-108', '2010-08-10', 'Female', 9, 'Parent Mia', '+1234567828', 'parent.mia@email.com', '2024-01-01'),
((SELECT id FROM users WHERE email = 'student.lucas@school.com'), 'STU-109', '2010-09-15', 'Male', 9, 'Parent Lucas', '+1234567829', 'parent.lucas@email.com', '2024-01-01'),
((SELECT id FROM users WHERE email = 'student.ava@school.com'), 'STU-110', '2010-10-20', 'Female', 9, 'Parent Ava', '+1234567830', 'parent.ava@email.com', '2024-01-01');

-- 3. Create Classes
INSERT INTO classes (class_name, class_code, grade_level, section, teacher_id, room_number, capacity, academic_year) VALUES
('Grade 9 - Mathematics A', 'G9-MATH-A', 9, 'A', (SELECT id FROM teachers WHERE employee_id = 'EMP-201'), '401', 30, '2024-2025'),
('Grade 9 - English B', 'G9-ENG-B', 9, 'B', (SELECT id FROM teachers WHERE employee_id = 'EMP-202'), '402', 30, '2024-2025');

-- 4. Enroll Students
DO $$
DECLARE
    student_rec RECORD;
    class_a_id INTEGER := (SELECT id FROM classes WHERE class_code = 'G9-MATH-A');
    class_b_id INTEGER := (SELECT id FROM classes WHERE class_code = 'G9-ENG-B');
    i INTEGER := 0;
BEGIN
    FOR student_rec IN SELECT id FROM students WHERE student_id LIKE 'STU-1%' LOOP
        IF i < 5 THEN
            INSERT INTO student_classes (student_id, class_id, enrollment_date, status) VALUES (student_rec.id, class_a_id, '2024-01-01', 'active');
        ELSE
            INSERT INTO student_classes (student_id, class_id, enrollment_date, status) VALUES (student_rec.id, class_b_id, '2024-01-01', 'active');
        END IF;
        i := i + 1;
    END LOOP;
END $$;

-- 5. Seed Attendance
INSERT INTO attendance (student_id, class_id, attendance_date, status, remarks)
SELECT s.id, sc.class_id, d.date, 'present', 'Auto-seeded'
FROM students s
JOIN student_classes sc ON s.id = sc.student_id
CROSS JOIN (SELECT CURRENT_DATE - i as date FROM generate_series(0, 5) i) d
WHERE s.student_id LIKE 'STU-1%';

-- 6. Seed Grades
INSERT INTO grades (student_id, subject_id, class_id, exam_type, grade, max_grade, exam_date, remarks)
SELECT s.id, 1, sc.class_id, 'quiz', floor(random() * 20 + 80), 100, CURRENT_DATE - INTERVAL '1 week', 'Good performance'
FROM students s
JOIN student_classes sc ON s.id = sc.student_id
WHERE s.student_id LIKE 'STU-1%';

INSERT INTO grades (student_id, subject_id, class_id, exam_type, grade, max_grade, exam_date, remarks)
SELECT s.id, 2, sc.class_id, 'midterm', floor(random() * 30 + 70), 100, CURRENT_DATE - INTERVAL '2 weeks', 'Consistent'
FROM students s
JOIN student_classes sc ON s.id = sc.student_id
WHERE s.student_id LIKE 'STU-1%';

COMMIT;
