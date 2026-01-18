import { Module } from "@nestjs/common"
import { SubjectsController } from "./subjects.controller"
import { SubjectsService } from "./subjects.service"
 import { DatabaseModule } from "../database/database.module";
import { RedisModule } from "src/redis/redis.module";
import { AuthModule } from "../auth/auth.module"; 

@Module({
   imports: [DatabaseModule, RedisModule,AuthModule],
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}
