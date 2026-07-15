import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { markGuestOrderPaid } from "@/lib/guest-orders";

export async function POST(request: NextRequest) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json({ error: "Razorpay not configured" }, { status: 503 });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Signature verified — safe to mark the order paid server-side (no client-supplied trust needed).
    if (orderId) await markGuestOrderPaid(orderId, razorpay_payment_id);

    return NextResponse.json({ ok: true, paymentId: razorpay_payment_id });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
