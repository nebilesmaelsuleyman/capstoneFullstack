import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, HttpException, HttpStatus } from "@nestjs/common"
import { GradesService } from "./grades.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

@Controller("grades")
// @UseGuards(JwtAuthGuard)
export class GradesController {
  constructor(private readonly gradesService: GradesService) { }

  @Get("student/:id")
  async findByStudent(@Param('id') id: string) {
    try {
      const result = await this.gradesService.findByStudent(id)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get("class/:classId/subject/:subjectId")
  async getGradesByClassAndSubject(
    @Param('classId') classId: string,
    @Param('subjectId') subjectId: string
  ) {
    try {
      const result = await this.gradesService.getGradesByClassAndSubject(classId, subjectId)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Post()
  async create(@Body() data: any) {
    try {
      const result = await this.gradesService.create(data)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Put(":id")
  async update(@Param('id') id: string, @Body() data: any) {
    try {
      const result = await this.gradesService.update(id, data)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
}
