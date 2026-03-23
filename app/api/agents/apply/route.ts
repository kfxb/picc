import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(
  process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_qKymij0Xv8Nr@ep-restless-sea-a1g120hh-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, city } = body;

    if (!user_id || !city) {
      return NextResponse.json({ success: false, error: "Missing user_id or city" }, { status: 400 });
    }

    // 防重复申请
    const existing = await sql`
      SELECT id FROM agent_applications WHERE user_id = ${user_id} LIMIT 1
    `;

    if (existing.length > 0) {
      return NextResponse.json({ error: "已申请过" });
    }

    await sql`
      INSERT INTO agent_applications (user_id, city)
      VALUES (${user_id}, ${city})
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PiCity] Agent apply error:", err);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
