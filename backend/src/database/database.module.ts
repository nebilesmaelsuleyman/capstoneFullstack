import { Module, Global } from "@nestjs/common";
import { Pool } from "pg";
import { DatabaseService } from "./database.service";

const databaseProvider = {
  provide: "DATABASE_POOL",
  useFactory: () => {
    return new Pool({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || "school_management",
      user: process.env.DB_USER || "school_admin",
      password: process.env.DB_PASSWORD || "school_secure_pass_2024",
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  },
};

@Global()
@Module({
  providers: [databaseProvider, DatabaseService],
  exports: ["DATABASE_POOL", DatabaseService],
})
export class DatabaseModule {}
