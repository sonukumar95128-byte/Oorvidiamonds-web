"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DualRangeSlider } from "@/components/DualRangeSlider";
import { categories, categoryToSlug, dummyProducts } from "@/lib/dummy-images";

type FilterSectionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-beige py-5 last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-xs tracking-[2px] uppercase text-ink/50"
      >
        {title}
        <span className="text-ink/30 text-[10px]">{open ? "▾" : "▸"}</span>
      </button>
      {open && <div className="mt-3.5 space-y-2.5">{children}</div>}
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked?: boolean;
  onChange?: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-ink/70 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded-[4px] border-[#B8A88A] accent-brand focus:ring-1 focus:ring-gold"
      />
      {label}
    </label>
  );
}

function Pill({ label }: { label: string }) {
  const [active, setActive] = useState(false);
  return (
    <button
      onClick={() => setActive((a) => !a)}
      className={
        "rounded-full border px-3.5 py-1.5 text-xs transition-colors " +
        (active ? "border-brand bg-brand text-gold-light" : "border-[#D8C6A4] text-ink/70 hover:border-brand")
      }
    >
      {label}
    </button>
  );
}

type FilterSidebarProps = {
  priceMin: number;
  priceMax: number;
  activeCategories?: string[];
  mobileMode?: boolean; // inside drawer — hide heading, remove sticky/border styles
};

export function FilterSidebar({ priceMin, priceMax, activeCategories = [], mobileMode = false }: FilterSidebarProps) {
  const router = useRouter();

  const toggleCategory = (slug: string) => {
    const next = activeCategories.includes(slug)
      ? activeCategories.filter((s) => s !== slug)
      : [...activeCategories, slug];

    if (next.length === 0) router.push("/jewellery");
    else if (next.length === 1) router.push(`/jewellery/${next[0]}`);
    else router.push(`/jewellery?category=${next.join(",")}`);
  };

  const clearAll = () => router.push("/jewellery");

  return (
    <aside
      className={mobileMode
        ? "w-full"
        : "w-full rounded-xl border border-beige bg-white p-6 sticky top-[100px] self-start max-h-[calc(100vh-120px)] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:var(--color-beige)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-beige [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"}
    >
      {!mobileMode && (
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs tracking-[2.5px] uppercase text-brand">Filters</span>
          <button onClick={clearAll} className="text-[12.5px] text-gold border-b border-[#D8C6A4] hover:text-brand transition-colors">
            Clear all
          </button>
        </div>
      )}

      <div className="pb-5 border-b border-beige">
        <div className="text-xs tracking-[2px] uppercase text-ink/50 mb-3.5">Category</div>
        <div className="flex flex-col gap-2.5">
          {categories.map((c) => {
            const slug = categoryToSlug(c);
            const active = activeCategories.includes(slug);
            const count = dummyProducts.filter((p) => p.category === c).length;
            return (
              <button
                key={c}
                onClick={() => toggleCategory(slug)}
                className={
                  "flex items-center justify-between text-sm transition-colors " +
                  (active ? "text-[#7A1220] font-medium" : "text-ink/70 hover:text-brand")
                }
              >
                {c}
                <span className="text-xs text-ink/30">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <FilterSection title="Price">
        <DualRangeSlider min={priceMin} max={priceMax} step={100} />
      </FilterSection>

      <FilterSection title="Metal type">
        <div className="flex flex-wrap gap-2">
          {["Yellow gold", "Rose gold", "White gold", "Platinum", "Silver"].map((m) => (
            <Pill key={m} label={m} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Gold karat">
        <div className="flex gap-2">
          {["14k", "18k", "22k"].map((k) => (
            <Pill key={k} label={k} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Diamond type">
        {["Natural", "Lab-grown", "Solitaire", "No diamond"].map((d) => (
          <Checkbox key={d} label={d} />
        ))}
      </FilterSection>

      <FilterSection title="Diamond colour">
        <div className="flex gap-2">
          {["D-F", "G-H", "I-J"].map((c) => (
            <Pill key={c} label={c} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Diamond clarity">
        <div className="flex gap-2">
          {["VVS", "VS", "SI"].map((c) => (
            <Pill key={c} label={c} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Occasion" defaultOpen={false}>
        {["Bridal", "Everyday Light", "Gifting"].map((o) => (
          <Checkbox key={o} label={o} />
        ))}
      </FilterSection>

      <FilterSection title="Availability" defaultOpen={false}>
        <Checkbox label="In stock only" />
      </FilterSection>
    </aside>
  );
}
