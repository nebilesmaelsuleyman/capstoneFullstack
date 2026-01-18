import { Injectable } from "@nestjs/common"
import { DatabaseService } from "../database/database.service"

@Injectable()
export class ExamsService {
  constructor(private readonly db: DatabaseService) {}

  async createExam(data: any) {
    const { examName, examType, subjectId, classId, examDate, totalMarks, durationMinutes, description } = data

    const query = `
      INSERT INTO exams (exam_name, exam_type, subject_id, class_id, exam_date, total_marks, duration_minutes, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `

    const result = await this.db.query(query, [
      examName,
      examType,
      subjectId,
      classId,
      examDate,
      totalMarks,
      durationMinutes,
      description,
    ])
    return result.rows[0]
  }

  async getAllExams(filters: any) {
    let query = `
      SELECT e.*, s.subject_name, c.class_name, c.section
      FROM exams e
      JOIN subjects s ON e.subject_id = s.id
      JOIN classes c ON e.class_id = c.id
      WHERE 1=1
    `
    const params: any[] = []

    if (filters.classId) {
      params.push(filters.classId)
      query += ` AND e.class_id = $${params.length}`
    }
    if (filters.subjectId) {
      params.push(filters.subjectId)
      query += ` AND e.subject_id = $${params.length}`
    }
    if (filters.examType) {
      params.push(filters.examType)
      query += ` AND e.exam_type = $${params.length}`
    }

    query += " ORDER BY e.exam_date DESC"

    const result = await this.db.query(query, params)
    return result.rows
  }

  async getExamById(id: number) {
    const query = `
      SELECT e.*, s.subject_name, c.class_name, c.section
      FROM exams e
      JOIN subjects s ON e.subject_id = s.id
      JOIN classes c ON e.class_id = c.id
      WHERE e.id = $1
    `

    const result = await this.db.query(query, [id])
    return result.rows[0]
  }

  async submitExamResult(examId: number, data: any) {
    const { studentId, marksObtained, gradeLetter, remarks } = data

    const query = `
      INSERT INTO exam_results (exam_id, student_id, marks_obtained, grade_letter, remarks)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (exam_id, student_id)
      DO UPDATE SET marks_obtained = $3, grade_letter = $4, remarks = $5
      RETURNING *
    `

    const result = await this.db.query(query, [examId, studentId, marksObtained, gradeLetter, remarks])
    return result.rows[0]
  }

  async getStudentResults(studentId: number) {
    const query = `
      SELECT 
        er.*,
        e.exam_name,
        e.exam_type,
        e.exam_date,
        e.total_marks,
        s.subject_name,
        c.class_name
      FROM exam_results er
      JOIN exams e ON er.exam_id = e.id
      JOIN subjects s ON e.subject_id = s.id
      JOIN classes c ON e.class_id = c.id
      WHERE er.student_id = $1
      ORDER BY e.exam_date DESC
    `

    const result = await this.db.query(query, [studentId])
    return result.rows
  }

  async getExamResults(examId: number) {
    const query = `
      SELECT 
        er.*,
        u.first_name,
        u.last_name,
        s.student_id as roll_number
      FROM exam_results er
      JOIN students s ON er.student_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE er.exam_id = $1
      ORDER BY er.marks_obtained DESC
    `

    const result = await this.db.query(query, [examId])
    return result.rows
  }
}
