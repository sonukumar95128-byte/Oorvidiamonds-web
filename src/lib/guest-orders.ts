import { getPrisma } from "@/lib/prisma";

export type GuestOrder = {
  id: string;
  createdAt: string;
  status: "pending_payment" | "paid" | "cancelled";
  customerName: string;
  phone: string;
  address: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  utrNumber?: string; // payment reference — UPI UTR or Razorpay payment ID
};

export async function getGuestOrders(prisma: ReturnType<typeof getPrisma>): Promise<GuestOrder[]> {
  const row = await prisma.siteConfig.findUnique({ where: { key: "guestOrders" } });
  return (row?.value as GuestOrder[]) ?? [];
}

export async function saveGuestOrders(prisma: ReturnType<typeof getPrisma>, orders: GuestOrder[]) {
  await prisma.siteConfig.upsert({
    where: { key: "guestOrders" },
    update: { value: orders as never },
    create: { key: "guestOrders", value: orders as never },
  });
}

export async function markGuestOrderPaid(orderId: string, reference: string) {
  const prisma = getPrisma();
  const orders = await getGuestOrders(prisma);
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) return false;
  orders[idx].status = "paid";
  orders[idx].utrNumber = reference;
  await saveGuestOrders(prisma, orders);
  return true;
}
