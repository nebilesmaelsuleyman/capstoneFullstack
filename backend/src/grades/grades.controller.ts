import { Controller, Get, Post, UseGuards } from "@nestjs/common"
import  { GradesService } from "./grades.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

@Controller("grades")
@UseGuards(JwtAuthGuard)
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get("student/:id")
  findByStudent(id: string) {
    return this.gradesService.findByStudent(id)
  }

  @Post()
  upsert(data: any) {
    return this.gradesService.upsert(data)
  }
}
