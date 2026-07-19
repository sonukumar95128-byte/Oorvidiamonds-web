"use client";

import { useState } from "react";
import { FilterSidebar } from "@/components/FilterSidebar";
import { InfiniteProductGrid } from "@/components/InfiniteProductGrid";
import { getPriceRange, type DummyProduct } from "@/lib/dummy-images";

type CategoryListingProps = {
  title: string;
  pageId: string;
  fallbackBanner: string;
  products: DummyProduct[];
  activeCategories?: string[];
};

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "bestselling", label: "Bestselling" },
];

export function CategoryListing({ title, products, activeCategories }: CategoryListingProps) {
  const { min, max } = getPriceRange(products);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState("newest");

  const toNum = (p: string) => Number(p.replace(/[^0-9.]/g, ""));
  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "price-asc") return toNum(a.price) - toNum(b.price);
    if (sort === "price-desc") return toNum(b.price) - toNum(a.price);
    if (sort === "bestselling") return b.rating - a.rating;
    return 0; // newest = original order
  });

  return (
    <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10 pt-8 pb-20">
      <h1 className="sr-only">{title}</h1>

      {/* count + sort */}
      <div className="flex flex-wrap items-end justify-between gap-5 mb-7">
        <div>
          <p className="text-sm text-ink/50">{sortedProducts.length} designs</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs tracking-[1px] uppercase text-ink/50 shrink-0">Sort by</span>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={
                  "rounded-full px-4 py-2 text-[13px] transition-colors " +
                  (sort === opt.value
                    ? "bg-brand text-gold-light"
                    : "bg-white border border-[#D8C6A4] text-ink/70 hover:border-brand")
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter button — mobile only */}
      <button
        onClick={() => setFilterOpen(true)}
        className="lg:hidden mb-5 flex items-center gap-2 rounded-full border border-gold bg-white px-4 py-2 text-sm text-brand hover:bg-gold/10 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h18M7 12h10M11 20h2" />
        </svg>
        Filters
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-10 items-start">
        {/* Desktop sidebar — always visible */}
        <div className="hidden lg:block">
          <FilterSidebar priceMin={min} priceMax={max} activeCategories={activeCategories} />
        </div>

        {/* Products */}
        <div>
          <InfiniteProductGrid products={sortedProducts} />
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setFilterOpen(false)}
          />
          {/* Drawer — slides up from bottom */}
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-white max-h-[85vh] flex flex-col lg:hidden">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-beige shrink-0">
              <h2 className="font-heading text-xl text-brand">Filters</h2>
              <button
                onClick={() => setFilterOpen(false)}
                className="text-ink/40 hover:text-brand text-2xl leading-none"
              >
                ✕
              </button>
            </div>
            {/* Scrollable filter content */}
            <div className="overflow-y-auto flex-1 px-5 pb-6">
              <FilterSidebar priceMin={min} priceMax={max} activeCategories={activeCategories} mobileMode />
            </div>
            {/* Apply button */}
            <div className="px-5 py-4 border-t border-beige shrink-0">
              <button
                onClick={() => setFilterOpen(false)}
                className="w-full rounded-full bg-brand py-3 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
