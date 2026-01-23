import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from "@nestjs/common"
import { ClassesService } from "./classes.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { CreateClassDto } from "./dto/create-class.dto"
import { UpdateClassDto } from "./dto/update-class.dto"

@Controller("classes")
// @UseGuards(JwtAuthGuard)
export class ClassesController {
  constructor(private classesService: ClassesService) { }

  @Get()
  findAll() {
    return this.classesService.findAll()
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: string) {
    return this.classesService.findByStudent(Number.parseInt(studentId));
  }

  @Get('teacher/:teacherId')
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.classesService.findByTeacher(Number.parseInt(teacherId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(Number.parseInt(id));
  }

  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    console.log('Class create endpoint hit', createClassDto);
    return this.classesService.create(createClassDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(Number.parseInt(id), updateClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classesService.remove(Number.parseInt(id));
  }
}
