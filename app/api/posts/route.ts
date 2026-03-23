import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

const DB_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_qKymij0Xv8Nr@ep-restless-sea-a1g120hh-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DB_URL);

// GET /api/posts — fetch all posts
export async function GET() {
  const rows = await sql`
    SELECT
      id,
      kind,
      kind_label   AS "kindLabel",
      kind_class   AS "kindClass",
      title,
      location,
      price,
      condition,
      description,
      status,
      views,
      pi_username  AS "piUsername",
      to_char(created_at, 'YYYY-MM-DD HH24:MI') AS "createdAt"
    FROM posts
    ORDER BY created_at DESC
  `;
  return NextResponse.json(rows);
}

// POST /api/posts — create a new post
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { kind, kindLabel, kindClass, title, location, price, condition, description, piUsername = "" } = body;

  const [row] = await sql`
    INSERT INTO posts (kind, kind_label, kind_class, title, location, price, condition, description, pi_username, status)
    VALUES (${kind}, ${kindLabel}, ${kindClass}, ${title}, ${location}, ${price}, ${condition}, ${description}, ${piUsername}, '审核中')
    RETURNING
      id,
      kind,
      kind_label   AS "kindLabel",
      kind_class   AS "kindClass",
      title,
      location,
      price,
      condition,
      description,
      status,
      views,
      pi_username  AS "piUsername",
      to_char(created_at, 'YYYY-MM-DD HH24:MI') AS "createdAt"
  `;
  return NextResponse.json(row, { status: 201 });
}
