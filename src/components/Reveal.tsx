"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  animation?: "animate-fadeUp" | "animate-fadeIn" | "animate-scaleIn";
  delay?: number;
};

export function Reveal({ children, className = "", animation = "animate-fadeUp", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${visible ? animation : "opacity-0"}`}
      style={visible && delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
