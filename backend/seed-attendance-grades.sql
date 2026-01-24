-- Seed Attendance Data
INSERT INTO attendance (student_id, class_id, attendance_date, status, remarks) VALUES
(1, 1, CURRENT_DATE - INTERVAL '1 day', 'present', 'On time'),
(1, 1, CURRENT_DATE - INTERVAL '2 days', 'present', 'On time'),
(1, 1, CURRENT_DATE - INTERVAL '3 days', 'late', 'Bus delay'),
(1, 1, CURRENT_DATE - INTERVAL '4 days', 'present', 'On time'),
(1, 1, CURRENT_DATE - INTERVAL '5 days', 'absent', 'Medical leave'),
(1, 2, CURRENT_DATE - INTERVAL '1 day', 'present', 'On time'),
(1, 2, CURRENT_DATE - INTERVAL '2 days', 'present', 'On time');

-- Seed Grades Data
INSERT INTO grades (student_id, subject_id, class_id, exam_type, grade, max_grade, exam_date, remarks) VALUES
(1, 1, 1, 'Midterm', 85.00, 100.00, CURRENT_DATE - INTERVAL '15 days', 'Excellent performance'),
(1, 2, 1, 'Midterm', 78.50, 100.00, CURRENT_DATE - INTERVAL '14 days', 'Good progress'),
(1, 3, 2, 'Quiz 1', 92.00, 100.00, CURRENT_DATE - INTERVAL '7 days', 'Top of class'),
(1, 1, 1, 'Assignment 1', 18.00, 20.00, CURRENT_DATE - INTERVAL '5 days', 'Well structured');
