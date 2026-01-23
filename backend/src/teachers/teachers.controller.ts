import { Controller, Get, Post, Delete, Put, Param, UseGuards, Body } from "@nestjs/common"
import { TeachersService } from "./teachers.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

@Controller("teachers")
// @UseGuards(JwtAuthGuard)
export class TeachersController {
  constructor(private teachersService: TeachersService) { }

  @Get()
  findAll() {
    return this.teachersService.findAll()
  }

  @Get('by-user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.teachersService.findByUserId(Number.parseInt(userId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachersService.findOne(Number.parseInt(id));
  }
  @Post()
  create(@Body() teacherData: any) {
    return this.teachersService.create(teacherData);
  }
  @Put(':id')
  updateTeacher(@Body() teacherData: any, @Param("id") id: string) {
    return this.teachersService.update(id, teacherData)

  }
  @Delete(":id")
  deleteTeacher(@Param("id") id: string) {
    return this.teachersService.remove(Number.parseInt(id))
  }
}

