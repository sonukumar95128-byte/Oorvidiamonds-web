import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/adminSession";
import { getGuestOrders, saveGuestOrders, type GuestOrder } from "@/lib/guest-orders";

export type { GuestOrder };

async function isAdmin() {
  const jar = await cookies();
  return verifyAdminToken(jar.get("admin_auth")?.value);
}

// POST /api/orders — save a new guest order (no auth needed — customer facing)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prisma = getPrisma();
    const orders = await getGuestOrders(prisma);

    const newOrder: GuestOrder = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "pending_payment",
      customerName: body.customerName ?? "",
      phone: body.phone ?? "",
      address: body.address ?? "",
      items: body.items ?? [],
      total: body.total ?? 0,
    };

    orders.unshift(newOrder); // newest first
    // Keep max 500 orders
    if (orders.length > 500) orders.splice(500);

    await saveGuestOrders(prisma, orders);
    return NextResponse.json({ ok: true, orderId: newOrder.id });
  } catch (err) {
    console.error("Order save error:", err);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}

// PATCH /api/orders — update order status or UTR (admin only)
export async function PATCH(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const { id, status, utrNumber } = await request.json();
    const prisma = getPrisma();
    const orders = await getGuestOrders(prisma);
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (status) orders[idx].status = status;
    if (utrNumber !== undefined) orders[idx].utrNumber = utrNumber;
    await saveGuestOrders(prisma, orders);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

// GET /api/orders — admin only
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const prisma = getPrisma();
    const orders = await getGuestOrders(prisma);
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
