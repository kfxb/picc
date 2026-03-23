import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

const DB_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_qKymij0Xv8Nr@ep-restless-sea-a1g120hh-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DB_URL);

// PATCH /api/posts/[id] — update status, title, location, or increment views
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json();

  if (body.action === "approve") {
    await sql`UPDATE posts SET status = '已发布' WHERE id = ${id}`;
  } else if (body.action === "toggle") {
    await sql`
      UPDATE posts
      SET status = CASE WHEN status = '已发布' THEN '已下线' ELSE '已发布' END
      WHERE id = ${id}
    `;
  } else if (body.action === "view") {
    await sql`UPDATE posts SET views = views + 1 WHERE id = ${id}`;
  } else if (body.title !== undefined || body.location !== undefined) {
    await sql`
      UPDATE posts
      SET
        title    = COALESCE(${body.title},    title),
        location = COALESCE(${body.location}, location)
      WHERE id = ${id}
    `;
  }

  return NextResponse.json({ ok: true });
}

// DELETE /api/posts/[id]
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await sql`DELETE FROM posts WHERE id = ${Number(params.id)}`;
  return NextResponse.json({ ok: true });
}
