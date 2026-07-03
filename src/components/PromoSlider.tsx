"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PromoStrip } from "@/lib/admin-store";

export function PromoSlider({ slides }: { slides: PromoStrip[] }) {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);

  const count = slides.length;

  const goTo = (i: number) => {
    if (animating || i === active) return;
    setAnimating(true);
    setActive((i + count) % count);
    setTimeout(() => setAnimating(false), 500);
  };

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(() => {
      setAnimating(true);
      setActive((prev) => (prev + 1) % count);
      setTimeout(() => setAnimating(false), 500);
    }, 4500);
    return () => clearInterval(timer);
  }, [count]);

  if (count === 0) return null;

  const prev = (active - 1 + count) % count;
  const next = (active + 1) % count;

  return (
    <section className="w-full overflow-hidden bg-black py-0">
      <div className="relative flex items-center justify-center">
        {/* Previous slide peek */}
        {count > 1 && (
          <div
            className="hidden md:block absolute left-0 top-0 bottom-0 w-[8%] z-10 cursor-pointer overflow-hidden"
            onClick={() => goTo(active - 1)}
          >
            <img
              src={slides[prev].image}
              alt={slides[prev].title}
              className="h-full w-auto object-cover object-right scale-105 opacity-60"
              style={{ minWidth: "900%", marginLeft: "-800%" }}
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-start pl-2">
              <span className="text-white text-3xl opacity-80">‹</span>
            </div>
          </div>
        )}

        {/* Main slide */}
        <div className="relative w-full md:w-[84%] aspect-[8/3] overflow-hidden">
          {slides.map((s, i) => (
            <div
              key={s.id}
              className={
                "absolute inset-0 transition-opacity duration-500 " +
                (i === active ? "opacity-100 z-10" : "opacity-0 z-0")
              }
            >
              <img
                src={s.image}
                alt={s.title}
                className="h-full w-full object-cover"
              />
              {s.title && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
              )}
              {(s.title || s.link) && (
                <div className="absolute inset-0 flex items-end p-6 sm:p-10">
                  <div>
                    {s.title && (
                      <p className="font-heading italic text-2xl sm:text-3xl text-white drop-shadow mb-4 max-w-xs">
                        {s.title}
                      </p>
                    )}
                    {s.link && s.link !== "#" && (
                      <Link
                        href={s.link}
                        className="inline-block rounded-full bg-white px-7 py-2.5 text-sm font-medium text-brand shadow hover:bg-gold hover:text-brand transition-colors"
                      >
                        Shop Now
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Mobile arrows */}
          {count > 1 && (
            <>
              <button
                aria-label="Previous slide"
                onClick={() => goTo(active - 1)}
                className="md:hidden absolute left-2 top-1/2 z-20 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors text-xl"
              >
                ‹
              </button>
              <button
                aria-label="Next slide"
                onClick={() => goTo(active + 1)}
                className="md:hidden absolute right-2 top-1/2 z-20 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors text-xl"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Next slide peek */}
        {count > 1 && (
          <div
            className="hidden md:block absolute right-0 top-0 bottom-0 w-[8%] z-10 cursor-pointer overflow-hidden"
            onClick={() => goTo(active + 1)}
          >
            <img
              src={slides[next].image}
              alt={slides[next].title}
              className="h-full w-auto object-cover object-left scale-105 opacity-60"
              style={{ minWidth: "900%", marginRight: "-800%" }}
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-end pr-2">
              <span className="text-white text-3xl opacity-80">›</span>
            </div>
          </div>
        )}
      </div>

      {/* Dots */}
      {count > 1 && (
        <div className="flex justify-center gap-2 py-3">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={
                "rounded-full transition-all duration-300 " +
                (i === active ? "w-6 h-2 bg-gold" : "w-2 h-2 bg-white/40 hover:bg-white/70")
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
