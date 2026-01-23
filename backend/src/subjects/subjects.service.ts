import { Injectable, Inject } from "@nestjs/common"
import { DatabaseService } from "../database/database.service"
import { RedisService } from "../redis/redis.service"
import type { Pool } from "pg"

@Injectable()
export class SubjectsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly redis: RedisService,

  ) { }

  async findAll() {
    const cacheKey = "subjects:all";

    const cached = await this.redis.get(cacheKey);

    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (err) {
        // 🔥 cache is corrupted → delete it
        await this.redis.del(cacheKey);
      }
    }

    const result = await this.db.query(
      "SELECT * FROM subjects ORDER BY subject_name ASC"
    );

    const subjects = result.rows;

    await this.redis.set(
      cacheKey,
      JSON.stringify(subjects),

      3600
    );

    return subjects;
  }



  async create(data: { name: string; code: string; credits: number; teacher_id: string }) {
    const query = `
      INSERT INTO subjects (subject_name , subject_code, credits, teacher_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
    const result = await this.db.query(query, [data.name, data.code, data.credits, data.teacher_id])
    await this.redis.del("subjects:all")
    return result.rows[0]
  }
}
