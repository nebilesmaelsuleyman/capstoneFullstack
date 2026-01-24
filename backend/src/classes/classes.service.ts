import { Injectable, Inject } from "@nestjs/common"
import type { Pool } from "pg"

@Injectable()
export class ClassesService {
  constructor(
    @Inject("DATABASE_POOL") private readonly pool: Pool
  ) { }

  async findAll() {
    const result = await this.pool.query(
      `SELECT c.*, 
              u.first_name || ' ' || u.last_name as teacher_name,
              COUNT(DISTINCT sc.student_id) as student_count
       FROM classes c
       LEFT JOIN teachers t ON c.teacher_id = t.id
       LEFT JOIN users u ON t.user_id = u.id
       LEFT JOIN student_classes sc ON c.id = sc.class_id AND sc.status = 'active'
       GROUP BY c.id, u.first_name, u.last_name
       ORDER BY c.grade_level, c.section`,
    )

    return result.rows
  }

  async findOne(id: number) {
    const result = await this.pool.query(
      `SELECT c.*, 
              u.first_name || ' ' || u.last_name as teacher_name
       FROM classes c
       LEFT JOIN teachers t ON c.teacher_id = t.id
       LEFT JOIN users u ON t.user_id = u.id
       WHERE c.id = $1`,
      [id],
    )

    return result.rows[0]
  }

  async findByStudent(studentId: number) {
    const result = await this.pool.query(
      `SELECT c.*, 
              u.first_name || ' ' || u.last_name as teacher_name,
              sc.enrollment_date,
              sc.status as enrollment_status
       FROM classes c
       INNER JOIN student_classes sc ON c.id = sc.class_id
       LEFT JOIN teachers t ON c.teacher_id = t.id
       LEFT JOIN users u ON t.user_id = u.id
       WHERE sc.student_id = $1 AND sc.status = 'active'
       ORDER BY c.grade_level, c.section`,
      [studentId],
    )

    return result.rows
  }

  async findByTeacher(teacherId: number) {
    const result = await this.pool.query(
      `SELECT c.*, 
              COUNT(DISTINCT sc.student_id) as student_count
       FROM classes c
       LEFT JOIN student_classes sc ON c.id = sc.class_id AND sc.status = 'active'
       WHERE c.teacher_id = $1
       GROUP BY c.id
       ORDER BY c.grade_level, c.section`,
      [teacherId],
    )

    return result.rows
  }

  async create(createClassDto: any) {
    const { class_name, class_code, grade_level, section, teacher_id, room_number, capacity, academic_year } = createClassDto;

    const result = await this.pool.query(
      `INSERT INTO classes (
        class_name, class_code, grade_level, section, teacher_id, room_number, capacity, academic_year
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [class_name, class_code, grade_level, section, teacher_id, room_number, capacity, academic_year]
    );

    return result.rows[0];
  }

  async update(id: number, updateClassDto: any) {
    const { class_name, class_code, grade_level, section, teacher_id, room_number, capacity, academic_year } = updateClassDto;

    const result = await this.pool.query(
      `UPDATE classes SET
        class_name = COALESCE($1, class_name),
        class_code = COALESCE($2, class_code),
        grade_level = COALESCE($3, grade_level),
        section = COALESCE($4, section),
        teacher_id = COALESCE($5, teacher_id),
        room_number = COALESCE($6, room_number),
        capacity = COALESCE($7, capacity),
        academic_year = COALESCE($8, academic_year),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [class_name, class_code, grade_level, section, teacher_id, room_number, capacity, academic_year, id]
    );

    return result.rows[0];
  }

  async remove(id: number) {
    await this.pool.query('DELETE FROM classes WHERE id = $1', [id]);
    return { message: 'Class deleted successfully' };
  }

  async enrollStudent(classId: number, studentId: number) {
    const result = await this.pool.query(
      `INSERT INTO student_classes (student_id, class_id, enrollment_date, status)
       VALUES ($1, $2, CURRENT_DATE, 'active')
       ON CONFLICT (student_id, class_id) DO UPDATE SET status = 'active'
       RETURNING *`,
      [studentId, classId]
    );
    return result.rows[0];
  }
}
