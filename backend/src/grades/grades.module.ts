import { Module } from "@nestjs/common"
import { GradesController } from "./grades.controller"
import { GradesService } from "./grades.service"
import { DatabaseModule } from "../database/database.module"
import { RedisModule } from "../redis/redis.module"

@Module({
  imports: [DatabaseModule, RedisModule],
  controllers: [GradesController],
  providers: [GradesService],
  exports: [GradesService],
})
export class GradesModule { }
