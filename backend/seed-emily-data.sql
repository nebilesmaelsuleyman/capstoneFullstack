-- Seeding more data for Emily Clark (STU-999)
-- Current Emily's student id is STU-999

BEGIN;

-- Add more grades
INSERT INTO grades (student_id, subject_id, class_id, exam_type, grade, max_grade, exam_date, remarks) 
VALUES 
((SELECT id FROM students WHERE student_id = 'STU-999'), (SELECT id FROM subjects WHERE subject_code = 'CHEM201'), (SELECT id FROM classes WHERE class_code = 'G9-ADV'), 'final', 96.0, 100, CURRENT_DATE - INTERVAL '1 day', 'Excellent progress'),
((SELECT id FROM students WHERE student_id = 'STU-999'), (SELECT id FROM subjects WHERE subject_code = 'BIO101'), (SELECT id FROM classes WHERE class_code = 'G9-ADV'), 'assignment', 85.0, 100, CURRENT_DATE, 'Good job');

-- Add more attendance
INSERT INTO attendance (student_id, class_id, attendance_date, status, remarks) 
VALUES 
((SELECT id FROM students WHERE student_id = 'STU-999'), (SELECT id FROM classes WHERE class_code = 'G9-ADV'), CURRENT_DATE, 'present', NULL);

COMMIT;
