import { Injectable, Inject,HttpException } from "@nestjs/common";
import  { Pool } from "pg";

@Injectable()
export class StudentsService {
  constructor(
    @Inject("DATABASE_POOL") private readonly pool: Pool
  ) {}

  async findAll(page = 1, limit = 10, search = "") {
    const offset = (page - 1) * limit;

    let query = `
      SELECT s.*, u.email, u.first_name, u.last_name, u.phone, u.is_active
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      query += ` AND (u.first_name ILIKE $${params.length + 1} OR u.last_name ILIKE $${params.length + 1} OR s.student_id ILIKE $${params.length + 1})`;
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
      `SELECT s.*, u.email, u.first_name, u.last_name, u.phone, u.is_active, u.avatar_url
       FROM students s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = $1`,
      [id],
    );
    
    return result.rows[0];
  }

  async create(studentData: any) {
    const client = await this.pool.connect();
    console.log("crate service triggerd")
    console.log("Creating student with data:", studentData);  
    try {
      await client.query("BEGIN");
       const generateStudentId=`STU-${Date.now()}`
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
          studentData.studentId  ?? generateStudentId,
          studentData.dateOfBirth ?? null,
          studentData.gender ?? null,
          studentData.address ?? null,
          studentData.parentName ?? null,
          studentData.parentPhone ?? null,
           studentData.parentEmail ?? null,
          studentData.gradeLevel ?? null,
        ],
      );
     
      await client.query("COMMIT");
      console.log('student created successfully',studentResult.rows[0]);
     return {
  success: true,
  data: studentResult.rows[0],
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
    const result = await this.pool.query(
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
        studentData.gradeLevel,
        id,
      ],
    );

    return result.rows[0];
  }

  async delete(id: number) {
    await this.pool.query("DELETE FROM students WHERE id = $1", [id]);
    return { message: "Student deleted successfully" };
  }
}
