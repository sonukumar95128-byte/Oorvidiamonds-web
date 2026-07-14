"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { categoryToSlug, dummyProducts, formatRupee, priceToNumber } from "@/lib/dummy-images";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items: cart, removeItem } = useCart();

  const items = cart
    .map((line) => {
      const product = dummyProducts.find((p) => p.slug === line.slug);
      return product ? { ...line, product } : null;
    })
    .filter((i): i is NonNullable<typeof i> => !!i);

  const subtotal = items.reduce((sum, i) => sum + priceToNumber(i.product.price) * i.quantity, 0);

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-[99] bg-brand/50 animate-fadeIn" />
      <div className="fixed top-0 right-0 bottom-0 z-[100] w-full sm:w-[420px] bg-ivory shadow-2xl flex flex-col animate-fadeUp" style={{ animationDuration: "0.35s" }}>
        <div className="flex items-center justify-between px-7 py-6 border-b border-beige shrink-0">
          <h2 className="font-heading italic text-2xl text-brand">Your Cart</h2>
          <button onClick={onClose} aria-label="Close cart" className="text-2xl leading-none text-brand hover:text-gold">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-auto px-7 py-5 flex flex-col gap-4">
          {items.length === 0 ? (
            <p className="text-center text-ink/50 font-light mt-14">
              Your cart is empty.
              <br />
              Discover something beautiful.
            </p>
          ) : (
            items.map((item) => (
              <div key={item.slug} className="flex items-center gap-3.5 border border-beige bg-white p-3.5">
                <Link href={`/jewellery/${categoryToSlug(item.product.category)}/${item.product.slug}`} className="relative h-14 w-14 shrink-0 overflow-hidden bg-beige">
                  <Image src={item.product.image} alt={item.product.name} fill sizes="56px" className="object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-lg text-ink truncate">{item.product.name}</p>
                  <p className="text-xs text-ink/50 mt-0.5">Qty {item.quantity}</p>
                </div>
                <div className="flex items-center gap-3.5 shrink-0">
                  <span className="text-sm font-medium text-brand">{item.product.price}</span>
                  <button onClick={() => removeItem(item.slug)} aria-label="Remove" className="text-gold hover:text-brand">
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-7 py-5 border-t border-beige shrink-0">
          <div className="flex items-center justify-between text-sm mb-4">
            <span className="text-ink/60">Subtotal</span>
            <span className="font-medium text-brand">{formatRupee(subtotal)}</span>
          </div>
          <Link
            href="/checkout"
            onClick={onClose}
            className="block w-full text-center bg-brand text-gold-light py-4 text-xs tracking-[3px] uppercase hover:bg-brand-secondary transition-colors"
          >
            Checkout
          </Link>
        </div>
      </div>
    </>
  );
}
