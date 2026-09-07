"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Testimonial = { id: string; name: string; rating: number; text: string; avatar: string };

const AUTOPLAY_MS = 4500;
const TRANSITION_MS = 500;
const MOBILE_ITEM_PERCENT = 100;
const DESKTOP_ITEM_PERCENT = 100 / 3;
const GAP_REM = 26 / 16; // Tailwind gap-[26px]

export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const loop = testimonials.length > 3;
  // Three copies of the list let the sliding window wrap in either
  // direction without ever running out of cards to show alongside the
  // boundary ones — real testimonial `i` lives at `pos = testimonials.length + i`.
  const displayItems = loop ? [...testimonials, ...testimonials, ...testimonials] : testimonials;
  const startPos = loop ? testimonials.length : 0;

  const [pos, setPos] = useState(startPos);
  const [animate, setAnimate] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const itemPercent = isDesktop ? DESKTOP_ITEM_PERCENT : MOBILE_ITEM_PERCENT;

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
  // positions show the same testimonials.
  useEffect(() => {
    if (!loop) return;
    if (pos >= 2 * testimonials.length) {
      const t = setTimeout(() => {
        setAnimate(false);
        setPos(testimonials.length);
      }, TRANSITION_MS);
      return () => clearTimeout(t);
    }
    if (pos < testimonials.length) {
      const t = setTimeout(() => {
        setAnimate(false);
        setPos(2 * testimonials.length - 1);
      }, TRANSITION_MS);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, loop, testimonials.length]);

  useEffect(() => {
    if (!animate) {
      const raf = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [animate]);

  if (testimonials.length === 0) return null;

  const offsetPercent = -itemPercent * pos;
  const offsetRem = -GAP_REM * pos;

  return (
    <div className="overflow-hidden">
      <div
        className="flex gap-5 sm:gap-[26px]"
        style={{
          transform: `translateX(calc(${offsetPercent}% + ${offsetRem}rem))`,
          transition: animate ? `transform ${TRANSITION_MS}ms ease` : "none",
        }}
      >
        {displayItems.map((t, i) => (
          <div key={i} className="shrink-0 w-full sm:w-[33.333%] bg-white border border-beige p-6">
            <div className="text-gold text-sm mb-3">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
            <p className="text-[15px] text-ink/80 leading-relaxed mb-5">{t.text}</p>
            <div className="flex items-center gap-3">
              {t.avatar ? (
                <div className="relative h-9 w-9 rounded-full overflow-hidden shrink-0">
                  <Image src={t.avatar} alt={t.name} fill sizes="36px" className="object-cover" />
                </div>
              ) : (
                <div className="h-9 w-9 rounded-full bg-brand/10 flex items-center justify-center text-brand text-sm font-medium shrink-0">
                  {t.name.charAt(0)}
                </div>
              )}
              <span className="font-heading text-lg text-brand">{t.name}</span>
              <span className="text-xs tracking-[1px] uppercase text-gold ml-auto">✓ verified</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
