import { Injectable ,Inject } from "@nestjs/common"
import type { Pool } from "pg"

@Injectable()
export class TeachersService {
  

    constructor(
      @Inject("DATABASE_POOL") private readonly pool: Pool
    ) {}

  async findAll() {
    const result = await this.pool.query(
      `SELECT t.*, u.email, u.first_name, u.last_name, u.phone, u.is_active
       FROM teachers t
       JOIN users u ON t.user_id = u.id
       ORDER BY t.created_at DESC`,
    )

    return result.rows
  }

  async findOne(id: number) {
    const result = await this.pool.query(
      `SELECT t.*, u.email, u.first_name, u.last_name, u.phone, u.is_active
       FROM teachers t
       JOIN users u ON t.user_id = u.id
       WHERE t.id = $1`,
      [id],
    )

    return result.rows[0]
  }
}
