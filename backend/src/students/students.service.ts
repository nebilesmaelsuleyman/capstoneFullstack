import { Injectable, Inject, HttpException } from "@nestjs/common";
import { Pool } from "pg";

@Injectable()
export class StudentsService {
  constructor(
    @Inject("DATABASE_POOL") private readonly pool: Pool
  ) { }

  async findAll(page = 1, limit = 10, search = "") {
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
      s.id,
      u.first_name AS "firstName",
      u.last_name AS "lastName",
      u.email,
      s.grade_level AS "grade",
      
      CASE WHEN u.is_active = true THEN 'Active' ELSE 'Inactive' END AS "status"
    FROM students s
    JOIN users u ON s.user_id = u.id
    `;
    const params: any[] = [];

    if (search) {
      query += ` WHERE (u.first_name ILIKE $1 OR u.last_name ILIKE $1 OR u.email ILIKE $1)`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY s.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await this.pool.query(query, params);

    const countQuery = `SELECT COUNT(*) FROM students s JOIN users u ON s.user_id = u.id`;
    const countResult = await this.pool.query(countQuery);

    return {
      data: result.rows,
      total: Number(countResult.rows[0].count),
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const result = await this.pool.query(
      `SELECT s.*, u.email, u.first_name AS "firstName", u.last_name AS "lastName", u.phone, u.is_active AS "status", u.avatar_url
       FROM students s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = $1`,
      [id],
    );

    return result.rows[0];
  }

  async findByUserId(userId: number) {
    const result = await this.pool.query(
      `SELECT s.*, u.email, u.first_name AS "firstName", u.last_name AS "lastName", u.phone, u.is_active AS "status", u.avatar_url
       FROM students s
       JOIN users u ON s.user_id = u.id
       WHERE s.user_id = $1`,
      [userId],
    );

    return result.rows[0];
  }

  async findByClass(classId: number) {
    const result = await this.pool.query(
      `SELECT 
        s.id,
        s.student_id,
        u.first_name AS "firstName",
        u.last_name AS "lastName",
        u.email,
        s.grade_level AS "gradeLevel"
       FROM students s
       JOIN users u ON s.user_id = u.id
       JOIN student_classes sc ON s.id = sc.student_id
       WHERE sc.class_id = $1 AND sc.status = 'active'
       ORDER BY u.last_name, u.first_name`,
      [classId],
    );

    return result.rows;
  }

  async create(studentData: any) {
    const client = await this.pool.connect();
    console.log("crate service triggerd")
    console.log("Creating student with data:", studentData);
    try {
      await client.query("BEGIN");
      const generateStudentId = `STU-${Date.now()}`
      // Create user
      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, role, first_name, last_name, phone)
         VALUES ($1, $2, 'student', $3, $4, $5) RETURNING id`,
        [
          studentData.email,
          "$2b$10$defaultHashedPassword", // Should be properly hashed
          studentData.firstName,
          studentData.lastName,
          studentData.phone || null,
        ],
      );

      const userId = userResult.rows[0].id;

      // Create student
      const studentResult = await client.query(
        `INSERT INTO students (user_id, student_id, date_of_birth, gender, address, parent_name, parent_phone, parent_email, grade_level)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          userId,
          studentData.studentId ?? generateStudentId,
          studentData.dateOfBirth ?? null,
          studentData.gender ?? null,
          studentData.address ?? null,
          studentData.parentName ?? null,
          studentData.parentPhone ?? null,
          studentData.parentEmail ?? null,
          studentData.grade,
        ]
      );

      // capture the inserted student row
      const studentRow = studentResult.rows[0];

      await client.query("COMMIT");

      const responseData = {
        // Use the ID from the student table for the unique key
        id: studentRow.id,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email,
        grade: studentData.grade,
        className: studentData.className ?? "N/A",
        status: "Active"
      };

      console.log('Final formatted response for frontend:', responseData);

      return {
        success: true,
        data: responseData,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("DATABASE ERROR:", error);
      throw new HttpException(
        { success: false, error: 'Failed to create student' },
        500,
      );
    } finally {
      client.release();
    }
  }

  async update(id: number, studentData: any) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Get the user_id associated with this student first
      const studentInfo = await client.query('SELECT user_id FROM students WHERE id = $1', [id]);
      if (studentInfo.rows.length === 0) throw new Error("Student not found");
      const userId = studentInfo.rows[0].user_id;

      // 2. Update the USERS table (First Name, Last Name, Email)
      await client.query(
        `UPDATE users 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           email = COALESCE($3, email),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
        [
          studentData.firstName,
          studentData.lastName,
          studentData.email,
          userId
        ]
      );

      // 3. Update the STUDENTS table
      // Note: changed studentData.gradeLel to studentData.grade
      const result = await client.query(
        `UPDATE students 
       SET date_of_birth = COALESCE($1, date_of_birth),
           gender = COALESCE($2, gender),
           address = COALESCE($3, address),
           parent_name = COALESCE($4, parent_name),
           parent_phone = COALESCE($5, parent_phone),
           parent_email = COALESCE($6, parent_email),
           grade_level = COALESCE($7, grade_level),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
        [
          studentData.dateOfBirth,
          studentData.gender,
          studentData.address,
          studentData.parentName,
          studentData.parentPhone,
          studentData.parentEmail,
          studentData.grade,
          id,
        ],
      );

      await client.query("COMMIT");

      // 4. Return the combined data so the frontend doesn't show "undefined"
      return {
        id: result.rows[0].id,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email,
        grade: studentData.grade,
        status: "Active" // Or fetch actual status from user table
      };

    } catch (error) {
      await client.query("ROLLBACK");
      console.error("UPDATE ERROR:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(id: number) {
    await this.pool.query("DELETE FROM students WHERE id = $1", [id]);
    return { message: "Student deleted successfully" };
  }
}
