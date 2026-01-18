import { Injectable } from "@nestjs/common"
import  { DatabaseService } from "../database/database.service"

@Injectable()
export class AnnouncementsService {
  constructor(private readonly db: DatabaseService) {}

  async createAnnouncement(data: any) {
    const { title, content, announcementType, targetAudience, postedBy, priority, expiresAt } = data

    const query = `
      INSERT INTO announcements (title, content, announcement_type, target_audience, posted_by, priority, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `

    const result = await this.db.query(query, [
      title,
      content,
      announcementType,
      targetAudience,
      postedBy,
      priority || "medium",
      expiresAt || null,
    ])
    return result.rows[0]
  }

  async getAnnouncements(filters: any) {
    let query = `
      SELECT 
        a.*,
        u.first_name as posted_by_first_name,
        u.last_name as posted_by_last_name
      FROM announcements a
      LEFT JOIN users u ON a.posted_by = u.id
      WHERE a.is_active = true
    `
    const params: any[] = []

    if (filters.type) {
      params.push(filters.type)
      query += ` AND a.announcement_type = $${params.length}`
    }
    if (filters.audience) {
      params.push(filters.audience)
      query += ` AND (a.target_audience = $${params.length} OR a.target_audience = 'all')`
    }

    query += " AND (a.expires_at IS NULL OR a.expires_at > CURRENT_TIMESTAMP)"
    query += " ORDER BY a.priority DESC, a.posted_at DESC"

    const result = await this.db.query(query, params)
    return result.rows
  }

  async getAnnouncementById(id: number) {
    const query = `
      SELECT 
        a.*,
        u.first_name as posted_by_first_name,
        u.last_name as posted_by_last_name
      FROM announcements a
      LEFT JOIN users u ON a.posted_by = u.id
      WHERE a.id = $1
    `

    const result = await this.db.query(query, [id])
    return result.rows[0]
  }

  async deleteAnnouncement(id: number) {
    const query = "UPDATE announcements SET is_active = false WHERE id = $1"
    await this.db.query(query, [id])
  }
}
