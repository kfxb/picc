import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "postgresql://neondb_owner:npg_qKymij0Xv8Nr@ep-restless-sea-a1g120hh-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS agents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT,
        city TEXT,
        commission_rate NUMERIC DEFAULT 0.05
      )
    `;
    const agents = await sql`SELECT * FROM agents ORDER BY city`;
    return NextResponse.json({ agents });
  } catch (err) {
    console.error("[PiCity] 获取代理列表失败:", err);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}
