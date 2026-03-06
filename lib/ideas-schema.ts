import { dbQuery } from "@/lib/db";

let initPromise: Promise<void> | null = null;

export async function initIdeasTable() {
  if (!initPromise) {
    initPromise = dbQuery(
      `
      CREATE TABLE IF NOT EXISTS ideas (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_ideas_created_at
        ON ideas (created_at DESC);
    `,
    ).then(() => undefined);
  }

  return initPromise;
}

