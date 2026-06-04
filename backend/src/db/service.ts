import type { QueryResultRow } from "pg";
import { pool } from "./client.js";

export async function query<T extends QueryResultRow>(
  sql: string,
  params: unknown[] = []
) {
  return pool.query<T>(sql, params);
}

export async function pingDatabase() {
  const result = await query<{ now: string }>("select now()::text as now");

  return result.rows[0];
}
