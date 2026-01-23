import { Controller, Get, Post, Body, Param, Query, UseGuards, HttpException, HttpStatus } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { ExamsService } from "./exams.service"

@Controller("exams")
// @UseGuards(JwtAuthGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) { }

  @Post()
  async createExam(@Body() body: any) {
    try {
      const result = await this.examsService.createExam(body)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get()
  async getAllExams(@Query() query: any) {
    try {
      const result = await this.examsService.getAllExams(query)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get(":id")
  async getExamById(@Param("id") id: number) {
    try {
      const result = await this.examsService.getExamById(id)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Post(":id/results")
  async submitExamResult(@Param("id") id: number, @Body() body: any) {
    try {
      const result = await this.examsService.submitExamResult(id, body)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get("student/:studentId/results")
  async getStudentResults(@Param("studentId") studentId: number) {
    try {
      const result = await this.examsService.getStudentResults(studentId)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get(":id/results")
  async getExamResults(@Param("id") id: number) {
    try {
      const result = await this.examsService.getExamResults(id)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
}
