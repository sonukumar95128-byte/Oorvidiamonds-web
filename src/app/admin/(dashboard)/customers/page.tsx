"use client";

import { useEffect, useMemo, useState } from "react";
import { formatRupee } from "@/lib/dummy-images";
import type { GuestOrder } from "@/app/api/orders/route";

export default function AdminCustomersPage() {
  const [orders, setOrders] = useState<GuestOrder[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]));
  }, []);

  const customers = useMemo(() => {
    const map = new Map<
      string,
      { name: string; phone: string; orderCount: number; totalSpent: number; lastOrderDate: string }
    >();

    for (const o of orders) {
      const key = o.phone;
      const existing = map.get(key);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += o.total;
        if (o.createdAt > existing.lastOrderDate) existing.lastOrderDate = o.createdAt;
      } else {
        map.set(key, {
          name: o.customerName,
          phone: o.phone,
          orderCount: 1,
          totalSpent: o.total,
          lastOrderDate: o.createdAt,
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  return (
    <div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or phone..."
        className="mb-4 w-full max-w-xs rounded-lg border border-beige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
      />

      <div className="rounded-xl border border-beige bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-beige/50 text-left text-xs text-ink/50">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Orders</th>
              <th className="px-4 py-2">Total spent</th>
              <th className="px-4 py-2">Last order</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.phone} className="border-t border-beige">
                <td className="px-4 py-2 text-ink">{c.name}</td>
                <td className="px-4 py-2 text-ink/70">{c.phone}</td>
                <td className="px-4 py-2 text-ink/70">{c.orderCount}</td>
                <td className="px-4 py-2 font-medium text-brand">{formatRupee(c.totalSpent)}</td>
                <td className="px-4 py-2 text-ink/60">{new Date(c.lastOrderDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink/40">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-ink/40">
        Derived from order history — once customer accounts (login) are built, this will show real registered users.
      </p>
    </div>
  );
}
