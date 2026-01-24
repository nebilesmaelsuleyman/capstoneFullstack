import { Injectable } from "@nestjs/common"
import { DatabaseService } from "../database/database.service"

@Injectable()
export class AttendanceService {
  constructor(private readonly db: DatabaseService) { }

  async markAttendance(data: any) {
    const { studentId, classId, subjectId, attendanceDate, status, remarks } = data

    const query = `
      INSERT INTO attendance (student_id, class_id, subject_id, attendance_date, status, remarks)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (student_id, class_id, subject_id, attendance_date)
      DO UPDATE SET status = $5, remarks = $6
      RETURNING *
    `

    const result = await this.db.query(query, [studentId, classId, subjectId, attendanceDate, status, remarks || null])
    return result.rows[0]
  }

  async markBulkAttendance(classId: number, date: string, records: any[]) {
    const client = await this.db.getClient()
    try {
      await client.query("BEGIN")

      const results = []
      for (const record of records) {
        const query = `
          INSERT INTO attendance (student_id, class_id, subject_id, attendance_date, status, remarks)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (student_id, class_id, subject_id, attendance_date)
          DO UPDATE SET status = $5, remarks = $6
          RETURNING *
        `
        const result = await client.query(query, [
          record.studentId,
          classId,
          record.subjectId,
          date,
          record.status,
          record.remarks || null,
        ])
        results.push(result.rows[0])
      }

      await client.query("COMMIT")
      return results
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  }

  async getStudentAttendance(studentId: number, startDate?: string, endDate?: string) {
    let query = `
      SELECT a.*, c.class_name, c.section, s.subject_name
      FROM attendance a
      JOIN classes c ON a.class_id = c.id
      JOIN subjects s ON a.subject_id = s.id
      WHERE a.student_id = $1
    `
    const params: any[] = [studentId]

    if (startDate) {
      params.push(startDate)
      query += ` AND a.attendance_date >= $${params.length}`
    }
    if (endDate) {
      params.push(endDate)
      query += ` AND a.attendance_date <= $${params.length}`
    }

    query += " ORDER BY a.attendance_date DESC"

    const result = await this.db.query(query, params)
    return result.rows
  }

  async getClassAttendance(classId: number, date: string, subjectId?: number) {
    let query = `
      SELECT 
        s.id as student_id,
        u.first_name,
        u.last_name,
        s.student_id as roll_number,
        COALESCE(a.status, 'not_marked') as status,
        a.remarks
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN student_classes sc ON s.id = sc.student_id
      LEFT JOIN attendance a ON s.id = a.student_id 
        AND a.class_id = $1 
        AND a.attendance_date = $2
    `

    const params: any[] = [classId, date]

    if (subjectId) {
      query += ` AND a.subject_id = $3`
      params.push(subjectId)
    }

    query += `
      WHERE sc.class_id = $1 AND sc.status = 'active'
      ORDER BY u.last_name, u.first_name
    `

    const result = await this.db.query(query, params)
    return result.rows
  }

  async getAttendanceStatistics(studentId: number) {
    const query = `
      SELECT 
        COUNT(*) as total_days,
        COUNT(CASE WHEN status = 'present' THEN 1 END) as present_days,
        COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_days,
        COUNT(CASE WHEN status = 'late' THEN 1 END) as late_days,
        COUNT(CASE WHEN status = 'excused' THEN 1 END) as excused_days,
        ROUND(
          (COUNT(CASE WHEN status = 'present' THEN 1 END)::numeric / 
          NULLIF(COUNT(*), 0) * 100), 2
        ) as attendance_percentage
      FROM attendance
      WHERE student_id = $1
    `

    const result = await this.db.query(query, [studentId])
    return result.rows[0]
  }
}
