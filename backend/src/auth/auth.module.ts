import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { DatabaseModule } from "../database/database.module";
import { JwtModule } from "@nestjs/jwt";
import { RolesGuard } from "./roles.guard";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "supersecretkey",
      signOptions: { expiresIn: "1h" },
    }),
  ],
  providers: [AuthService, RolesGuard,
    { provide: APP_GUARD, useClass: RolesGuard }], // make global guard],
  controllers: [AuthController],
  exports: [AuthService, RolesGuard],
})
export class AuthModule {}
