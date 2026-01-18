import { Injectable } from "@nestjs/common"
import  { DatabaseService } from "../database/database.service"

@Injectable()
export class TimetableService {
  constructor(private readonly db: DatabaseService) {}

  async createTimetableEntry(data: any) {
    const { classId, subjectId, teacherId, dayOfWeek, startTime, endTime, roomNumber } = data

    const query = `
      INSERT INTO timetable (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room_number)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `

    const result = await this.db.query(query, [
      classId,
      subjectId,
      teacherId,
      dayOfWeek,
      startTime,
      endTime,
      roomNumber,
    ])
    return result.rows[0]
  }

  async getClassTimetable(classId: number) {
    const query = `
      SELECT 
        t.*,
        s.subject_name,
        s.subject_code,
        u.first_name as teacher_first_name,
        u.last_name as teacher_last_name
      FROM timetable t
      JOIN subjects s ON t.subject_id = s.id
      LEFT JOIN teachers te ON t.teacher_id = te.id
      LEFT JOIN users u ON te.user_id = u.id
      WHERE t.class_id = $1
      ORDER BY 
        CASE t.day_of_week
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
          WHEN 'Saturday' THEN 6
          WHEN 'Sunday' THEN 7
        END,
        t.start_time
    `

    const result = await this.db.query(query, [classId])
    return result.rows
  }

  async getTeacherTimetable(teacherId: number) {
    const query = `
      SELECT 
        t.*,
        s.subject_name,
        c.class_name,
        c.section
      FROM timetable t
      JOIN subjects s ON t.subject_id = s.id
      JOIN classes c ON t.class_id = c.id
      WHERE t.teacher_id = $1
      ORDER BY 
        CASE t.day_of_week
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
          WHEN 'Saturday' THEN 6
          WHEN 'Sunday' THEN 7
        END,
        t.start_time
    `

    const result = await this.db.query(query, [teacherId])
    return result.rows
  }

  async deleteTimetableEntry(id: number) {
    const query = "DELETE FROM timetable WHERE id = $1"
    await this.db.query(query, [id])
  }
}
