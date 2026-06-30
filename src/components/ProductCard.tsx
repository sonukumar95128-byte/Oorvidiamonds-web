"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";

type ProductCardProps = {
  slug: string;
  image: string;
  name?: string;
  price?: string;
  badge?: "Bestseller" | "-20%";
  href?: string;
};

export function ProductCard({ slug, image, name, price, badge, href }: ProductCardProps) {
  const { items, addItem } = useCart();
  const inBag = items.some((i) => i.slug === slug);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(slug);

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-beige/70 overflow-hidden transition-all duration-300 hover:-translate-y-1 animate-fadeUp">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-beige">
        {href ? (
          <Link href={href} className="block h-full">
            <Image
              src={image}
              alt={name ?? "Jewellery product"}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        ) : (
          <Image
            src={image}
            alt={name ?? "Jewellery product"}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {badge && (
          <span
            className={
              "absolute top-2.5 left-2.5 z-10 rounded-full px-2.5 py-0.5 text-xs font-medium " +
              (badge === "Bestseller" ? "bg-brand text-gold-light" : "bg-gold text-brand")
            }
          >
            {badge}
          </span>
        )}
        <button
          onClick={() => toggleWishlist(slug)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={
            "absolute top-2.5 right-2.5 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/85 backdrop-blur-sm shadow-sm transition-colors " +
            (wishlisted ? "text-gold" : "text-ink/40 hover:text-gold")
          }
        >
          <span className="text-sm">{wishlisted ? "♥" : "♡"}</span>
        </button>
      </div>

      {/* Info + actions inside the card */}
      <div className="p-3">
        {name ? (
          href ? (
            <Link href={href}>
              <p className="text-sm text-ink line-clamp-1 hover:text-gold transition-colors leading-snug mb-1">
                {name}
              </p>
            </Link>
          ) : (
            <p className="text-sm text-ink line-clamp-1 leading-snug mb-1">{name}</p>
          )
        ) : (
          <div className="h-3 w-3/4 rounded bg-beige mb-1" />
        )}

        {price ? (
          <p className="text-sm font-semibold text-brand mb-2.5">{price}</p>
        ) : (
          <div className="h-3 w-1/2 rounded bg-beige mb-2.5" />
        )}

        {inBag ? (
          <Link
            href="/cart"
            className="block w-full rounded-full bg-brand text-center text-xs font-medium text-gold-light py-2 transition-colors hover:bg-brand-secondary whitespace-nowrap"
          >
            Added ✓ View Bag
          </Link>
        ) : (
          <button
            onClick={() => addItem(slug)}
            className="w-full rounded-full border border-brand text-xs font-medium text-brand py-2 transition-colors hover:bg-brand hover:text-gold-light whitespace-nowrap"
          >
            Add to Bag
          </button>
        )}
      </div>
    </div>
  );
}
