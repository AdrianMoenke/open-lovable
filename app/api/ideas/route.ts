import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbQuery } from "@/lib/db";

const ideaSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(800),
});

async function ensureTable() {
  await dbQuery(
    `
    CREATE TABLE IF NOT EXISTS ideas (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
  );
}

export async function GET() {
  try {
    await ensureTable();

    const { rows } = await dbQuery<{
      id: number;
      title: string;
      description: string;
      created_at: string;
    }>(
      `
      SELECT id, title, description, created_at
      FROM ideas
      ORDER BY created_at DESC
      LIMIT 24;
    `,
    );

    return NextResponse.json({ ideas: rows });
  } catch (error) {
    console.error("Ideas GET error:", error);
    return NextResponse.json(
      { error: "Failed to load ideas." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ideaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input.", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    await ensureTable();

    const { title, description } = parsed.data;

    const { rows } = await dbQuery<{
      id: number;
      title: string;
      description: string;
      created_at: string;
    }>(
      `
      INSERT INTO ideas (title, description)
      VALUES ($1, $2)
      RETURNING id, title, description, created_at;
    `,
      [title, description],
    );

    return NextResponse.json(
      { idea: rows[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("Ideas POST error:", error);
    return NextResponse.json(
      { error: "Failed to submit idea." },
      { status: 500 },
    );
  }
}

