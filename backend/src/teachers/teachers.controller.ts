import { Controller, Get, Param, UseGuards } from "@nestjs/common"
import  { TeachersService } from "./teachers.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

@Controller("teachers")
@UseGuards(JwtAuthGuard)
export class TeachersController {
  constructor(private teachersService: TeachersService) {}

  @Get()
  findAll() {
    return this.teachersService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachersService.findOne(Number.parseInt(id));
  }
}
