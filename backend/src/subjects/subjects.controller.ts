import { Controller, Get, Post, UseGuards } from "@nestjs/common"
import { SubjectsService } from "./subjects.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { RolesGuard } from "../auth/roles.guard"
import { Roles } from '../auth/roles.decorator'

@Controller("subjects")
// @UseGuards(JwtAuthGuard, RolesGuard)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) { }

  @Get()
  findAll() {
    return this.subjectsService.findAll()
  }

  @Post()
  @Roles("admin")
  create(data: { name: string; code: string; credits: number; teacher_id: string }) {
    return this.subjectsService.create(data)
  }
}
