import { Controller, Get, Post, Delete, UseGuards, HttpException, HttpStatus, Body, Query, Param } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { AnnouncementsService } from "./announcements.service"

@Controller("announcements")
// @UseGuards(JwtAuthGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) { }

  @Post()
  async createAnnouncement(@Body() body: any) {
    try {
      const result = await this.announcementsService.createAnnouncement(body)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get()
  async getAnnouncements(@Query() query: any) {
    try {
      const result = await this.announcementsService.getAnnouncements(query)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get(":id")
  async getAnnouncementById(@Param("id") id: number) {
    try {
      const result = await this.announcementsService.getAnnouncementById(id)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Delete(":id")
  async deleteAnnouncement(@Param("id") id: number) {
    try {
      await this.announcementsService.deleteAnnouncement(id)
      return { success: true }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
}
