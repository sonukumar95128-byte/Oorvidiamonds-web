"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PromoStrip } from "@/lib/admin-store";

export function PromoSlider({ slides }: { slides: PromoStrip[] }) {
  const [active, setActive] = useState(0);

  const goTo = (i: number) => setActive((i + slides.length) % slides.length);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setActive((prev) => (prev + 1) % slides.length), 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[active];

  return (
    <section className="relative w-full aspect-[16/5] overflow-hidden">
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={
            "absolute inset-0 transition-opacity duration-700 " +
            (i === active ? "opacity-100 z-10" : "opacity-0 z-0")
          }
        >
          <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand/10 via-transparent to-brand/60" />
          <div className="absolute inset-0 flex items-center justify-end p-8">
            <div className="relative z-10 text-right">
              <p className="font-heading italic text-xl sm:text-2xl text-white drop-shadow mb-3">{s.title}</p>
              <Link
                href={s.link}
                className="inline-block rounded-full bg-gold px-7 py-3 text-sm font-medium text-brand shadow hover:bg-gold-light transition-colors"
              >
                Shop offers
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={() => goTo(active - 1)}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors text-xl"
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            onClick={() => goTo(active + 1)}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors text-xl"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={
                  "h-1.5 rounded-full transition-all " +
                  (i === active ? "w-5 bg-white" : "w-1.5 bg-white/50")
                }
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
