import { Controller, Get, Post, Param, Query, Body, UseGuards, HttpException, HttpStatus } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { AttendanceService } from "./attendance.service"

@Controller("attendance")
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) { }

  @Post()
  async markAttendance(@Body() body: any) {
    try {
      const result = await this.attendanceService.markAttendance(body)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Post("bulk")
  async markBulkAttendance(@Body() body: { classId: number; date: string; records: any[] }) {
    try {
      const result = await this.attendanceService.markBulkAttendance(body.classId, body.date, body.records)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Post("bulk/:classId")
  async markBulkAttendanceWithParam(
    @Param("classId") classId: string,
    @Body() body: { date: string; records: any[] }
  ) {
    try {
      const result = await this.attendanceService.markBulkAttendance(parseInt(classId), body.date, body.records)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get("student/:studentId")
  async getStudentAttendance(
    @Param("studentId") studentId: number,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    try {
      const result = await this.attendanceService.getStudentAttendance(studentId, startDate, endDate)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get("class/:classId")
  async getClassAttendance(
    @Param("classId") classId: string,
    @Query("date") date: string,
    @Query("subjectId") subjectId?: string
  ) {
    try {
      const result = await this.attendanceService.getClassAttendance(
        parseInt(classId),
        date,
        subjectId ? parseInt(subjectId) : undefined
      )
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get("statistics/:studentId")
  async getAttendanceStatistics(@Param("studentId") studentId: number) {
    try {
      const result = await this.attendanceService.getAttendanceStatistics(studentId)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
}
