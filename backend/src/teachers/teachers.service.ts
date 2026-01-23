import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class TeachersService {
  constructor(@Inject("DATABASE_POOL") private readonly pool: Pool) { }

  async findAll() {
    const result = await this.pool.query(`
    SELECT 
      t.id,
      u.first_name AS "firstName",
      u.last_name AS "lastName",
      u.email,
      t.department,
      t.specialization AS "subjects", -- Fetching from the specialization column
      u.is_active AS "status"
    FROM teachers t
    JOIN users u ON t.user_id = u.id -- This is fine
    -- IMPORTANT: Do NOT use INNER JOIN on class_subjects here. 
    -- If a teacher doesn't have a class assigned yet, INNER JOIN will hide them.
    ORDER BY t.created_at DESC
  `);
    return result.rows;
  }

  async create(teacherData: any) {
    const client = await this.pool.connect();
    console.log("create service is triggered")
    try {
      await client.query("BEGIN");

      // 1. Handle the User Table
      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, role, first_name, last_name)
       VALUES ($1, $2, 'teacher', $3, $4) RETURNING id`,
        [
          teacherData.email,
          "$2b$10$defaultHash", // Use bcrypt.hash in production
          teacherData.firstName,
          teacherData.lastName,
        ],
      );
      const userId = userResult.rows[0].id;

      // 2. Handle the Subjects Table
      // We assume teacherData.subjects is a string like "Math" or "Physics"
      // We use an UPSERT (Insert or ignore if exists) to get the subject ID
      const subjectResult = await client.query(
        `INSERT INTO subjects (subject_name, subject_code)
       VALUES ($1, $2)
       ON CONFLICT (subject_code) DO UPDATE SET subject_name = EXCLUDED.subject_name
       RETURNING id`,
        [
          teacherData.subjects,
          `SUB-${teacherData.subjects.toUpperCase().replace(/\s/g, '')}`
        ]
      );
      const subjectId = subjectResult.rows[0].id;

      // 3. Handle the Teachers Table
      const teacherResult = await client.query(
        `INSERT INTO teachers (user_id, employee_id, department, specialization)
       VALUES ($1, $2, $3, $4) RETURNING id`,
        [
          userId,
          `EMP-${Date.now()}`,
          teacherData.department,
          teacherData.subjects, // Keep the string name in specialization for easy view
        ]
      );
      const teacherId = teacherResult.rows[0].id;

      // 4. Link them in class_subjects (Optional but recommended)
      // If your frontend doesn't provide a class_id yet, you might skip this 
      // or use a default/null class_id if allowed.
      /*
      await client.query(
        `INSERT INTO class_subjects (subject_id, teacher_id) VALUES ($1, $2)`,
        [subjectId, teacherId]
      );
      */

      await client.query("COMMIT");

      const result = {
        success: true,
        data: {
          id: teacherId,
          firstName: teacherData.firstName,
          lastName: teacherData.lastName,
          email: teacherData.email,
          department: teacherData.department,
          subjects: teacherData.subjects || "", // String for frontend mapping
          status: "Active"
        }
      };
      console.log("finalresult", result);
      return result
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Teacher creation error:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  async update(id: string, teacherData: any) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");

      const teacherCheck = await client.query('SELECT user_id FROM teachers WHERE id = $1', [id]);
      const userId = teacherCheck.rows[0].user_id;

      // 1. Update User (Name and Email)
      await client.query(
        `UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4`,
        [teacherData.firstName, teacherData.lastName, teacherData.email, userId]
      );

      // 2. Update Teacher (Department and Subjects)
      await client.query(
        `UPDATE teachers SET department = $1, specialization = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3`,
        [teacherData.department, teacherData.subjects, id]
      );

      await client.query("COMMIT");

      // 3. RETURN THE FULL OBJECT so the frontend has data to show
      return {
        success: true,
        data: {
          id: id,
          firstName: teacherData.firstName,
          lastName: teacherData.lastName,
          email: teacherData.email,
          department: teacherData.department,
          subjects: teacherData.subjects || "",
          status: "Active"
        }
      };
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

  async findOne(id: number) {
    const result = await this.pool.query(
      `SELECT 
      t.id,
      t.user_id AS "userId",
      u.first_name AS "firstName",
      u.last_name AS "lastName",
      u.email,
      u.phone,
      t.employee_id AS "employeeId",
      t.department,
      t.specialization AS "subjects",
      t.qualification,
      t.address,
      t.date_of_birth AS "dateOfBirth",
      u.is_active AS "status"
     FROM teachers t
     JOIN users u ON t.user_id = u.id
     WHERE t.id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new HttpException('Teacher not found', 404);
    }

    return result.rows[0];
  }

  async findByUserId(userId: number) {
    const result = await this.pool.query(
      `SELECT 
        t.id,
        t.user_id AS "userId",
        u.first_name AS "firstName",
        u.last_name AS "lastName",
        u.email,
        u.phone,
        t.employee_id AS "employeeId",
        t.department,
        t.specialization AS "subjects",
        t.qualification,
        t.address,
        t.date_of_birth AS "dateOfBirth",
        u.is_active AS "status"
       FROM teachers t
       JOIN users u ON t.user_id = u.id
       WHERE t.user_id = $1`,
      [userId],
    );

    if (result.rows.length === 0) {
      throw new HttpException('Teacher not found', 404);
    }

    return result.rows[0];
  }

}


