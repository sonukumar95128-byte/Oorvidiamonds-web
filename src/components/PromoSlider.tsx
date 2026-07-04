"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

const GAP = 20;

export function PromoSlider({ slides }: { slides: PromoStrip[] }) {
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [slideW, setSlideW] = useState(0);
  const [txX, setTxX] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Compute pixel dimensions from container
  const compute = (idx: number, el?: HTMLDivElement | null) => {
    const container = el ?? wrapRef.current;
    const w = container?.offsetWidth ?? 0;
    if (!w) return;
    const sw = Math.floor(w * 0.70);          // center slide = 70%
    const start = Math.floor((w - sw) / 2);   // ~15% on each side
    const tx = start - idx * (sw + GAP);
    setSlideW(sw);
    setTxX(tx);
  };

  useLayoutEffect(() => {
    compute(active);
  }, [active]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    compute(0, el);

    const ro = new ResizeObserver(() => {
      setActive((cur) => { compute(cur, el); return cur; });
    });
    ro.observe(el);

    const startTimer = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setActive((cur) => { const next = (cur + 1) % count; compute(next, el); return next; });
      }, 4500);
    };
    startTimer();

    return () => { ro.disconnect(); if (timerRef.current) clearInterval(timerRef.current); };
  }, [count]);

  const goTo = (i: number) => {
    const target = (i + count) % count;
    setActive(target);
    // compute will fire via useLayoutEffect
    if (timerRef.current) clearInterval(timerRef.current);
    const el = wrapRef.current;
    timerRef.current = setInterval(() => {
      setActive((cur) => { const next = (cur + 1) % count; compute(next, el); return next; });
    }, 4500);
  };

  if (count === 0) return null;

  return (
    <section className="w-full py-5">
      {/* Container — clips overflow, defines height via aspect ratio */}
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "16/6" }}
      >
        {slideW > 0 && (
          /* Track — slides sit side by side in a row, whole row moves */
          <div
            className="absolute top-0 left-0 h-full flex"
            style={{
              gap: `${GAP}px`,
              transform: `translateX(${txX}px)`,
              transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            {slides.map((s, i) => (
              <div
                key={s.id}
                className={
                  "relative flex-shrink-0 h-full rounded-2xl overflow-hidden cursor-pointer " +
                  "transition-opacity duration-300 " +
                  (i === active ? "opacity-100" : "opacity-65 hover:opacity-80")
                }
                style={{ width: `${slideW}px` }}
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
        )}

        {/* Glass arrows */}
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
