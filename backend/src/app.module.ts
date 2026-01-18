import { Module } from "@nestjs/common"
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler"
import { APP_GUARD } from "@nestjs/core"
import { AuthModule } from "./auth/auth.module"
import { StudentsModule } from "./students/students.module"
import { TeachersModule } from "./teachers/teachers.module"
import { ClassesModule } from "./classes/classes.module"
import { SubjectsModule } from "./subjects/subjects.module"
import { GradesModule } from "./grades/grades.module"
import { AttendanceModule } from "./attendance/attendance.module"
import { DatabaseModule } from "./database/database.module"
import { RedisModule } from "./redis/redis.module"
import { ExamsModule } from "./exams/exams.module"
import { TimetableModule } from "./timetable/timetable.module"
import { AnnouncementsModule } from "./announcements/announcements.module"
import { FeesModule } from "./fees/fees.module"
import { LibraryModule } from "./library/library.module"

@Module({
  imports: [
    // DDoS Protection & Rate Limiting
    ThrottlerModule.forRoot([
      {
        name: "short",
        ttl: 1000,
        limit: 3, // 3 requests per second
      },
      {
        name: "medium",
        ttl: 10000,
        limit: 20, // 20 requests per 10 seconds
      },
      {
        name: "long",
        ttl: 60000,
        limit: 100, // 100 requests per minute
      },
    ]),
    DatabaseModule,
    RedisModule,
    AuthModule,
    StudentsModule,
    TeachersModule,
    ClassesModule,
    SubjectsModule,
    GradesModule,
    AttendanceModule,
    ExamsModule,
    TimetableModule,
    AnnouncementsModule,
    FeesModule,
    LibraryModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
