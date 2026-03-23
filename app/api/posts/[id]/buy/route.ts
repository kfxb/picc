import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

const DB_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_qKymij0Xv8Nr@ep-restless-sea-a1g120hh-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DB_URL);

// POST /api/posts/[id]/buy
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { piUsername, message = "", contact = "" } = await req.json();
  if (!piUsername) return NextResponse.json({ error: "需要 Pi 账号" }, { status: 400 });

  const [row] = await sql`
    INSERT INTO buy_requests (post_id, pi_username, message, contact)
    VALUES (${Number(params.id)}, ${piUsername}, ${message}, ${contact})
    RETURNING id, pi_username AS "piUsername", message, contact,
              to_char(created_at, 'YYYY-MM-DD HH24:MI') AS "createdAt"
  `;
  return NextResponse.json(row, { status: 201 });
}
