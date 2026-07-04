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

export function PromoSlider({ slides }: { slides: PromoStrip[] }) {
  const [active, setActive] = useState(0);
  const count = slides.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (count <= 1) return;
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % count);
    }, 4500);
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [count]);

  const goTo = (i: number) => {
    setActive((i + count) % count);
    resetTimer();
  };

  if (count === 0) return null;

  return (
    <section className="w-full py-4 px-3 sm:px-5">
      <div
        className="relative w-full rounded-2xl overflow-hidden shadow-xl"
        style={{ aspectRatio: "16/6" }}
      >
        {/* Full sliding track — all slides side by side, shifts on active */}
        <div
          className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
          style={{
            width: `${count * 100}%`,
            transform: `translateX(-${(active * 100) / count}%)`,
          }}
        >
          {slides.map((s) => (
            <div
              key={s.id}
              className="relative h-full flex-shrink-0"
              style={{ width: `${100 / count}%` }}
            >
              <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
              {s.title && (
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
