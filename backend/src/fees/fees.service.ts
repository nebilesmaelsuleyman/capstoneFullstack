import { Injectable } from "@nestjs/common"
import  { DatabaseService } from "../database/database.service"

@Injectable()
export class FeesService {
  constructor(private readonly db: DatabaseService) {}

  async recordPayment(data: any) {
    const { studentId, feeStructureId, amountPaid, paymentDate, paymentMethod, transactionId, remarks } = data

    // Generate receipt number
    const receiptNumber = `REC${Date.now()}${Math.floor(Math.random() * 1000)}`

    const query = `
      INSERT INTO fee_payments 
      (student_id, fee_structure_id, amount_paid, payment_date, payment_method, transaction_id, receipt_number, remarks)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `

    const result = await this.db.query(query, [
      studentId,
      feeStructureId,
      amountPaid,
      paymentDate || new Date().toISOString().split("T")[0],
      paymentMethod,
      transactionId,
      receiptNumber,
      remarks,
    ])
    return result.rows[0]
  }

  async getStudentFees(studentId: number) {
    const query = `
      SELECT 
        fs.*,
        COALESCE(SUM(fp.amount_paid), 0) as total_paid,
        fs.amount - COALESCE(SUM(fp.amount_paid), 0) as balance
      FROM students s
      JOIN fee_structure fs ON s.grade_level = fs.grade_level
      LEFT JOIN fee_payments fp ON s.id = fp.student_id AND fs.id = fp.fee_structure_id
      WHERE s.id = $1
      GROUP BY fs.id
      ORDER BY fs.due_date
    `

    const result = await this.db.query(query, [studentId])
    return result.rows
  }

  async getStudentPayments(studentId: number) {
    const query = `
      SELECT 
        fp.*,
        fs.fee_type,
        fs.amount as total_amount
      FROM fee_payments fp
      JOIN fee_structure fs ON fp.fee_structure_id = fs.id
      WHERE fp.student_id = $1
      ORDER BY fp.payment_date DESC
    `

    const result = await this.db.query(query, [studentId])
    return result.rows
  }

  async getFeeStructure(gradeLevel?: number) {
    let query = "SELECT * FROM fee_structure WHERE 1=1"
    const params: any[] = []

    if (gradeLevel) {
      params.push(gradeLevel)
      query += ` AND grade_level = $${params.length}`
    }

    query += " ORDER BY grade_level, fee_type"

    const result = await this.db.query(query, params)
    return result.rows
  }
}
