import { Controller, Get, Param, UseGuards } from "@nestjs/common"
import  { ClassesService } from "./classes.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

@Controller("classes")
@UseGuards(JwtAuthGuard)
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @Get()
  findAll() {
    return this.classesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(Number.parseInt(id));
  }
}
