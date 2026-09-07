"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const MAX_COMPARE = 4;

type CompareContextValue = {
  slugs: string[];
  isCompared: (slug: string) => boolean;
  toggleCompare: (slug: string) => void;
  removeFromCompare: (slug: string) => void;
  clearCompare: () => void;
  count: number;
  atLimit: boolean;
};

const CompareContext = createContext<CompareContextValue | null>(null);

const STORAGE_KEY = "oorvi-compare";

export function CompareProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSlugs(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  }, [slugs, hydrated]);

  const isCompared = (slug: string) => slugs.includes(slug);

  const toggleCompare = (slug: string) => {
    setSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, slug];
    });
  };

  const removeFromCompare = (slug: string) => {
    setSlugs((prev) => prev.filter((s) => s !== slug));
  };

  const clearCompare = () => setSlugs([]);

  return (
    <CompareContext.Provider
      value={{
        slugs,
        isCompared,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        count: slugs.length,
        atLimit: slugs.length >= MAX_COMPARE,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within a CompareProvider");
  return ctx;
}
