"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { AdminReel } from "@/lib/admin-store";

export function ReelsSection({ reels }: { reels: AdminReel[] }) {
  const activeReels = reels.filter((r) => r.enabled);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const count = activeReels.length;

  const goTo = useCallback((i: number) => {
    setActiveIdx((i + count) % count);
  }, [count]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (count <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIdx((cur) => (cur + 1) % count);
    }, 5000);
  }, [count]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === activeIdx) { v.play().catch(() => {}); }
      else { v.pause(); v.currentTime = 0; }
    });
  }, [activeIdx]);

  const onDragStart = (x: number) => { setIsDragging(true); dragStartX.current = x; };
  const onDragEnd = (x: number) => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = dragStartX.current - x;
    if (Math.abs(diff) > 50) { goTo(activeIdx + (diff > 0 ? 1 : -1)); resetTimer(); }
  };

  if (count === 0) return null;

  return (
    <div className="relative w-full select-none">
      <div
        className="flex items-center justify-center gap-3 sm:gap-4 overflow-hidden px-4"
        onMouseDown={(e) => onDragStart(e.clientX)}
        onMouseUp={(e) => onDragEnd(e.clientX)}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}
      >
        {activeReels.map((reel, i) => {
          const isCenter = i === activeIdx;
          const isAdjacent =
            Math.abs(i - activeIdx) === 1 ||
            (activeIdx === 0 && i === count - 1) ||
            (activeIdx === count - 1 && i === 0);
          if (!isCenter && !isAdjacent) return null;

          return (
            <div
              key={reel.id}
              onClick={() => { if (!isCenter) { goTo(i); resetTimer(); } }}
              className={[
                "relative flex-shrink-0 rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer",
                isCenter
                  ? "w-[55%] sm:w-[38%] lg:w-[26%] opacity-100 scale-100 z-10 shadow-2xl"
                  : "w-[22%] sm:w-[20%] lg:w-[15%] opacity-40 scale-95 z-0",
              ].join(" ")}
              style={{ aspectRatio: "9/16" }}
            >
              {reel.videoUrl ? (
                <video
                  ref={(el) => { videoRefs.current[i] = el; }}
                  src={reel.videoUrl}
                  className="h-full w-full object-cover"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <div className="h-full w-full bg-brand/10 flex flex-col items-center justify-center text-ink/30 gap-2">
                  <span className="text-4xl">🎬</span>
                  <span className="text-xs">No video</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {!isCenter && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white text-lg">▶</div>
                </div>
              )}

              {reel.title && isCenter && (
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-medium drop-shadow line-clamp-2">{reel.title}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <>
          <button
            onClick={() => { goTo(activeIdx - 1); resetTimer(); }}
            className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-brand text-lg hover:bg-white transition-colors"
          >‹</button>
          <button
            onClick={() => { goTo(activeIdx + 1); resetTimer(); }}
            className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-brand text-lg hover:bg-white transition-colors"
          >›</button>
        </>
      )}

      {count > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {activeReels.map((_, i) => (
            <button
              key={i}
              onClick={() => { goTo(i); resetTimer(); }}
              className={"rounded-full transition-all duration-300 " + (i === activeIdx ? "w-6 h-2 bg-brand" : "w-2 h-2 bg-brand/25 hover:bg-brand/50")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
