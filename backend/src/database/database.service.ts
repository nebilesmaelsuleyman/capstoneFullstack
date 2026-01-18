import { Injectable, Inject } from "@nestjs/common";
import type { Pool, PoolClient, QueryResult } from "pg";

@Injectable()
export class DatabaseService {
  constructor(
    @Inject("DATABASE_POOL") private readonly pool: Pool
  ) {}

  async query(text: string, params?: any[]): Promise<QueryResult<any>> {
    return this.pool.query(text, params);
  }

  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }
}
