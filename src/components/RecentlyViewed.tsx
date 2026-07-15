"use client";

import { ProductCard } from "@/components/ProductCard";
import { categoryToSlug, dummyProducts } from "@/lib/dummy-images";
import { useRecentlyViewed } from "@/lib/recently-viewed-store";
import { useAdmin } from "@/lib/admin-store";

export function RecentlyViewed({ excludeSlug }: { excludeSlug?: string }) {
  const slugs = useRecentlyViewed(excludeSlug);
  const { products } = useAdmin();

  const items = slugs
    .map((slug) => products.find((p) => p.slug === slug) ?? dummyProducts.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .slice(0, 4);

  if (items.length === 0) return null;

  return (
    <div className="mt-12">
      <p className="text-xs tracking-[3px] uppercase text-gold mb-2">Continue browsing</p>
      <h2 className="font-heading text-2xl text-brand mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6">
        {items.map((p) => (
          <ProductCard
            key={p.slug}
            slug={p.slug}
            image={p.image}
            hoverImage={p.gallery && p.gallery.length > 1 ? p.gallery[p.gallery.length - 1] : undefined}
            name={p.name}
            price={p.price}
            href={`/jewellery/${categoryToSlug(p.category)}/${p.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
