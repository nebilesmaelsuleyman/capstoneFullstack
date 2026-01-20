import { Controller, Post, Body, UseGuards, Req } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LocalAuthGuard } from "./local-auth.guard"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Req() req) {
    return this.authService.login(req.user)
  }

  @Post('register')
  async register(@Body() userData: any) {
    return this.authService.register(userData);
  }
}
