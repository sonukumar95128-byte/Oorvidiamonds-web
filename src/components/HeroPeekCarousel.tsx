"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Slide = { image: string; href: string; alt: string };

export function HeroPeekCarousel({ slides }: { slides: Slide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const child = track.children[active] as HTMLElement | undefined;
    if (!child) return;
    track.scrollTo({ left: child.offsetLeft - 24, behavior: "smooth" });
  }, [active]);

  if (slides.length === 0) return null;

  return (
    <div>
      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto px-6 sm:px-10 [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory"
        onScroll={() => {
          const track = trackRef.current;
          if (!track) return;
          let closest = 0;
          let min = Infinity;
          Array.from(track.children).forEach((child, i) => {
            const el = child as HTMLElement;
            const dist = Math.abs(el.offsetLeft - 24 - track.scrollLeft);
            if (dist < min) {
              min = dist;
              closest = i;
            }
          });
          setActive(closest);
        }}
      >
        {slides.map((slide, i) => (
          <Link
            key={slide.href + i}
            href={slide.href}
            className="relative shrink-0 w-[84%] h-[340px] sm:h-[440px] lg:h-[560px] rounded-[20px] overflow-hidden bg-brand snap-center"
          >
            <Image src={slide.image} alt={slide.alt} fill priority={i === 0} sizes="84vw" className="object-cover" />
          </Link>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-3.5 pt-5 pb-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setActive(i)}
              className={"h-[9px] w-[9px] rounded-full transition-colors " + (i === active ? "bg-brand" : "bg-beige")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
