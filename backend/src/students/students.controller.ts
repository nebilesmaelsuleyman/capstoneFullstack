import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from "@nestjs/common"
import { StudentsService } from "./students.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

@Controller("students")
// @UseGuards(JwtAuthGuard)
export class StudentsController {
  constructor(private studentsService: StudentsService) { }

  @Get()
  findAll(page = "1", limit = "10", search = "") {
    return this.studentsService.findAll(Number.parseInt(page), Number.parseInt(limit), search)
  }

  @Get('by-user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.studentsService.findByUserId(Number.parseInt(userId));
  }

  @Get('by-class/:classId')
  findByClass(@Param('classId') classId: string) {
    return this.studentsService.findByClass(Number.parseInt(classId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(Number.parseInt(id));
  }

  @Post()
  create(@Body() studentData: any) {
    console.log('crate student controller triggered')
    return this.studentsService.create(studentData);
  }

  @Put(":id")
  update(@Param('id') id: string, @Body() studentData: any) {
    return this.studentsService.update(Number.parseInt(id), studentData)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.studentsService.delete(Number.parseInt(id));
  }
}
