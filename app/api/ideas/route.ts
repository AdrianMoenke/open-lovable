import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbQuery } from "@/lib/db";
import { initIdeasTable } from "@/lib/ideas-schema";

const ideaSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(800),
});

export async function GET(req: NextRequest) {
  try {
    await initIdeasTable();

    const url = new URL(req.url);
    const limitRaw = url.searchParams.get("limit");
    const offsetRaw = url.searchParams.get("offset");

    const limit = Math.min(
      Math.max(Number(limitRaw ?? "24") || 24, 1),
      100,
    );
    const offset = Math.max(Number(offsetRaw ?? "0") || 0, 0);

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
      LIMIT $1 OFFSET $2;
    `,
      [limit, offset],
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

    await initIdeasTable();

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

