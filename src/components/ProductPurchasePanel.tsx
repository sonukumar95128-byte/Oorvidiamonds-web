"use client";

import Link from "next/link";
import { useState } from "react";
import {
  colorOptions,
  formatRupee,
  getCoupons,
  getPriceBreakup,
  getSizeOptions,
  purityOptions,
  type Category,
} from "@/lib/dummy-images";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { SizeGuideModal } from "@/components/SizeGuideModal";

type ProductPurchasePanelProps = {
  slug: string;
  name: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviewCount: number;
  category: Category;
  description: string;
  attributes?: Record<string, string>;
};

function discountPercent(price: string, originalPrice?: string): number | null {
  if (!originalPrice) return null;
  const p = Number(price.replace(/[^0-9]/g, ""));
  const o = Number(originalPrice.replace(/[^0-9]/g, ""));
  if (!o || o <= p) return null;
  return Math.round(((o - p) / o) * 100);
}

export function ProductPurchasePanel({
  slug,
  name,
  price,
  originalPrice,
  rating,
  reviewCount,
  category,
  description,
  attributes,
}: ProductPurchasePanelProps) {
  const { items, addItem } = useCart();
  const inBag = items.some((i) => i.slug === slug);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(slug);
  const [color, setColor] = useState(colorOptions[2].label);
  const [purity, setPurity] = useState(purityOptions[0]);
  const sizeOptions = getSizeOptions(category);
  const [size, setSize] = useState(sizeOptions[0]);
  const [pincode, setPincode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [openAcc, setOpenAcc] = useState(0);

  const discount = discountPercent(price, originalPrice);
  const breakup = getPriceBreakup(price);
  const coupons = getCoupons(price);

  const accordions = [
    {
      title: "Product Details",
      body:
        attributes && Object.keys(attributes).length > 0 ? (
          <dl className="space-y-1.5">
            {Object.entries(attributes).map(([k, v]) => (
              <div key={k} className="flex gap-1.5">
                <dt className="font-medium text-brand/80">{k}:</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p>{description}</p>
        ),
    },
    {
      title: "Price Breakup",
      body: (
        <div className="-mx-0.5">
          <table className="w-full text-[13.5px]">
            <tbody>
              {[
                [purity, breakup.gold],
                ["Diamond", breakup.diamond],
                ["Other Stones", breakup.otherStones],
                ["Making Charge", breakup.making],
                ["GST", breakup.gst],
              ].map(([label, value]) => (
                <tr key={label} className="border-b border-beige/70">
                  <td className="py-1.5 pr-2">{label}</td>
                  <td className="py-1.5 text-right">{formatRupee(value as number)}</td>
                </tr>
              ))}
              <tr>
                <td className="pt-2 font-medium text-brand">Total</td>
                <td className="pt-2 text-right font-medium text-brand">{formatRupee(breakup.total)}</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-xs text-ink/40">Estimated price — actual price may differ as per exact weights.</p>
        </div>
      ),
    },
    {
      title: "Shipping & Returns",
      body: (
        <p>
          Free insured shipping across India in 3–7 working days.
          <br />
          15-day easy returns and lifetime exchange at full diamond value.
        </p>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3.5 text-[13.5px] mb-5">
        <span className="flex items-center gap-1 text-gold text-sm">
          {"★".repeat(Math.round(rating))}
          {"☆".repeat(5 - Math.round(rating))}
        </span>
        <span className="text-ink/50">{rating.toFixed(1)} · {reviewCount} reviews</span>
        <span className="text-ink/30">·</span>
        <span className="text-[#1F7A45]">In stock</span>
      </div>

      <div className="flex items-baseline gap-3.5 flex-wrap">
        <span className="font-sans text-[32px] font-medium text-brand">{price}</span>
        {originalPrice && <span className="text-ink/40 line-through text-lg">{originalPrice}</span>}
        {discount && (
          <span className="text-xs tracking-[1px] uppercase text-[#1F7A45]">{discount}% off on making charges</span>
        )}
      </div>
      <p className="text-[13px] text-ink/50 mt-1.5 mb-7">Inclusive of all taxes · Price breakup available below</p>

      {/* Coupons */}
      {coupons.length > 0 && (
        <div className="mb-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {coupons.map((c) => (
            <div key={c.code} className="rounded-lg border border-gold/40 bg-gold-light/10 p-3">
              <p className="text-xs font-medium text-brand mb-1">Special offer</p>
              <p className="text-sm text-ink/80">
                Pay <span className="font-semibold text-brand">{formatRupee(breakup.total - c.discountInPaise)}</span> at checkout
              </p>
              <p className="text-xs text-ink/50 mt-1">{c.label}</p>
              <button
                onClick={() => setAppliedCoupon(appliedCoupon === c.code ? null : c.code)}
                className={
                  "mt-2 rounded-full px-3 py-1 text-xs font-medium transition-colors " +
                  (appliedCoupon === c.code ? "bg-brand text-gold-light" : "bg-gold text-brand hover:bg-gold-light")
                }
              >
                {appliedCoupon === c.code ? "Applied ✓" : `Apply ${c.code}`}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Metal */}
      <div className="text-xs tracking-[2px] uppercase text-brand mb-3">Metal</div>
      <div className="flex flex-wrap gap-3 mb-7">
        {colorOptions.map((c) => (
          <button
            key={c.label}
            onClick={() => setColor(c.label)}
            className={
              "flex items-center gap-2.5 rounded-full px-[18px] py-[10px] text-[13.5px] border transition-colors " +
              (color === c.label ? "bg-brand border-brand text-gold-light" : "bg-white border-[#D8C6A4] text-ink/80 hover:border-brand")
            }
          >
            <span className="h-3.5 w-3.5 rounded-full border border-black/15" style={{ background: c.swatch }} />
            {purity} {c.label} Gold
          </button>
        ))}
      </div>

      {/* Ring size */}
      {sizeOptions.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs tracking-[2px] uppercase text-brand">Ring Size</span>
            <button onClick={() => setShowSizeGuide(true)} className="text-[13px] text-gold border-b border-[#D8C6A4] hover:text-brand transition-colors">
              Size guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2.5 mb-7">
            {sizeOptions.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={
                  "min-w-[46px] h-[46px] rounded-lg text-sm border transition-colors " +
                  (size === s ? "bg-brand border-brand text-gold-light" : "bg-white border-[#D8C6A4] text-ink/80 hover:border-brand")
                }
              >
                {s}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Purity — extra variant beyond the design's spec, kept for real product flexibility */}
      <div className="mb-7">
        <p className="text-xs tracking-[2px] uppercase text-brand mb-3">Purity</p>
        <div className="flex gap-2">
          {purityOptions.map((p) => (
            <button
              key={p}
              onClick={() => setPurity(p)}
              className={
                "rounded-full border px-4 py-1.5 text-[13.5px] transition-colors " +
                (purity === p ? "border-brand bg-brand text-gold-light" : "border-[#D8C6A4] text-ink/70 hover:border-brand")
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3.5 mb-3.5">
        {inBag ? (
          <Link
            href="/cart"
            className="flex-1 text-center rounded-lg bg-brand px-6 py-[17px] text-[13.5px] tracking-[3px] uppercase text-gold-light hover:bg-brand-secondary transition-colors"
          >
            Added ✓ View Cart
          </Link>
        ) : (
          <button
            onClick={() => addItem(slug)}
            className="flex-1 rounded-lg bg-brand px-6 py-[17px] text-[13.5px] tracking-[3px] uppercase text-gold-light hover:bg-brand-secondary transition-colors"
          >
            Add to Cart
          </button>
        )}
        <Link
          href="/checkout"
          onClick={() => !inBag && addItem(slug)}
          className="flex-1 text-center rounded-lg bg-gold px-6 py-[17px] text-[13.5px] tracking-[3px] uppercase font-medium text-brand hover:bg-gold-light transition-colors"
        >
          Buy Now
        </Link>
        <button
          onClick={() => toggleWishlist(slug)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={
            "grid h-[54px] w-[54px] shrink-0 place-items-center rounded-lg border transition-colors " +
            (wishlisted ? "border-gold text-gold bg-gold-light/20" : "border-[#D8C6A4] text-ink/60 hover:border-brand hover:text-brand")
          }
        >
          {wishlisted ? "♥" : "♡"}
        </button>
      </div>

      {/* WhatsApp Buy Now */}
      {process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER && (
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER}?text=${encodeURIComponent(`Hi Oorvi Diamonds, I'm interested in buying:\n\n*${name}*\nPrice: ${price}\n\nPlease help me with this order.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-sm font-medium text-white hover:bg-[#1ebe5d] transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Buy Now on WhatsApp
        </a>
      )}

      {/* Delivery */}
      <div className="flex items-center gap-3 rounded-lg border border-beige bg-white px-[18px] py-3.5 mb-7">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#A8752E" strokeWidth="1.6" className="shrink-0">
          <path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <input
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter pincode to check delivery date"
          maxLength={6}
          className="flex-1 bg-transparent text-sm placeholder:text-ink/40 focus:outline-none"
        />
        <button className="text-[13px] tracking-[2px] uppercase text-gold hover:text-brand transition-colors">
          Check
        </button>
      </div>

      {/* Accordions */}
      <div className="border-t border-beige">
        {accordions.map((acc, i) => (
          <div key={acc.title} className="border-b border-beige">
            <button
              onClick={() => setOpenAcc((cur) => (cur === i ? -1 : i))}
              className="w-full flex items-center justify-between py-[18px] text-[14px] tracking-[1.5px] uppercase text-brand"
            >
              {acc.title}
              <span className="text-lg text-gold">{openAcc === i ? "−" : "+"}</span>
            </button>
            {openAcc === i && (
              <div className="pb-5 text-[14.5px] font-light leading-[1.8] text-[#6E5C44]">{acc.body}</div>
            )}
          </div>
        ))}
      </div>

      {/* Trust */}
      <div className="mt-6 grid grid-cols-3 gap-3.5">
        {[
          { glyph: "✦", label: "IGI Certified" },
          { glyph: "◈", label: "BIS Hallmarked" },
          { glyph: "↺", label: "Lifetime Exchange" },
        ].map((t) => (
          <div key={t.label} className="flex flex-col items-center gap-2 text-center bg-[#F4ECDC] rounded-[10px] px-2.5 py-4">
            <span className="font-heading text-xl text-gold">{t.glyph}</span>
            <span className="text-[11px] tracking-[1px] uppercase text-brand">{t.label}</span>
          </div>
        ))}
      </div>

      <p className="sr-only">{name}</p>

      {showSizeGuide && <SizeGuideModal onClose={() => setShowSizeGuide(false)} />}
    </div>
  );
}
