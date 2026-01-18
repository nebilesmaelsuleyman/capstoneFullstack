import { Injectable ,Inject } from "@nestjs/common"
import type { Pool } from "pg"

@Injectable()
export class ClassesService {
    constructor(
      @Inject("DATABASE_POOL") private readonly pool: Pool
    ) {}
  
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
}
