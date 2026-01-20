import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service"

import { AuthController } from "./auth.controller";
import { DatabaseModule } from "../database/database.module";
import { JwtModule } from "@nestjs/jwt";
import { RolesGuard } from "./roles.guard";
import { APP_GUARD } from "@nestjs/core";
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';

import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "supersecretkey",
      signOptions: { expiresIn: "1h" },
    }),
  ],
  providers: [AuthService, LocalStrategy, RolesGuard, JwtStrategy,
    { provide: APP_GUARD, useClass: RolesGuard },], // make global guard
  controllers: [AuthController],
  exports: [AuthService, RolesGuard],
})
export class AuthModule { }
