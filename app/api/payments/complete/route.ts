import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { verifyPiPayment } from "@/lib/pi";

const DB_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_qKymij0Xv8Nr@ep-restless-sea-a1g120hh-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DB_URL);
const PI_API_KEY = process.env.PI_API_KEY || "5bgasd6qkquvljhzyenudcuxuy1rflpavnafhyykynbegecosyuwuziseh2u2peb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { paymentId, txid, order } = body;

    // 1. 校验参数
    if (!paymentId || !order?.id) {
      return NextResponse.json({ error: "参数错误" }, { status: 400 });
    }

    // 2. 查询订单（防伪造）
    const orders = await sql`SELECT * FROM orders WHERE id = ${order.id} LIMIT 1`;
    const orderData = orders[0];

    if (!orderData) {
      return NextResponse.json({ error: "订单不存在" });
    }

    // 3. 订单必须是 pending 状态
    if (orderData.status !== "pending") {
      return NextResponse.json({ success: true });
    }

    // 4. 调用 Pi 官方接口验证
    const piPayment = await verifyPiPayment(paymentId);

    // 5. 校验 payment metadata 绑定关系（防混单/盗单）
    if (piPayment.metadata?.orderId !== order.id) {
      return NextResponse.json({ error: "订单不匹配" }, { status: 400 });
    }

    // 6. 验证支付状态
    if (piPayment.status !== "COMPLETED") {
      // 调用 Pi API 完成支付
      await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
        method: "POST",
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ txid }),
      });
    }

    // 7. 验证金额（防篡改）
    if (Number(piPayment.amount) !== Number(orderData.amount)) {
      return NextResponse.json({ error: "金额不匹配" }, { status: 400 });
    }

    // 8. 更新订单状态
    await sql`
      UPDATE orders SET status = 'paid', tx_hash = ${txid} WHERE id = ${order.id}
    `;

    // 记录支付
    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        payment_id TEXT UNIQUE NOT NULL,
        txid TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      INSERT INTO payments (payment_id, txid)
      VALUES (${paymentId}, ${txid})
      ON CONFLICT (payment_id) DO UPDATE SET txid = ${txid}
    `;

    // 分佣逻辑（安全版）
    const posts = await sql`SELECT * FROM posts WHERE id = ${orderData.post_id} LIMIT 1`;
    const post = posts[0];

    if (post?.agent_id) {
      const agents = await sql`SELECT * FROM agents WHERE id = ${post.agent_id} LIMIT 1`;
      const agent = agents[0];

      if (agent) {
        // 防重复分佣
        const existing = await sql`
          SELECT id FROM commissions WHERE order_id = ${order.id} LIMIT 1
        `;

        if (existing.length === 0) {
          const commission = orderData.amount * agent.commission_rate;
          await sql`
            INSERT INTO commissions (user_id, order_id, amount, type)
            VALUES (${agent.user_id}, ${order.id}, ${commission}, 'agent')
          `;
          console.log("[PiCity] 分佣成功:", commission);
        }
      }
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("[PiCity] Payment completion error:", err);
    return NextResponse.json({ error: "服务器错误" });
  }
}
