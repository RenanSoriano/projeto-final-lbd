import { Pool } from "pg";

const defaultDatabaseUrl = "postgres://postgres:postgres@localhost:5432/f1db";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? defaultDatabaseUrl
});

export async function closeDatabasePool() {
  await pool.end();
}
