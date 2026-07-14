"use client";

import type { AdminReel } from "@/lib/admin-store";

function getYoutubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export function ReelsGrid({ reels }: { reels: AdminReel[] }) {
  const activeReels = reels.filter((r) => r.enabled);
  if (activeReels.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
      {activeReels.map((reel) => {
        const ytId = reel.videoUrl ? getYoutubeId(reel.videoUrl) : null;
        const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : reel.thumbnail;
        return (
          <a
            key={reel.id}
            href={reel.videoUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-[9/16] overflow-hidden bg-[#2E060A] border border-gold-light/20 block group"
          >
            {thumb && (
              <img src={thumb} alt={reel.title || "Reel"} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[58px] w-[58px] rounded-full bg-black/40 border border-gold-light flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#E7C878">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            {reel.title && (
              <div className="absolute left-0 right-0 bottom-0 p-4">
                <p className="text-[13.5px] text-[#F0E0BE] line-clamp-2">{reel.title}</p>
              </div>
            )}
          </a>
        );
      })}
    </div>
  );
}
