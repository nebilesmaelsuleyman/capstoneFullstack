import { Injectable } from "@nestjs/common"
import { DatabaseService } from "../database/database.service"
import { RedisService } from "../redis/redis.service"

@Injectable()
export class GradesService {
  constructor(
    private readonly db: DatabaseService,
    private readonly redis: RedisService,
  ) { }

  async findByStudent(studentId: string) {
    const cacheKey = `grades:student:${studentId}`
    const cached = await this.redis.get(cacheKey)
    if (cached) return JSON.parse(cached)

    const query = `
      SELECT 
        g.id,
        g.student_id,
        g.subject_id,
        g.class_id,
        g.exam_type,
        g.grade,
        g.max_grade,
        g.exam_date,
        g.remarks,
        g.created_at,
        s.subject_name,
        s.subject_code,
        c.class_name,
        c.class_code
      FROM grades g
      JOIN subjects s ON g.subject_id = s.id
      LEFT JOIN classes c ON g.class_id = c.id
      WHERE g.student_id = $1
      ORDER BY g.exam_date DESC, s.subject_name
    `
    const result = await this.db.query(query, [studentId])
    const grades = result.rows
    await this.redis.set(cacheKey, JSON.stringify(grades), 600)
    return grades
  }

  async getGradesByClassAndSubject(classId: string, subjectId: string) {
    const query = `
      SELECT 
        g.id,
        g.student_id,
        g.exam_type,
        g.grade,
        g.max_grade,
        g.exam_date,
        g.remarks,
        st.student_id as student_number,
        u.first_name,
        u.last_name,
        u.email
      FROM grades g
      JOIN students st ON g.student_id = st.id
      JOIN users u ON st.user_id = u.id
      WHERE g.class_id = $1 AND g.subject_id = $2
      ORDER BY u.last_name, u.first_name
    `
    const result = await this.db.query(query, [classId, subjectId])
    return result.rows
  }

  async create(data: {
    student_id: number;
    subject_id: number;
    class_id: number;
    exam_type: string;
    grade: number;
    max_grade?: number;
    exam_date?: string;
    remarks?: string;
  }) {
    const query = `
      INSERT INTO grades (student_id, subject_id, class_id, exam_type, grade, max_grade, exam_date, remarks)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `
    const result = await this.db.query(query, [
      data.student_id,
      data.subject_id,
      data.class_id,
      data.exam_type,
      data.grade,
      data.max_grade || 100,
      data.exam_date || new Date().toISOString().split('T')[0],
      data.remarks
    ])
    await this.redis.del(`grades:student:${data.student_id}`)
    return result.rows[0]
  }

  async update(id: string, data: {
    grade?: number;
    max_grade?: number;
    exam_type?: string;
    exam_date?: string;
    remarks?: string;
  }) {
    const fields = []
    const values = []
    let paramCount = 1

    if (data.grade !== undefined) {
      fields.push(`grade = $${paramCount++}`)
      values.push(data.grade)
    }
    if (data.max_grade !== undefined) {
      fields.push(`max_grade = $${paramCount++}`)
      values.push(data.max_grade)
    }
    if (data.exam_type !== undefined) {
      fields.push(`exam_type = $${paramCount++}`)
      values.push(data.exam_type)
    }
    if (data.exam_date !== undefined) {
      fields.push(`exam_date = $${paramCount++}`)
      values.push(data.exam_date)
    }
    if (data.remarks !== undefined) {
      fields.push(`remarks = $${paramCount++}`)
      values.push(data.remarks)
    }

    if (fields.length === 0) {
      throw new Error('No fields to update')
    }

    values.push(id)
    const query = `
      UPDATE grades 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `
    const result = await this.db.query(query, values)

    if (result.rows[0]) {
      await this.redis.del(`grades:student:${result.rows[0].student_id}`)
    }

    return result.rows[0]
  }
}
