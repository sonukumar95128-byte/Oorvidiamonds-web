"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { useCompare, MAX_COMPARE } from "@/lib/compare-store";
import { categoryToSlug, dummyProducts } from "@/lib/dummy-images";

export default function ComparePage() {
  const { slugs, removeFromCompare, clearCompare } = useCompare();
  const { items: cartItems, addItem } = useCart();

  const products = slugs
    .map((slug) => dummyProducts.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p);

  const attributeKeys = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.attributes ?? {})))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-heading text-3xl text-brand">
          Compare Products <span className="text-base text-ink/40">({products.length}/{MAX_COMPARE})</span>
        </h1>
        {products.length > 0 && (
          <button
            onClick={clearCompare}
            className="text-xs tracking-[1.5px] uppercase text-ink/50 hover:text-brand transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-ink/60 mb-4">You haven&apos;t added any products to compare yet.</p>
          <Link
            href="/jewellery"
            className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[640px]">
            <tbody>
              <tr>
                <td className="w-40 shrink-0" />
                {products.map((p) => (
                  <td key={p.slug} className="align-top px-4 py-3 border-b border-beige w-[220px]">
                    <div className="relative">
                      <button
                        onClick={() => removeFromCompare(p.slug)}
                        aria-label="Remove from compare"
                        className="absolute -top-1 -right-1 z-10 h-6 w-6 grid place-items-center bg-white border border-beige text-ink/40 hover:text-brand transition-colors"
                      >
                        ✕
                      </button>
                      <Link href={`/jewellery/${categoryToSlug(p.category)}/${p.slug}`} className="block">
                        <div className="relative aspect-square overflow-hidden bg-beige mb-3">
                          <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                        </div>
                        <p className="font-heading text-lg text-brand line-clamp-2 hover:text-gold transition-colors">{p.name}</p>
                      </Link>
                      <p className="text-base font-medium text-brand mt-1">{p.price}</p>
                      <div className="text-gold text-xs mt-1">
                        {"★".repeat(Math.round(p.rating))}{"☆".repeat(5 - Math.round(p.rating))}
                        <span className="text-ink/40 ml-1">({p.reviewCount})</span>
                      </div>
                      {cartItems.some((i) => i.slug === p.slug) ? (
                        <Link
                          href="/cart"
                          className="mt-3 block w-full border border-brand bg-brand text-center text-[11px] tracking-[2px] uppercase text-gold-light py-2.5 transition-colors hover:bg-brand-secondary"
                        >
                          Added ✓ View Cart
                        </Link>
                      ) : (
                        <button
                          onClick={() => addItem(p.slug)}
                          className="mt-3 w-full border border-brand text-[11px] tracking-[2px] uppercase text-brand py-2.5 transition-colors hover:bg-brand hover:text-gold-light"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="px-4 py-2.5 border-b border-beige text-xs tracking-[1.5px] uppercase text-ink/50 bg-[#F4ECDC]">SKU</td>
                {products.map((p) => (
                  <td key={p.slug} className="px-4 py-2.5 border-b border-beige text-sm text-ink/80 bg-[#F4ECDC]">{p.sku ?? "—"}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-2.5 border-b border-beige text-xs tracking-[1.5px] uppercase text-ink/50">Category</td>
                {products.map((p) => (
                  <td key={p.slug} className="px-4 py-2.5 border-b border-beige text-sm text-ink/80">{p.category}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-2.5 border-b border-beige text-xs tracking-[1.5px] uppercase text-ink/50 bg-[#F4ECDC]">In Stock</td>
                {products.map((p) => (
                  <td key={p.slug} className="px-4 py-2.5 border-b border-beige text-sm text-ink/80 bg-[#F4ECDC]">{p.stock > 0 ? `Yes (${p.stock})` : "Out of stock"}</td>
                ))}
              </tr>
              {attributeKeys.map((key, i) => (
                <tr key={key}>
                  <td className={"px-4 py-2.5 border-b border-beige text-xs tracking-[1.5px] uppercase text-ink/50 " + (i % 2 === 0 ? "" : "bg-[#F4ECDC]")}>{key}</td>
                  {products.map((p) => (
                    <td key={p.slug} className={"px-4 py-2.5 border-b border-beige text-sm text-ink/80 " + (i % 2 === 0 ? "" : "bg-[#F4ECDC]")}>
                      {p.attributes?.[key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
