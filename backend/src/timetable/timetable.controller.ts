import { Controller, Get, Post, Delete, Param, UseGuards, HttpException, HttpStatus } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import  { TimetableService } from "./timetable.service"

@Controller("timetable")
@UseGuards(JwtAuthGuard)
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Post()
  async createTimetableEntry(body: any) {
    try {
      const result = await this.timetableService.createTimetableEntry(body)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get("class/:classId")
  async getClassTimetable(@Param("classId") classId: number) {
    try {
      const result = await this.timetableService.getClassTimetable(classId)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get("teacher/:teacherId")
  async getTeacherTimetable(@Param("teacherId") teacherId: number) {
    try {
      const result = await this.timetableService.getTeacherTimetable(teacherId)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Delete(":id")
  async deleteTimetableEntry(@Param("id") id: number) {
    try {
      await this.timetableService.deleteTimetableEntry(id)
      return { success: true }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
}
