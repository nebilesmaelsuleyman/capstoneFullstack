import { Injectable } from "@nestjs/common"
import  { DatabaseService } from "../database/database.service"

@Injectable()
export class LibraryService {
  constructor(private readonly db: DatabaseService) {}

  async getBooks(filters: any) {
    let query = "SELECT * FROM library_books WHERE 1=1"
    const params: any[] = []

    if (filters.search) {
      params.push(`%${filters.search}%`)
      query += ` AND (title ILIKE $${params.length} OR author ILIKE $${params.length} OR isbn ILIKE $${params.length})`
    }
    if (filters.category) {
      params.push(filters.category)
      query += ` AND category = $${params.length}`
    }

    query += " ORDER BY title"

    const result = await this.db.query(query, params)
    return result.rows
  }

  async issueBook(data: any) {
    const { bookId, studentId, dueDate } = data

    const client = await this.db.getClient()
    try {
      await client.query("BEGIN")

      // Check if book is available
      const bookCheck = await client.query("SELECT available_copies FROM library_books WHERE id = $1", [bookId])
      if (bookCheck.rows[0].available_copies <= 0) {
        throw new Error("Book is not available")
      }

      // Issue book
      const issueQuery = `
        INSERT INTO book_issues (book_id, student_id, due_date)
        VALUES ($1, $2, $3)
        RETURNING *
      `
      const issueResult = await client.query(issueQuery, [bookId, studentId, dueDate])

      // Update available copies
      await client.query("UPDATE library_books SET available_copies = available_copies - 1 WHERE id = $1", [bookId])

      await client.query("COMMIT")
      return issueResult.rows[0]
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  }

  async returnBook(issueId: number, fineAmount = 0) {
    const client = await this.db.getClient()
    try {
      await client.query("BEGIN")

      // Get book issue details
      const issueQuery = "SELECT book_id FROM book_issues WHERE id = $1"
      const issueResult = await client.query(issueQuery, [issueId])

      // Update issue record
      const updateQuery = `
        UPDATE book_issues 
        SET return_date = CURRENT_DATE, status = 'returned', fine_amount = $1
        WHERE id = $2
        RETURNING *
      `
      const updateResult = await client.query(updateQuery, [fineAmount, issueId])

      // Update available copies
      await client.query("UPDATE library_books SET available_copies = available_copies + 1 WHERE id = $1", [
        issueResult.rows[0].book_id,
      ])

      await client.query("COMMIT")
      return updateResult.rows[0]
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  }

  async getStudentIssues(studentId: number) {
    const query = `
      SELECT 
        bi.*,
        lb.title,
        lb.author,
        lb.isbn
      FROM book_issues bi
      JOIN library_books lb ON bi.book_id = lb.id
      WHERE bi.student_id = $1
      ORDER BY bi.issue_date DESC
    `

    const result = await this.db.query(query, [studentId])
    return result.rows
  }
}
