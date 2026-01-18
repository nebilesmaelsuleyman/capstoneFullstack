import { Module } from "@nestjs/common"
import { ClassesController } from "./classes.controller"
import { ClassesService } from "./classes.service"
import { DatabaseModule } from "../database/database.module";
import { RedisModule } from "../redis/redis.module";
@Module({
 
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}
