"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/lib/user-store";

const statusColor: Record<string, string> = {
  Processing: "bg-blue-50 text-blue-700",
  Packed: "bg-yellow-50 text-yellow-700",
  Shipped: "bg-purple-50 text-purple-700",
  Delivered: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-700",
};

export default function OrdersPage() {
  const { orders } = useUser();

  if (orders.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="font-heading italic text-3xl text-brand">My Orders</h1>
        <div className="bg-white rounded-2xl border border-beige p-12 text-center">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-sm font-medium text-brand mb-1">No orders yet</p>
          <p className="text-xs text-ink/50 mb-5">Once you place an order, it will appear here.</p>
          <Link
            href="/jewellery"
            className="inline-block rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
          >
            Shop now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-heading italic text-3xl text-brand">My Orders</h1>

      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-2xl border border-beige overflow-hidden">
          {/* Order header */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-beige bg-beige/20">
            <div>
              <p className="text-xs text-ink/50">Order ID</p>
              <p className="text-sm font-medium text-brand">#{order.id}</p>
            </div>
            <div>
              <p className="text-xs text-ink/50">Date</p>
              <p className="text-sm text-ink/80">{order.date}</p>
            </div>
            <div>
              <p className="text-xs text-ink/50">Total</p>
              <p className="text-sm font-semibold text-brand">{order.total}</p>
            </div>
            <span className={`text-xs rounded-full px-3 py-1 font-medium ${statusColor[order.status] ?? "bg-beige text-brand"}`}>
              {order.status}
            </span>
          </div>

          {/* Items */}
          <div className="px-6 py-4 space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-beige border border-beige shrink-0">
                  <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink line-clamp-1">{item.name}</p>
                  <p className="text-xs text-ink/50">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-brand shrink-0">{item.price}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="px-6 py-3 border-t border-beige flex gap-3">
            {order.status === "Delivered" && (
              <button className="text-xs text-gold hover:text-brand transition-colors">Write a review</button>
            )}
            {(order.status === "Processing" || order.status === "Packed") && (
              <button className="text-xs text-red-500 hover:text-red-700 transition-colors">Cancel order</button>
            )}
            <button className="text-xs text-ink/50 hover:text-brand transition-colors ml-auto">Need help?</button>
          </div>
        </div>
      ))}
    </div>
  );
}
