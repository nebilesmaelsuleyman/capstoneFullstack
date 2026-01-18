import { Module, Global } from "@nestjs/common";
import Redis from "ioredis";
import { RedisService } from "./redis.service";

const redisProvider = {
  provide: "REDIS_CLIENT",
  useFactory: () => {
    const redis = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    redis.on("error", (err) => {
      console.error("Redis Client Error", err);
    });

    redis.on("connect", () => {
      console.log("✅ Connected to Redis");
    });

    return redis;
  },
};

@Global()
@Module({
  providers: [redisProvider, RedisService],
  exports: ["REDIS_CLIENT", RedisService],
})
export class RedisModule {}
