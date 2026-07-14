"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";

type ProductCardProps = {
  slug: string;
  image: string;
  hoverImage?: string;
  name?: string;
  spec?: string;
  price?: string;
  badge?: "Bestseller" | "-20%" | "New";
  href?: string;
};

export function ProductCard({ slug, image, hoverImage, name, spec, price, badge, href }: ProductCardProps) {
  const { items, addItem } = useCart();
  const inBag = items.some((i) => i.slug === slug);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(slug);

  return (
    <div className="group bg-white border border-beige transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(64,8,13,0.14)] animate-fadeUp">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-beige">
        {href ? (
          <Link href={href} className="block h-full">
            <img
              src={image}
              alt={name ?? "Jewellery product"}
              loading="lazy"
              className={
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 " +
                (hoverImage ? "group-hover:opacity-0" : "group-hover:scale-105 transition-transform")
              }
            />
            {hoverImage && (
              <img
                src={hoverImage}
                alt={name ?? "Jewellery product"}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </Link>
        ) : (
          <>
            <img
              src={image}
              alt={name ?? "Jewellery product"}
              loading="lazy"
              className={
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 " +
                (hoverImage ? "group-hover:opacity-0" : "group-hover:scale-105 transition-transform")
              }
            />
            {hoverImage && (
              <img
                src={hoverImage}
                alt={name ?? "Jewellery product"}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </>
        )}
        {badge && (
          <span
            className={
              "absolute top-3 left-3 z-10 px-3 py-[5px] text-[10.5px] tracking-[2px] uppercase " +
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
            "absolute top-3 right-3 z-10 grid h-8 w-8 place-items-center bg-white/90 transition-colors " +
            (wishlisted ? "text-gold" : "text-ink/40 hover:text-gold")
          }
        >
          <span className="text-base leading-none">{wishlisted ? "♥" : "♡"}</span>
        </button>
      </div>

      {/* Info */}
      <div className="px-5 pt-5 pb-[22px] text-center">
        {name ? (
          href ? (
            <Link href={href}>
              <p className="font-heading text-xl text-ink line-clamp-1 hover:text-gold transition-colors">{name}</p>
            </Link>
          ) : (
            <p className="font-heading text-xl text-ink line-clamp-1">{name}</p>
          )
        ) : (
          <div className="h-5 w-2/3 mx-auto bg-beige" />
        )}

        {spec && <p className="text-[12.5px] tracking-[0.5px] text-ink/50 mt-1.5">{spec}</p>}

        {price ? (
          <p className="text-base font-medium text-brand mt-3">{price}</p>
        ) : (
          <div className="h-4 w-1/3 mx-auto bg-beige mt-3" />
        )}

        {inBag ? (
          <Link
            href="/cart"
            className="mt-4 block w-full border border-brand bg-brand text-center text-xs tracking-[2.5px] uppercase text-gold-light py-3 transition-colors hover:bg-brand-secondary"
          >
            Added ✓ View Cart
          </Link>
        ) : (
          <button
            onClick={() => addItem(slug)}
            className="mt-4 w-full border border-brand text-xs tracking-[2.5px] uppercase text-brand py-3 transition-colors hover:bg-brand hover:text-gold-light"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
