import { Injectable, Inject } from "@nestjs/common";
import  { Redis } from "ioredis";

@Injectable()
export class RedisService {
  constructor(
    @Inject("REDIS_CLIENT") private readonly redis: Redis
  ) {}

  async set(key: string, value: any, ttl?: number) {
    const val = typeof value === "string" ? value : JSON.stringify(value);
    if (ttl) {
      return this.redis.set(key, val, "EX", ttl);
    }
    return this.redis.set(key, val);
  }

  async get(key: string) {
    const value = await this.redis.get(key);
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  async del(key: string) {
    return this.redis.del(key);
  }
}
