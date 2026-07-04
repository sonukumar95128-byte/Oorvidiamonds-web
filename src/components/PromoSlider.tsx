"use client";

import { useEffect, useRef, useState } from "react";
import type { PromoStrip } from "@/lib/admin-store";

function GlassArrow({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === "left" ? "Previous slide" : "Next slide"}
      className={
        "absolute top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full " +
        "bg-white/20 backdrop-blur-md border border-white/30 text-white text-xl " +
        "flex items-center justify-center hover:bg-white/35 active:scale-95 " +
        "transition-all duration-200 shadow-lg " +
        (direction === "left" ? "left-4 sm:left-6" : "right-4 sm:right-6")
      }
    >
      {direction === "left" ? "‹" : "›"}
    </button>
  );
}

const SLIDE_WIDTH_RATIO = 0.70; // center 70%, so each side = ~12-13% visible + gap
const GAP = 20; // px gap between slides

export function PromoSlider({ slides }: { slides: PromoStrip[] }) {
  const [active, setActive] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = slides.length;

  const calcTranslate = (idx: number, containerW: number) => {
    const slideW = containerW * SLIDE_WIDTH_RATIO;
    const centerOffset = (containerW - slideW) / 2;
    return centerOffset - idx * (slideW + GAP);
  };

  const applyTranslate = (idx: number) => {
    const w = containerRef.current?.offsetWidth ?? 0;
    if (w) setTranslateX(calcTranslate(idx, w));
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (count <= 1) return;
    timerRef.current = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % count;
        applyTranslate(next);
        return next;
      });
    }, 4500);
  };

  useEffect(() => {
    applyTranslate(active);
  }, [active]);

  useEffect(() => {
    resetTimer();
    const ro = new ResizeObserver(() => {
      setActive((cur) => { applyTranslate(cur); return cur; });
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => {
      ro.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [count]);

  const goTo = (i: number) => {
    const target = (i + count) % count;
    setActive(target);
    applyTranslate(target);
    resetTimer();
  };

  if (count === 0) return null;

  const slideWidthPct = SLIDE_WIDTH_RATIO * 100;

  return (
    <section className="w-full py-5">
      {/* Outer clip */}
      <div ref={containerRef} className="relative w-full overflow-hidden" style={{ aspectRatio: "16/6" }}>

        {/* Sliding track — all slides in a row */}
        <div
          className="absolute top-0 left-0 h-full flex"
          style={{
            gap: `${GAP}px`,
            transform: `translateX(${translateX}px)`,
            transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            width: `calc(${count} * ${slideWidthPct}% + ${(count - 1) * GAP}px)`,
          }}
        >
          {slides.map((s, i) => (
            <div
              key={s.id}
              className={
                "relative h-full flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer " +
                "transition-opacity duration-300 " +
                (i === active ? "opacity-100" : "opacity-70 hover:opacity-85")
              }
              style={{ width: `${slideWidthPct}%` }}
              onClick={() => i !== active && goTo(i)}
            >
              <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
              {s.title && i === active && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-8 z-10">
                    <p className="font-heading italic text-xl sm:text-2xl text-white drop-shadow">
                      {s.title}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Glass arrows — centered on active slide area */}
        {count > 1 && (
          <>
            <GlassArrow direction="left" onClick={() => goTo(active - 1)} />
            <GlassArrow direction="right" onClick={() => goTo(active + 1)} />
          </>
        )}

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
    </section>
  );
}
