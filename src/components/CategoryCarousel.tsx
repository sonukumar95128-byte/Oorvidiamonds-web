"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Item = { name: string; href: string; image: string };

const AUTOPLAY_MS = 3200;
const TRANSITION_MS = 500;
const MOBILE_ITEM_PERCENT = 42;
const DESKTOP_ITEM_PERCENT = 23;
const MOBILE_GAP_REM = 1.25; // Tailwind gap-5
const DESKTOP_GAP_REM = 26 / 16; // Tailwind gap-[26px]

export function CategoryCarousel({ items }: { items: Item[] }) {
  const loop = items.length > 1;
  // Three copies of the list let the sliding window wrap in either
  // direction without ever running out of items to show alongside the
  // boundary ones — real item `i` lives at `pos = items.length + i`.
  const displayItems = loop ? [...items, ...items, ...items] : items;
  const startPos = loop ? items.length : 0;

  const [pos, setPos] = useState(startPos);
  const [animate, setAnimate] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const itemPercent = isDesktop ? DESKTOP_ITEM_PERCENT : MOBILE_ITEM_PERCENT;
  const gapRem = isDesktop ? DESKTOP_GAP_REM : MOBILE_GAP_REM;

  // Each call bumps the generation counter and schedules exactly one
  // auto-advance tick tagged with that generation — an old, already-queued
  // timer from before a manual swipe can never clobber it, no matter how
  // the timing lines up (same pattern as HeroPeekCarousel).
  const generationRef = useRef(0);

  const scheduleNext = () => {
    const myGeneration = ++generationRef.current;
    if (!loop) return;
    setTimeout(() => {
      if (generationRef.current !== myGeneration) return;
      setAnimate(true);
      setPos((p) => p + 1);
      scheduleNext();
    }, AUTOPLAY_MS);
  };

  useEffect(() => {
    scheduleNext();
    return () => {
      generationRef.current++;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loop]);

  // Sliding into either the trailing or leading clone copy (which look
  // identical to the matching real position) snaps back with no transition
  // once the animation has had time to finish — invisible since both
  // positions show the same items.
  useEffect(() => {
    if (!loop) return;
    if (pos >= 2 * items.length) {
      const t = setTimeout(() => {
        setAnimate(false);
        setPos(items.length);
      }, TRANSITION_MS);
      return () => clearTimeout(t);
    }
    if (pos < items.length) {
      const t = setTimeout(() => {
        setAnimate(false);
        setPos(2 * items.length - 1);
      }, TRANSITION_MS);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, loop, items.length]);

  useEffect(() => {
    if (!animate) {
      const raf = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [animate]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    const threshold = 40;
    if (delta < -threshold) {
      setAnimate(true);
      setPos((p) => p + 1);
      scheduleNext();
    } else if (delta > threshold) {
      setAnimate(true);
      setPos((p) => p - 1);
      scheduleNext();
    }
  };

  if (items.length === 0) return null;

  const offsetPercent = -itemPercent * pos;
  const offsetRem = -gapRem * pos;

  return (
    <div className="overflow-hidden px-4 -mx-4 sm:px-6 sm:-mx-6 lg:px-10 lg:-mx-10">
      <div
        className="flex gap-5 sm:gap-[26px]"
        style={{
          transform: `translateX(calc(${offsetPercent}% + ${offsetRem}rem))`,
          transition: animate ? `transform ${TRANSITION_MS}ms ease` : "none",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {displayItems.map((item, i) => (
          <Link key={i} href={item.href} className="shrink-0 w-[42%] sm:w-[23%] block text-center group">
            <div className="relative aspect-[3/3.6] overflow-hidden bg-beige">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(min-width:640px) 23vw, 42vw"
                priority={i === startPos}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="font-heading text-lg sm:text-2xl text-brand mt-4">{item.name}</div>
            <div className="text-[11px] tracking-[2.5px] uppercase text-gold mt-1.5">Explore →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
