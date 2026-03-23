import { NextRequest, NextResponse } from "next/server";

const PI_API_KEY = process.env.PI_API_KEY || "5bgasd6qkquvljhzyenudcuxuy1rflpavnafhyykynbegecosyuwuziseh2u2peb";

// Server-side payment approval — called by Pi SDK onReadyForServerApproval
export async function POST(req: NextRequest) {
  try {
    const { paymentId } = await req.json();
    if (!paymentId) {
      return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
    }

    // Approve payment via Pi Platform API
    const piResponse = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Key ${PI_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!piResponse.ok) {
      const err = await piResponse.text();
      console.error("[PiCity] Pi API approval failed:", err);
      return NextResponse.json({ error: "Pi API approval failed" }, { status: 500 });
    }

    console.log("[PiCity] Payment approved:", paymentId);
    return NextResponse.json({ approved: true, paymentId });
  } catch (err) {
    console.error("[PiCity] Payment approval error:", err);
    return NextResponse.json({ error: "Approval failed" }, { status: 500 });
  }
}
