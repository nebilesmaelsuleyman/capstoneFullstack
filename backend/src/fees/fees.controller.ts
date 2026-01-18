import { Controller, Get, Post, Param, Query, UseGuards, HttpException, HttpStatus } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import  { FeesService } from "./fees.service"

@Controller("fees")
@UseGuards(JwtAuthGuard)
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Post("payment")
  async recordPayment(body: any) {
    try {
      const result = await this.feesService.recordPayment(body)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get("student/:studentId")
  async getStudentFees(@Param("studentId") studentId: number) {
    try {
      const result = await this.feesService.getStudentFees(studentId)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get("student/:studentId/payments")
  async getStudentPayments(@Param("studentId") studentId: number) {
    try {
      const result = await this.feesService.getStudentPayments(studentId)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get("structure")
  async getFeeStructure(@Query("gradeLevel") gradeLevel?: number) {
    try {
      const result = await this.feesService.getFeeStructure(gradeLevel)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
}
