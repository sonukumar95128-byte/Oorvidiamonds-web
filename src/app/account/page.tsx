"use client";

import Link from "next/link";
import { useUser } from "@/lib/user-store";
import { useWishlist } from "@/lib/wishlist-store";
import { useCart } from "@/lib/cart-store";

export default function AccountOverviewPage() {
  const { user, orders } = useUser();
  const { slugs: wishlistSlugs } = useWishlist();
  const { items: cartItems } = useCart();

  const stats = [
    { label: "Orders", value: orders.length, href: "/account/orders", icon: "📦" },
    { label: "Wishlist", value: wishlistSlugs.length, href: "/wishlist", icon: "♡" },
    { label: "In Bag", value: cartItems.length, href: "/cart", icon: "🛍" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-brand">Hello, {user?.name.split(" ")[0]} 👋</h1>
        <p className="text-sm text-ink/50 mt-1">Member since {user?.createdAt}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-2xl border border-beige p-5 text-center hover:border-gold hover:shadow-sm transition-all"
          >
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-2xl font-semibold text-brand">{s.value}</p>
            <p className="text-xs text-ink/50 mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-beige p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-brand">Recent Orders</h2>
          <Link href="/account/orders" className="text-xs text-gold hover:text-brand transition-colors">View all →</Link>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-3xl mb-2">📦</p>
            <p className="text-sm text-ink/50 mb-3">No orders yet</p>
            <Link
              href="/jewellery"
              className="inline-block rounded-full bg-brand px-5 py-2 text-xs font-medium text-gold-light hover:bg-brand-secondary transition-colors"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-beige last:border-0">
                <div>
                  <p className="text-sm font-medium text-ink">#{order.id}</p>
                  <p className="text-xs text-ink/50">{order.date} · {order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-brand">{order.total}</p>
                  <span className={
                    "text-xs rounded-full px-2 py-0.5 " +
                    (order.status === "Delivered" ? "bg-green-50 text-green-700" :
                     order.status === "Cancelled" ? "bg-red-50 text-red-700" :
                     "bg-gold-light/30 text-brand")
                  }>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/account/profile" className="bg-white rounded-2xl border border-beige p-5 hover:border-gold hover:shadow-sm transition-all">
          <p className="text-lg mb-1">✎</p>
          <p className="text-sm font-medium text-brand">Edit Profile</p>
          <p className="text-xs text-ink/50 mt-0.5">Update name, phone, password</p>
        </Link>
        <Link href="/account/addresses" className="bg-white rounded-2xl border border-beige p-5 hover:border-gold hover:shadow-sm transition-all">
          <p className="text-lg mb-1">📍</p>
          <p className="text-sm font-medium text-brand">Addresses</p>
          <p className="text-xs text-ink/50 mt-0.5">Manage delivery addresses</p>
        </Link>
      </div>
    </div>
  );
}
