import { Controller, Get, Post, Put, Body, Param, UseGuards, HttpException, HttpStatus } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { LibraryService } from "./library.service"

@Controller("library")
// @UseGuards(JwtAuthGuard)
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) { }

  @Get("books")
  async getBooks(query: any) {
    try {
      const result = await this.libraryService.getBooks(query)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Post("issue")
  async issueBook(@Body() body: any) {
    try {
      const result = await this.libraryService.issueBook(body)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Put("return/:issueId")
  async returnBook(@Param("issueId") issueId: number, @Body() body: any) {
    try {
      const result = await this.libraryService.returnBook(issueId, body.fineAmount)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get("student/:studentId/issues")
  async getStudentIssues(@Param("studentId") studentId: number) {
    try {
      const result = await this.libraryService.getStudentIssues(studentId)
      return { success: true, data: result }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
}
