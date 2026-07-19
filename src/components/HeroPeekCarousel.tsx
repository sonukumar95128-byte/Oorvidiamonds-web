"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Slide = { image: string; mobileImage?: string; href: string; alt: string };

const AUTOPLAY_MS = 5000;
const TRANSITION_MS = 600;
const GAP_REM = 1.25; // Tailwind gap-5
const SLIDE_PERCENT = 84; // Tailwind w-[84%]

export function HeroPeekCarousel({ slides }: { slides: Slide[] }) {
  const loop = slides.length > 1;
  // With looping, a clone of slide 0 is appended so advancing off the last
  // real slide keeps sliding in the same direction instead of snapping
  // backwards through the whole track.
  const displaySlides = loop ? [...slides, slides[0]] : slides;

  const [active, setActive] = useState(0);
  const [animate, setAnimate] = useState(true);
  const touchStartX = useRef<number | null>(null);

  // Each call bumps the generation counter and schedules exactly one
  // auto-advance tick tagged with that generation. When the tick fires, it
  // checks the counter is still current before doing anything — so an old,
  // already-queued timer from before a manual dot click / swipe can never
  // clobber that manual navigation, no matter how the timing lines up.
  const generationRef = useRef(0);

  const scheduleNext = () => {
    const myGeneration = ++generationRef.current;
    if (!loop) return;
    setTimeout(() => {
      if (generationRef.current !== myGeneration) return;
      setAnimate(true);
      setActive((i) => i + 1);
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

  const goTo = (i: number) => {
    setAnimate(true);
    setActive(i);
    scheduleNext();
  };

  // After sliding onto the clone (which looks identical to slide 0), snap
  // back to the real slide 0 with no transition once the animation has had
  // time to finish — the swap is invisible since the two positions show
  // the same image. A timer is more reliable here than the transitionend
  // event, which doesn't always fire for every transition in every browser.
  useEffect(() => {
    if (!loop || active !== slides.length) return;
    const t = setTimeout(() => {
      setAnimate(false);
      setActive(0);
      scheduleNext();
    }, TRANSITION_MS);
    return () => clearTimeout(t);
  }, [active, loop, slides.length]);

  // Re-enable the transition on the next frame after a no-transition snap.
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
      // swiped left → next
      setAnimate(true);
      setActive((i) => i + 1);
      scheduleNext();
    } else if (delta > threshold) {
      // swiped right → previous
      setAnimate(true);
      setActive((i) => (i === 0 ? slides.length - 1 : i - 1));
      scheduleNext();
    }
  };

  if (slides.length === 0) return null;

  const offsetPercent = -SLIDE_PERCENT * active;
  const offsetRem = -GAP_REM * active;

  return (
    <div>
      <div className="overflow-hidden px-6 sm:px-10">
        <div
          className="flex gap-5"
          style={{
            transform: `translateX(calc(${offsetPercent}% + ${offsetRem}rem))`,
            transition: animate ? `transform ${TRANSITION_MS}ms ease` : "none",
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {displaySlides.map((slide, i) => (
            <Link
              key={i}
              href={slide.href}
              className="relative shrink-0 w-[84%] h-[340px] sm:h-[440px] lg:h-[560px] rounded-[20px] overflow-hidden bg-brand"
            >
              {slide.mobileImage ? (
                <>
                  <Image src={slide.mobileImage} alt={slide.alt} fill priority={i === 0} sizes="84vw" className="object-cover sm:hidden" />
                  <Image src={slide.image} alt={slide.alt} fill priority={i === 0} sizes="84vw" className="hidden object-cover sm:block" />
                </>
              ) : (
                <Image src={slide.image} alt={slide.alt} fill priority={i === 0} sizes="84vw" className="object-cover" />
              )}
            </Link>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-3.5 pt-5 pb-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={"h-[9px] w-[9px] rounded-full transition-colors " + (i === active % slides.length ? "bg-brand" : "bg-beige")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
