-- Seeding more classes for various grades
BEGIN;

INSERT INTO classes (class_name, class_code, grade_level, section, teacher_id, room_number, capacity, academic_year) VALUES
('Grade 10 - Physics A', 'G10-PHY-A', 10, 'A', (SELECT id FROM teachers WHERE employee_id = 'EMP-201'), '501', 30, '2024-2025'),
('Grade 10 - Literature B', 'G10-LIT-B', 10, 'B', (SELECT id FROM teachers WHERE employee_id = 'EMP-202'), '502', 30, '2024-2025'),
('Grade 11 - Calculus C', 'G11-CALC-C', 11, 'C', (SELECT id FROM teachers WHERE employee_id = 'EMP-201'), '601', 25, '2024-2025'),
('Grade 12 - History D', 'G12-HIST-D', 12, 'D', (SELECT id FROM teachers WHERE employee_id = 'EMP-202'), '602', 25, '2024-2025'),
('Grade 9 - Biology B', 'G9-BIO-B', 9, 'B', (SELECT id FROM teachers WHERE employee_id = 'EMP-999'), '304', 30, '2024-2025');

-- Link some subjects to these classes (assuming generic subject IDs exist or creating them)
INSERT INTO subjects (subject_name, subject_code, description, credits) 
SELECT 'Physics', 'PHY101', 'Core physics course', 4
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE subject_code = 'PHY101');

INSERT INTO subjects (subject_name, subject_code, description, credits) 
SELECT 'Literature', 'LIT101', 'English literature', 3
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE subject_code = 'LIT101');

INSERT INTO subjects (subject_name, subject_code, description, credits) 
SELECT 'Calculus', 'MATH201', 'Advanced mathematics', 4
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE subject_code = 'MATH201');

COMMIT;
