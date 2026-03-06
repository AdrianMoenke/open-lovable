import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { initIdeasTable } from "@/lib/ideas-schema";

export async function GET() {
  try {
    await initIdeasTable();

    const { rows } = await dbQuery<{
      total: string;
      latest_created_at: string | null;
    }>(
      `
      SELECT
        COUNT(*)::bigint AS total,
        MAX(created_at) AS latest_created_at
      FROM ideas;
    `,
    );

    const row = rows[0] ?? { total: "0", latest_created_at: null };

    return NextResponse.json({
      total: Number(row.total),
      latestCreatedAt: row.latest_created_at,
    });
  } catch (error) {
    console.error("Ideas stats GET error:", error);
    return NextResponse.json(
      { error: "Failed to load idea stats." },
      { status: 500 },
    );
  }
}

