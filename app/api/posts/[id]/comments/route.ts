import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

const DB_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_qKymij0Xv8Nr@ep-restless-sea-a1g120hh-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DB_URL);

// GET /api/posts/[id]/comments
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const rows = await sql`
    SELECT
      id,
      pi_username AS "piUsername",
      content,
      to_char(created_at, 'YYYY-MM-DD HH24:MI') AS "createdAt"
    FROM comments
    WHERE post_id = ${Number(params.id)}
    ORDER BY created_at ASC
  `;
  return NextResponse.json(rows);
}

// POST /api/posts/[id]/comments
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { piUsername = "匿名用户", content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "内容不能为空" }, { status: 400 });

  const [row] = await sql`
    INSERT INTO comments (post_id, pi_username, content)
    VALUES (${Number(params.id)}, ${piUsername}, ${content})
    RETURNING id, pi_username AS "piUsername", content,
              to_char(created_at, 'YYYY-MM-DD HH24:MI') AS "createdAt"
  `;
  return NextResponse.json(row, { status: 201 });
}
