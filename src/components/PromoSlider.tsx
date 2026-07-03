"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PromoStrip } from "@/lib/admin-store";

export function PromoSlider({ slides }: { slides: PromoStrip[] }) {
  const [active, setActive] = useState(0);

  const count = slides.length;
  const goTo = (i: number) => setActive((i + count) % count);

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(() => setActive((prev) => (prev + 1) % count), 4500);
    return () => clearInterval(timer);
  }, [count]);

  if (count === 0) return null;

  const prevIdx = (active - 1 + count) % count;
  const nextIdx = (active + 1) % count;

  return (
    <section className="w-full overflow-hidden">
      <div className="relative flex items-stretch">

        {/* Left edge peek */}
        <div
          className="hidden sm:block relative flex-shrink-0 w-[9%] cursor-pointer overflow-hidden"
          onClick={() => goTo(active - 1)}
        >
          <img
            src={slides[prevIdx].image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "right center" }}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Center main slide */}
        <div className="relative flex-1 aspect-[16/6]">
          {slides.map((s, i) => (
            <div
              key={s.id}
              className={
                "absolute inset-0 transition-opacity duration-600 " +
                (i === active ? "opacity-100 z-10" : "opacity-0 z-0")
              }
            >
              <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
              {(s.title || s.link) && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-end p-8 z-10">
                    <div>
                      {s.title && (
                        <p className="font-heading italic text-2xl sm:text-3xl text-white drop-shadow mb-4">
                          {s.title}
                        </p>
                      )}
                      {s.link && s.link !== "#" && (
                        <Link
                          href={s.link}
                          className="inline-block rounded-full border-2 border-white bg-white/10 backdrop-blur-sm px-7 py-2.5 text-sm font-semibold text-white tracking-wide hover:bg-white hover:text-brand transition-all duration-200"
                        >
                          SHOP NOW
                        </Link>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Dots */}
          {count > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={
                    "rounded-full transition-all duration-300 " +
                    (i === active ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/80")
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Right edge peek */}
        <div
          className="hidden sm:block relative flex-shrink-0 w-[9%] cursor-pointer overflow-hidden"
          onClick={() => goTo(active + 1)}
        >
          <img
            src={slides[nextIdx].image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "left center" }}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      </div>

      {/* Arrows — outside the slide strip */}
      {count > 1 && (
        <div className="hidden sm:flex justify-between px-[9%] mt-4">
          <button
            aria-label="Previous"
            onClick={() => goTo(active - 1)}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-beige shadow-md text-brand text-lg hover:bg-beige transition-colors"
          >
            ←
          </button>
          <button
            aria-label="Next"
            onClick={() => goTo(active + 1)}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-beige shadow-md text-brand text-lg hover:bg-beige transition-colors"
          >
            →
          </button>
        </div>
      )}

      {/* Mobile arrows */}
      {count > 1 && (
        <div className="sm:hidden flex justify-center gap-4 mt-3">
          <button onClick={() => goTo(active - 1)} className="h-9 w-9 flex items-center justify-center rounded-full bg-white border border-beige shadow text-brand">←</button>
          <button onClick={() => goTo(active + 1)} className="h-9 w-9 flex items-center justify-center rounded-full bg-white border border-beige shadow text-brand">→</button>
        </div>
      )}
    </section>
  );
}
