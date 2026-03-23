import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "postgresql://neondb_owner:npg_qKymij0Xv8Nr@ep-restless-sea-a1g120hh-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS commissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT,
        order_id TEXT,
        amount NUMERIC,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    const commissions = await sql`SELECT * FROM commissions ORDER BY created_at DESC LIMIT 50`;
    return NextResponse.json({ commissions });
  } catch (err) {
    console.error("[PiCity] 获取分佣记录失败:", err);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}
