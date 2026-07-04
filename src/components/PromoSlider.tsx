"use client";

import { useEffect, useRef, useState } from "react";
import type { PromoStrip } from "@/lib/admin-store";

export function PromoSlider({ slides }: { slides: PromoStrip[] }) {
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [animDir, setAnimDir] = useState<"left" | "right">("right");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (count <= 1) return;
    timerRef.current = setInterval(() => navigate("right"), 4500);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [count]);

  const navigate = (dir: "left" | "right") => {
    setAnimDir(dir);
    setActive((cur) => {
      setPrev(cur);
      return dir === "right" ? (cur + 1) % count : (cur - 1 + count) % count;
    });
    startTimer();
  };

  if (count === 0) return null;

  const prevIdx = (active - 1 + count) % count;
  const nextIdx = (active + 1) % count;

  return (
    <section className="w-full py-4">
      <div className="flex items-stretch w-full gap-3 px-3" style={{ aspectRatio: "16/6" }}>

        {/* Left strip — prev slide edge + arrow */}
        <div
          className="hidden sm:flex relative flex-shrink-0 w-[15%] cursor-pointer items-center justify-center rounded-2xl overflow-hidden"
          onClick={() => navigate("left")}
        >
          <img
            src={slides[prevIdx].image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "right center" }}
          />
          <div className="absolute inset-0 bg-black/30" />
          <button
            aria-label="Previous slide"
            className="relative z-10 h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-md text-brand text-lg hover:bg-beige transition-colors"
          >
            ←
          </button>
        </div>

        {/* Center — main slide with slide animation */}
        <div className="relative flex-1 rounded-2xl overflow-hidden shadow-xl cursor-default">
          {slides.map((s, i) => (
            <div
              key={s.id}
              className={
                "absolute inset-0 transition-transform duration-500 ease-in-out pointer-events-none " +
                (i === active
                  ? "translate-x-0 z-10"                                          // active: center
                  : i === prev
                    ? (animDir === "right" ? "-translate-x-full z-0"              // prev exits left
                                           : "translate-x-full z-0")             // prev exits right
                    : animDir === "right" ? "translate-x-full z-0"               // others wait right
                                         : "-translate-x-full z-0")             // others wait left
              }
            >
              <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
              {s.title && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-8 z-10">
                    <p className="font-heading italic text-xl sm:text-2xl text-white drop-shadow">{s.title}</p>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Mobile arrows */}
          <button
            onClick={() => navigate("left")}
            className="sm:hidden absolute left-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xl"
          >‹</button>
          <button
            onClick={() => navigate("right")}
            className="sm:hidden absolute right-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xl"
          >›</button>

          {/* Dots */}
          {count > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 pointer-events-auto">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { const dir = i > active ? "right" : "left"; setAnimDir(dir); setPrev(active); setActive(i); startTimer(); }}
                  className={"rounded-full transition-all duration-300 " + (i === active ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50")}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right strip — next slide edge + arrow */}
        <div
          className="hidden sm:flex relative flex-shrink-0 w-[15%] cursor-pointer items-center justify-center rounded-2xl overflow-hidden"
          onClick={() => navigate("right")}
        >
          <img
            src={slides[nextIdx].image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "left center" }}
          />
          <div className="absolute inset-0 bg-black/30" />
          <button
            aria-label="Next slide"
            className="relative z-10 h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-md text-brand text-lg hover:bg-beige transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
