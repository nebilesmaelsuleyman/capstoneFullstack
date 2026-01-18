import { Injectable } from "@nestjs/common"
import  { DatabaseService } from "../database/database.service"
import  { RedisService } from "../redis/redis.service"

@Injectable()
export class GradesService {
  constructor(
    private readonly db: DatabaseService,
    private readonly redis: RedisService,
  ) {}

  async findByStudent(studentId: string) {
    const cacheKey = `grades:student:${studentId}`
    const cached = await this.redis.get(cacheKey)
    if (cached) return JSON.parse(cached)

    const query = `
      SELECT g.*, s.name as subject_name 
      FROM grades g
      JOIN subjects s ON g.subject_id = s.id
      WHERE g.student_id = $1
    `
    const result = await this.db.query(query, [studentId])
    const grades = result.rows
    await this.redis.set(cacheKey, JSON.stringify(grades), 600)
    return grades
  }

  async upsert(data: { student_id: string; subject_id: string; grade: number; remark?: string }) {
    const query = `
      INSERT INTO grades (student_id, subject_id, grade, remark)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (student_id, subject_id) 
      DO UPDATE SET grade = EXCLUDED.grade, remark = EXCLUDED.remark
      RETURNING *
    `
    const result = await this.db.query(query, [data.student_id, data.subject_id, data.grade, data.remark])
    await this.redis.del(`grades:student:${data.student_id}`)
    return result.rows[0]
  }
}
