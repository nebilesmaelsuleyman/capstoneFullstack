-- Comprehensive School Management System - Seed Data Migration
-- This file contains realistic seed data for all tables
-- Run after init.sql to populate the database with sample data

-- =============================================
-- Users Data
-- =============================================
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('admin@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'admin', 'System', 'Administrator', '03001234567', true),
('john.teacher@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'teacher', 'John', 'Smith', '03011234567', true),
('sarah.teacher@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'teacher', 'Sarah', 'Williams', '03021234567', true),
('michael.teacher@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'teacher', 'Michael', 'Brown', '03031234567', true),
('emma.teacher@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'teacher', 'Emma', 'Jones', '03041234567', true),
('ali.student@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'student', 'Ali', 'Khan', '03051234567', true),
('fatima.student@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'student', 'Fatima', 'Ahmed', '03061234567', true),
('hassan.student@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'student', 'Hassan', 'Ali', '03071234567', true),
('ayesha.student@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'student', 'Ayesha', 'Hassan', '03081234567', true),
('zainab.student@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'student', 'Zainab', 'Malik', '03091234567', true),
('usman.student@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'student', 'Usman', 'Khan', '03101234567', true),
('maria.student@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'student', 'Maria', 'Hassan', '03111234567', true),
('ibrahim.student@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'student', 'Ibrahim', 'Ahmed', '03121234567', true),
('leila.student@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'student', 'Leila', 'Khan', '03131234567', true),
('bilal.student@school.com', '$2b$10$YQvZ8P0q8wXxVvQ9Q8vQ8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'student', 'Bilal', 'Ahmed', '03141234567', true);

-- =============================================
-- Teachers Data
-- =============================================
INSERT INTO teachers (user_id, employee_id, date_of_birth, gender, address, hire_date, department, specialization, qualification) VALUES
(2, 'EMP001', '1980-05-15', 'Male', '123 Main Street', '2015-08-01', 'Mathematics', 'Pure Mathematics', 'M.Sc Mathematics'),
(3, 'EMP002', '1985-03-22', 'Female', '456 Park Avenue', '2016-08-01', 'English', 'Literature', 'M.A English'),
(4, 'EMP003', '1982-07-18', 'Male', '789 School Road', '2014-08-01', 'Science', 'Physics', 'M.Sc Physics'),
(5, 'EMP004', '1988-11-10', 'Female', '321 University Lane', '2018-08-01', 'Science', 'Chemistry', 'M.Sc Chemistry');

-- =============================================
-- Classes Data
-- =============================================
INSERT INTO classes (class_name, class_code, grade_level, section, teacher_id, room_number, capacity, academic_year) VALUES
(9, 'GRADE9A', 9, 'A', 2, '101', 35, '2024-2025'),
(9, 'GRADE9B', 9, 'B', 3, '102', 32, '2024-2025'),
(10, 'GRADE10A', 10, 'A', 4, '201', 36, '2024-2025'),
(10, 'GRADE10B', 10, 'B', 5, '202', 33, '2024-2025');

-- =============================================
-- Students Data
-- =============================================
INSERT INTO students (user_id, student_id, date_of_birth, gender, address, parent_name, parent_phone, parent_email, enrollment_date, grade_level) VALUES
(6, 'STU001', '2009-02-14', 'Male', '100 Student Avenue', 'Khawaja Khan', '03211234567', 'khawaja@email.com', '2023-08-01', 9),
(7, 'STU002', '2009-06-20', 'Female', '101 Student Avenue', 'Farida Ahmed', '03221234567', 'farida@email.com', '2023-08-01', 9),
(8, 'STU003', '2009-03-10', 'Male', '102 Student Avenue', 'Muhammad Ali', '03231234567', 'm.ali@email.com', '2023-08-01', 9),
(9, 'STU004', '2009-08-05', 'Female', '103 Student Avenue', 'Amna Hassan', '03241234567', 'amna@email.com', '2023-08-01', 9),
(10, 'STU005', '2009-11-12', 'Female', '104 Student Avenue', 'Rabia Malik', '03251234567', 'rabia@email.com', '2023-08-01', 9),
(11, 'STU006', '2008-01-18', 'Male', '105 Student Avenue', 'Tahir Khan', '03261234567', 'tahir@email.com', '2023-08-01', 10),
(12, 'STU007', '2008-04-22', 'Female', '106 Student Avenue', 'Saira Hassan', '03271234567', 'saira@email.com', '2023-08-01', 10),
(13, 'STU008', '2008-07-30', 'Male', '107 Student Avenue', 'Karim Ahmed', '03281234567', 'karim@email.com', '2023-08-01', 10),
(14, 'STU009', '2008-09-25', 'Female', '108 Student Avenue', 'Noor Khan', '03291234567', 'noor@email.com', '2023-08-01', 10),
(15, 'STU010', '2008-12-03', 'Male', '109 Student Avenue', 'Rashid Ahmed', '03301234567', 'rashid@email.com', '2023-08-01', 10);

-- =============================================
-- Student Classes Enrollment
-- =============================================
INSERT INTO student_classes (student_id, class_id, enrollment_date, status) VALUES
(1, 1, '2023-08-01', 'active'),
(2, 1, '2023-08-01', 'active'),
(3, 1, '2023-08-01', 'active'),
(4, 2, '2023-08-01', 'active'),
(5, 2, '2023-08-01', 'active'),
(6, 3, '2023-08-01', 'active'),
(7, 3, '2023-08-01', 'active'),
(8, 4, '2023-08-01', 'active'),
(9, 4, '2023-08-01', 'active'),
(10, 4, '2023-08-01', 'active');

-- =============================================
-- Subjects Data
-- =============================================
INSERT INTO subjects (subject_name, subject_code, description, credits) VALUES
('Mathematics', 'MATH101', 'Core mathematics for high school', 4),
('English Language', 'ENG101', 'English language and communication skills', 3),
('Science', 'SCI101', 'Integrated science course', 4),
('History', 'HIST101', 'World and national history', 3),
('Physical Education', 'PE101', 'Physical fitness and sports', 2),
('Computer Science', 'CS101', 'Introduction to computing', 3),
('Islamic Studies', 'IS101', 'Islamic education and ethics', 2);

-- =============================================
-- Class Subjects Assignment
-- =============================================
INSERT INTO class_subjects (class_id, subject_id, teacher_id, schedule_day, schedule_time) VALUES
(1, 1, 2, 'Monday', '09:00-10:00'),
(1, 2, 3, 'Tuesday', '10:00-11:00'),
(1, 3, 4, 'Wednesday', '11:00-12:00'),
(1, 4, 5, 'Thursday', '09:00-10:00'),
(1, 5, 2, 'Friday', '10:00-11:00'),
(2, 1, 2, 'Monday', '10:00-11:00'),
(2, 2, 3, 'Tuesday', '11:00-12:00'),
(2, 3, 4, 'Wednesday', '09:00-10:00'),
(3, 1, 2, 'Monday', '11:00-12:00'),
(3, 2, 3, 'Tuesday', '09:00-10:00'),
(3, 3, 4, 'Wednesday', '10:00-11:00'),
(4, 1, 2, 'Monday', '12:00-01:00'),
(4, 2, 3, 'Tuesday', '12:00-01:00'),
(4, 3, 4, 'Wednesday', '12:00-01:00');

-- =============================================
-- Exams Data
-- =============================================
INSERT INTO exams (exam_name, exam_type, subject_id, class_id, exam_date, total_marks, duration_minutes, description) VALUES
('Mid-term Mathematics Exam', 'midterm', 1, 1, '2024-03-15', 100, 120, 'Covering chapters 1-5'),
('Mid-term English Exam', 'midterm', 2, 1, '2024-03-18', 100, 90, 'Grammar and comprehension'),
('Mid-term Science Exam', 'midterm', 3, 1, '2024-03-22', 100, 120, 'Physics and Chemistry sections'),
('Final Mathematics Exam', 'final', 1, 1, '2024-05-20', 100, 120, 'Complete syllabus'),
('Final English Exam', 'final', 2, 1, '2024-05-23', 100, 90, 'All topics covered'),
('Mathematics Quiz 1', 'quiz', 1, 2, '2024-02-28', 50, 45, 'Algebra basics'),
('Science Quiz 1', 'quiz', 3, 2, '2024-03-05', 50, 45, 'Biology section');

-- =============================================
-- Grades Data
-- =============================================
INSERT INTO grades (student_id, subject_id, class_id, exam_type, grade, max_grade, exam_date, remarks) VALUES
(1, 1, 1, 'midterm', 85, 100, '2024-03-15', 'Good performance'),
(1, 2, 1, 'midterm', 78, 100, '2024-03-18', 'Average'),
(1, 3, 1, 'midterm', 92, 100, '2024-03-22', 'Excellent'),
(2, 1, 1, 'midterm', 88, 100, '2024-03-15', 'Very good'),
(2, 2, 1, 'midterm', 95, 100, '2024-03-18', 'Excellent'),
(2, 3, 1, 'midterm', 82, 100, '2024-03-22', 'Good'),
(3, 1, 1, 'midterm', 76, 100, '2024-03-15', 'Average'),
(3, 2, 1, 'midterm', 81, 100, '2024-03-18', 'Good'),
(3, 3, 1, 'midterm', 79, 100, '2024-03-22', 'Average'),
(4, 1, 2, 'quiz', 42, 50, '2024-02-28', 'Good'),
(4, 3, 2, 'quiz', 48, 50, '2024-03-05', 'Excellent'),
(5, 1, 2, 'quiz', 38, 50, '2024-02-28', 'Satisfactory'),
(5, 3, 2, 'quiz', 45, 50, '2024-03-05', 'Very Good');

-- =============================================
-- Attendance Data
-- =============================================
INSERT INTO attendance (student_id, class_id, attendance_date, status, remarks) VALUES
(1, 1, '2024-01-15', 'present', NULL),
(1, 1, '2024-01-16', 'present', NULL),
(1, 1, '2024-01-17', 'absent', 'Sick leave'),
(1, 1, '2024-01-18', 'present', NULL),
(1, 1, '2024-01-19', 'late', NULL),
(2, 1, '2024-01-15', 'present', NULL),
(2, 1, '2024-01-16', 'present', NULL),
(2, 1, '2024-01-17', 'present', NULL),
(2, 1, '2024-01-18', 'present', NULL),
(2, 1, '2024-01-19', 'present', NULL),
(3, 1, '2024-01-15', 'present', NULL),
(3, 1, '2024-01-16', 'late', NULL),
(3, 1, '2024-01-17', 'present', NULL),
(3, 1, '2024-01-18', 'absent', 'Family matter'),
(3, 1, '2024-01-19', 'present', NULL),
(4, 2, '2024-01-15', 'present', NULL),
(4, 2, '2024-01-16', 'present', NULL),
(4, 2, '2024-01-17', 'present', NULL),
(4, 2, '2024-01-18', 'present', NULL),
(4, 2, '2024-01-19', 'present', NULL),
(5, 2, '2024-01-15', 'present', NULL),
(5, 2, '2024-01-16', 'absent', 'Medical appointment'),
(5, 2, '2024-01-17', 'present', NULL),
(5, 2, '2024-01-18', 'present', NULL),
(5, 2, '2024-01-19', 'late', NULL);

-- =============================================
-- Timetable Data
-- =============================================
INSERT INTO timetable (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room_number) VALUES
(1, 1, 2, 'Monday', '09:00:00', '10:00:00', '101'),
(1, 2, 3, 'Monday', '10:15:00', '11:15:00', '101'),
(1, 3, 4, 'Monday', '11:30:00', '12:30:00', '101'),
(1, 4, 5, 'Tuesday', '09:00:00', '10:00:00', '101'),
(1, 5, 2, 'Tuesday', '10:15:00', '11:15:00', '102'),
(1, 1, 2, 'Wednesday', '09:00:00', '10:00:00', '101'),
(1, 2, 3, 'Wednesday', '10:15:00', '11:15:00', '101'),
(1, 3, 4, 'Thursday', '09:00:00', '10:00:00', '101'),
(1, 4, 5, 'Thursday', '10:15:00', '11:15:00', '101'),
(1, 1, 2, 'Friday', '09:00:00', '10:00:00', '101'),
(2, 1, 2, 'Monday', '10:00:00', '11:00:00', '102'),
(2, 2, 3, 'Monday', '11:15:00', '12:15:00', '102'),
(2, 3, 4, 'Tuesday', '10:00:00', '11:00:00', '102');

-- =============================================
-- Announcements Data
-- =============================================
INSERT INTO announcements (title, content, announcement_type, target_audience, posted_by, priority, posted_at) VALUES
('Welcome to New Academic Year', 'We welcome all students and staff to the new academic year 2024-2025. Let us make this year successful together. Special welcome programs will be held on 1st August.', 'general', 'all', 1, 'high', NOW()),
('Mid-term Exams Schedule Released', 'Mid-term examinations will be conducted from March 15 to March 25, 2024. Please check your individual timetables on the portal. All students are required to be present.', 'academic', 'students', 1, 'high', NOW()),
('Parent-Teacher Meeting - Scheduled', 'Parent-teacher meeting scheduled for next Saturday (January 20) at 10 AM in the main hall. Parents are requested to meet their wards'' class teachers to discuss progress.', 'event', 'parents', 1, 'medium', NOW()),
('Sports Day Announcement', 'Annual sports day will be held on February 14, 2024. All students are encouraged to participate in various sports events. Registration deadline is January 30.', 'event', 'students', 1, 'medium', NOW()),
('School Holiday Notice', 'School will remain closed on February 5 for Independence Day. Classes will resume on February 6 (Tuesday). Enjoy your holiday!', 'holiday', 'all', 1, 'high', NOW()),
('Library Extended Hours', 'Library opening hours have been extended during exam season. Library will now open from 7 AM to 6 PM. Study groups can book reading rooms in advance.', 'general', 'students', 1, 'low', NOW());

-- =============================================
-- Fee Structure Data
-- =============================================
INSERT INTO fee_structure (grade_level, fee_type, amount, description, academic_year, due_date) VALUES
(9, 'Tuition Fee', 15000.00, 'Annual tuition fee for Grade 9', '2024-2025', '2024-04-30'),
(9, 'Library Fee', 500.00, 'Annual library fee for resource access', '2024-2025', '2024-04-30'),
(9, 'Sports Fee', 1000.00, 'Annual sports and activities fee', '2024-2025', '2024-04-30'),
(9, 'Laboratory Fee', 1500.00, 'Science lab usage fee', '2024-2025', '2024-04-30'),
(9, 'Miscellaneous Fee', 1000.00, 'For various school activities', '2024-2025', '2024-04-30'),
(10, 'Tuition Fee', 16000.00, 'Annual tuition fee for Grade 10', '2024-2025', '2024-04-30'),
(10, 'Library Fee', 500.00, 'Annual library fee for resource access', '2024-2025', '2024-04-30'),
(10, 'Sports Fee', 1000.00, 'Annual sports and activities fee', '2024-2025', '2024-04-30'),
(10, 'Laboratory Fee', 1500.00, 'Science lab usage fee', '2024-2025', '2024-04-30'),
(10, 'Miscellaneous Fee', 1000.00, 'For various school activities', '2024-2025', '2024-04-30');

-- =============================================
-- Fee Payments Data
-- =============================================
INSERT INTO fee_payments (student_id, fee_structure_id, amount_paid, payment_date, payment_method, transaction_id, receipt_number, payment_status, remarks) VALUES
(1, 1, 15000.00, '2024-01-10', 'bank_transfer', 'TXN001001', 'REC001', 'paid', 'Tuition fee paid in full'),
(1, 2, 500.00, '2024-01-10', 'bank_transfer', 'TXN001002', 'REC002', 'paid', 'Library fee paid'),
(1, 3, 1000.00, '2024-01-10', 'bank_transfer', 'TXN001003', 'REC003', 'paid', 'Sports fee paid'),
(2, 1, 15000.00, '2024-01-12', 'online', 'TXN002001', 'REC004', 'paid', 'Tuition fee paid'),
(2, 2, 500.00, '2024-01-12', 'online', 'TXN002002', 'REC005', 'paid', 'Library fee paid'),
(3, 1, 7500.00, '2024-01-15', 'cash', 'CASH001', 'REC006', 'partial', 'Half tuition fee paid'),
(4, 6, 16000.00, '2024-01-11', 'bank_transfer', 'TXN004001', 'REC007', 'paid', 'Grade 10 tuition fee paid'),
(5, 6, 16000.00, '2024-01-13', 'online', 'TXN005001', 'REC008', 'paid', 'Grade 10 tuition fee paid');

-- =============================================
-- Library Books Data
-- =============================================
INSERT INTO library_books (title, author, isbn, category, total_copies, available_copies, published_year) VALUES
('To Kill a Mockingbird', 'Harper Lee', '978-0061120084', 'Fiction', 5, 3, 1960),
('The Great Gatsby', 'F. Scott Fitzgerald', '978-0743273565', 'Fiction', 4, 2, 1925),
('1984', 'George Orwell', '978-0451524935', 'Fiction', 6, 4, 1949),
('Pride and Prejudice', 'Jane Austen', '978-0141439518', 'Fiction', 4, 3, 1813),
('Introduction to Algorithms', 'Thomas H. Cormen', '978-0262033848', 'Computer Science', 3, 2, 2009),
('The Catcher in the Rye', 'J.D. Salinger', '978-0316769174', 'Fiction', 3, 2, 1951),
('Brave New World', 'Aldous Huxley', '978-0060085239', 'Fiction', 4, 3, 1932),
('Jane Eyre', 'Charlotte Bronte', '978-0141441146', 'Fiction', 3, 2, 1847),
('Data Structures', 'Mark Allen Weiss', '978-0201361529', 'Computer Science', 2, 1, 2006),
('Calculus: Early Transcendentals', 'James Stewart', '978-0538497909', 'Mathematics', 4, 3, 2015);

-- =============================================
-- Book Issues Data
-- =============================================
INSERT INTO book_issues (book_id, student_id, issue_date, due_date, return_date, status, fine_amount) VALUES
(1, 1, '2024-01-10', '2024-01-24', '2024-01-23', 'returned', 0),
(2, 2, '2024-01-12', '2024-01-26', NULL, 'issued', 0),
(3, 1, '2024-01-15', '2024-01-29', NULL, 'issued', 0),
(4, 3, '2024-01-14', '2024-01-28', '2024-02-05', 'overdue', 70),
(5, 4, '2024-01-16', '2024-01-30', NULL, 'issued', 0),
(1, 2, '2024-01-18', '2024-02-01', NULL, 'issued', 0),
(6, 5, '2024-01-11', '2024-01-25', '2024-01-25', 'returned', 0),
(7, 1, '2024-01-20', '2024-02-03', NULL, 'issued', 0);

-- =============================================
-- Leave Requests Data
-- =============================================
INSERT INTO leave_requests (student_id, start_date, end_date, reason, leave_type, status, approved_by, approved_at) VALUES
(1, '2024-02-10', '2024-02-12', 'Family wedding', 'family', 'approved', 1, '2024-01-25'),
(3, '2024-02-20', '2024-02-22', 'Medical treatment', 'sick', 'approved', 1, '2024-01-26'),
(4, '2024-03-05', '2024-03-08', 'Personal reasons', 'personal', 'pending', NULL, NULL),
(2, '2024-02-05', '2024-02-05', 'Doctor appointment', 'sick', 'approved', 1, '2024-01-24');

-- =============================================
-- Notifications Data
-- =============================================
INSERT INTO notifications (user_id, title, message, notification_type, is_read, link_url) VALUES
(6, 'Exam Schedule Released', 'Your mid-term exam schedule has been released. Check it on the portal.', 'academic', false, '/exams'),
(6, 'Fee Payment Due', 'Your tuition fee for this term is due on April 30, 2024.', 'payment', false, '/fees'),
(7, 'Grades Updated', 'Your mid-term grades have been uploaded. View them now.', 'academic', false, '/grades'),
(8, 'Library Book Due', 'The book you issued is due for return on January 29, 2024.', 'reminder', false, '/library'),
(9, 'Leave Approved', 'Your leave request for February 20-22 has been approved.', 'approval', true, '/leave-requests');

-- =============================================
-- Parent-Student Relations
-- =============================================
INSERT INTO parent_student_relation (parent_id, student_id, relationship, is_primary) VALUES
(6, 1, 'father', true),
(7, 2, 'mother', true),
(8, 3, 'father', true),
(9, 4, 'mother', true),
(10, 5, 'mother', true),
(11, 6, 'father', true),
(12, 7, 'mother', true),
(13, 8, 'father', true),
(14, 9, 'mother', true),
(15, 10, 'father', true);

-- =============================================
-- Create Indexes for Performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_student_classes_student ON student_classes(student_id);
CREATE INDEX IF NOT EXISTS idx_student_classes_class ON student_classes(class_id);
CREATE INDEX IF NOT EXISTS idx_grades_exam_type ON grades(exam_type);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);
CREATE INDEX IF NOT EXISTS idx_fee_payments_status ON fee_payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_book_issues_status ON book_issues(status);
CREATE INDEX IF NOT EXISTS idx_leave_status ON leave_requests(status);

-- Data migration completed successfully!
