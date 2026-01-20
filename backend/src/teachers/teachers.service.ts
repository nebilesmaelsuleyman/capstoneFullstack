import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class TeachersService {
  constructor(@Inject("DATABASE_POOL") private readonly pool: Pool) {}

  async findAll(search = "") {
    let query = `
      SELECT 
        t.id,
        u.first_name AS "firstName",
        u.last_name AS "lastName",
        u.email,
        t.department,
        t.specialization AS "subjects", -- Mapping specialization to "subjects" for your frontend
        u.is_active AS "status"
      FROM teachers t
      JOIN users u ON t.user_id = u.id
    `;

    const params: any[] = [];
    if (search) {
      query += ` WHERE (u.first_name ILIKE $1 OR u.last_name ILIKE $1 OR u.email ILIKE $1)`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY t.created_at DESC`;
    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async create(teacherData: any) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Create User
      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, role, first_name, last_name)
         VALUES ($1, $2, 'teacher', $3, $4) RETURNING id`,
        [
          teacherData.email,
          "$2b$10$defaultHash", // In production: bcrypt.hash(password)
          teacherData.firstName,
          teacherData.lastName,
        ],
      );
      const userId = userResult.rows[0].id;

      // 2. Create Teacher
      const teacherResult = await client.query(
        `INSERT INTO teachers (user_id, employee_id, department, specialization)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [
          userId,
          `EMP-${Date.now()}`,
          teacherData.department,
          teacherData.subjects, // Storing "Math, Science" string into specialization
        ],
      );

      await client.query("COMMIT");

      return {
        success: true,
        data: {
          id: teacherResult.rows[0].id,
          ...teacherData,
          status: "Active"
        }
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new HttpException(error.message, 500);
    } finally {
      client.release();
    }
  }

  async update(id: number, teacherData: any) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");

      const teacherCheck = await client.query('SELECT user_id FROM teachers WHERE id = $1', [id]);
      const userId = teacherCheck.rows[0].user_id;

      // Update User
      await client.query(
        `UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4`,
        [teacherData.firstName, teacherData.lastName, teacherData.email, userId]
      );

      // Update Teacher
      await client.query(
        `UPDATE teachers SET department = $1, specialization = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3`,
        [teacherData.department, teacherData.subjects, id]
      );

      await client.query("COMMIT");
      return { success: true };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async remove(id: number) {
    // Because of ON DELETE CASCADE in your schema, deleting the user deletes the teacher record
    const teacherCheck = await this.pool.query('SELECT user_id FROM teachers WHERE id = $1', [id]);
    if (teacherCheck.rows.length > 0) {
      await this.pool.query('DELETE FROM users WHERE id = $1', [teacherCheck.rows[0].user_id]);
      return { success: true };
    }
  }
}
