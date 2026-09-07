"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useToast } from "@/lib/toast-store";

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
  const { showToast } = useToast();
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
    if (!slugs.includes(slug) && slugs.length >= MAX_COMPARE) {
      showToast(`You can compare up to ${MAX_COMPARE} products`);
      return;
    }
    setSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
    showToast(slugs.includes(slug) ? "Removed from Compare" : "Added to Compare");
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
