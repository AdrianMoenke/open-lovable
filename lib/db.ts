import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  // Intentionally avoid logging the actual value; just guide the developer.
  // Throwing here fails fast on the server without exposing secrets to the client.
  throw new Error("DATABASE_URL env var is required for Postgres features.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});

export async function dbQuery<T = unknown>(
  text: string,
  params: unknown[] = [],
): Promise<{ rows: T[] }> {
  const client = await pool.connect();
  try {
    const result = await client.query<T>(text, params);
    return { rows: result.rows };
  } finally {
    client.release();
  }
}

