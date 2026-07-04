"use client";

import { useEffect, useRef, useState } from "react";
import type { PromoStrip } from "@/lib/admin-store";

export function PromoSlider({ slides }: { slides: PromoStrip[] }) {
  const count = slides.length;
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollTo = (idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[idx] as HTMLElement;
    if (!slide) return;
    // Scroll so slide is centered (15% padding on each side)
    const containerW = track.offsetWidth;
    const slideW = slide.offsetWidth;
    const left = slide.offsetLeft - (containerW - slideW) / 2;
    track.scrollTo({ left, behavior: "smooth" });
  };

  const goTo = (i: number) => {
    const target = (i + count) % count;
    setActive(target);
    scrollTo(target);
    resetTimer();
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (count <= 1) return;
    timerRef.current = setInterval(() => {
      setActive((cur) => {
        const next = (cur + 1) % count;
        scrollTo(next);
        return next;
      });
    }, 4500);
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [count]);

  if (count === 0) return null;

  return (
    <section className="w-full py-5">
      <div className="relative">

        {/* Scrollable track — all slides in a row, snaps to each */}
        <div
          ref={trackRef}
          className="flex gap-3 overflow-x-hidden px-[3%]"
          style={{ scrollbarWidth: "none" }}
        >
          {slides.map((s, i) => (
            <div
              key={s.id}
              className={
                "flex-shrink-0 w-[70%] rounded-2xl overflow-hidden transition-opacity duration-300 " +
                (i === active ? "opacity-100" : "opacity-60")
              }
              style={{ aspectRatio: "16/6" }}
              onClick={() => i !== active && goTo(i)}
            >
              <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
              {s.title && i === active && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />
                  <p className="absolute bottom-6 left-8 font-heading italic text-xl sm:text-2xl text-white drop-shadow pointer-events-none">
                    {s.title}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Left arrow */}
        {count > 1 && (
          <button
            onClick={() => goTo(active - 1)}
            aria-label="Previous"
            className="hidden sm:flex absolute left-[3.5%] top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white shadow-md text-brand text-lg hover:bg-beige transition-colors"
          >←</button>
        )}

        {/* Right arrow */}
        {count > 1 && (
          <button
            onClick={() => goTo(active + 1)}
            aria-label="Next"
            className="hidden sm:flex absolute right-[3.5%] top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white shadow-md text-brand text-lg hover:bg-beige transition-colors"
          >→</button>
        )}

        {/* Dots */}
        {count > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={"rounded-full transition-all duration-300 " + (i === active ? "w-6 h-2 bg-brand" : "w-2 h-2 bg-brand/30 hover:bg-brand/60")}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
