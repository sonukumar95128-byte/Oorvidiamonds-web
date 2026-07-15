import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryListing } from "@/components/CategoryListing";
import {
  categories,
  categoryBannerImages,
  categoryToSlug,
  dummyProducts,
  slugToCategory,
} from "@/lib/dummy-images";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = slugToCategory(slug);
  if (!category) return { title: "Not found — Oorvi Diamonds" };

  return {
    title: `${category} | Oorvi Diamonds`,
    description: `Shop fine ${category.toLowerCase()} — certified diamonds set in hallmarked gold, handcrafted by Oorvi Diamonds.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = slugToCategory(slug);

  if (!category) notFound();

  const products = dummyProducts.filter((p) => p.category === category);

  return (
    <CategoryListing
      title={category}
      pageId={slug}
      fallbackBanner={categoryBannerImages[category]}
      products={products}
      activeCategories={[slug]}
    />
  );
}
