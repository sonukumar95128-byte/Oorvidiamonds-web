"use client";

import { useEffect, useRef, useState } from "react";
import type { AdminReel } from "@/lib/admin-store";

function ReelCard({ reel, isActive }: { reel: AdminReel; isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isActive]);

  return (
    <div className="relative flex-shrink-0 w-[48%] sm:w-[28%] lg:w-[20%] rounded-2xl overflow-hidden bg-brand/10 group cursor-pointer"
      style={{ aspectRatio: "9/16" }}>
      {reel.videoUrl ? (
        <video
          ref={videoRef}
          src={reel.videoUrl}
          className="h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <div className="h-full w-full bg-beige flex items-center justify-center text-ink/30 text-sm">No video</div>
      )}

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Play icon */}
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
          <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white text-xl">
            ▶
          </div>
        </div>
      )}

      {/* Title */}
      {reel.title && (
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white text-xs font-medium drop-shadow line-clamp-2">{reel.title}</p>
        </div>
      )}
    </div>
  );
}

export function ReelsSection({ reels }: { reels: AdminReel[] }) {
  const activeReels = reels.filter((r) => r.enabled);
  const [activeIdx, setActiveIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const goTo = (i: number) => {
    const target = Math.max(0, Math.min(i, activeReels.length - 1));
    setActiveIdx(target);
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[target] as HTMLElement;
    if (slide) {
      const left = slide.offsetLeft - (track.offsetWidth - slide.offsetWidth) / 2;
      track.scrollTo({ left, behavior: "smooth" });
    }
  };

  if (activeReels.length === 0) return null;

  return (
    <div className="relative w-full">
      {/* Scrollable reel track */}
      <div
        ref={trackRef}
        className="flex gap-3 overflow-x-hidden px-4 sm:px-6"
        style={{ scrollbarWidth: "none" }}
      >
        {activeReels.map((reel, i) => (
          <div key={reel.id} onClick={() => goTo(i)}>
            <ReelCard reel={reel} isActive={i === activeIdx} />
          </div>
        ))}
      </div>

      {/* Left arrow */}
      {activeIdx > 0 && (
        <button
          onClick={() => goTo(activeIdx - 1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-md text-brand hover:bg-beige transition-colors"
        >‹</button>
      )}

      {/* Right arrow */}
      {activeIdx < activeReels.length - 1 && (
        <button
          onClick={() => goTo(activeIdx + 1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-md text-brand hover:bg-beige transition-colors"
        >›</button>
      )}
    </div>
  );
}
