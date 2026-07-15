"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Item = { name: string; href: string; image: string };

export function CategoryCarousel({ items }: { items: Item[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, 3200);
    return () => clearInterval(id);
  }, [items.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const child = track.children[active] as HTMLElement | undefined;
    if (!child) return;
    track.scrollTo({ left: child.offsetLeft - 16, behavior: "smooth" });
  }, [active]);

  return (
    <div
      ref={trackRef}
      className="flex gap-5 sm:gap-[26px] overflow-x-auto pb-2 px-4 -mx-4 sm:px-6 sm:-mx-6 lg:px-10 lg:-mx-10 [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory"
      onScroll={() => {
        const track = trackRef.current;
        if (!track) return;
        let closest = 0;
        let min = Infinity;
        Array.from(track.children).forEach((child, i) => {
          const el = child as HTMLElement;
          const dist = Math.abs(el.offsetLeft - 16 - track.scrollLeft);
          if (dist < min) {
            min = dist;
            closest = i;
          }
        });
        setActive(closest);
      }}
    >
      {items.map((item) => (
        <Link key={item.name} href={item.href} className="shrink-0 w-[42%] sm:w-[23%] snap-start block text-center group">
          <div className="relative aspect-[3/3.6] overflow-hidden bg-beige">
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(min-width:640px) 23vw, 42vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="font-heading text-lg sm:text-2xl text-brand mt-4">{item.name}</div>
          <div className="text-[11px] tracking-[2.5px] uppercase text-gold mt-1.5">Explore →</div>
        </Link>
      ))}
    </div>
  );
}
