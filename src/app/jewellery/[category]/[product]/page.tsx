import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductPagePromo } from "@/components/ProductPagePromo";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import { ProductShareButton } from "@/components/ProductShareButton";
import { ProductTabs } from "@/components/ProductTabs";
import { ProductTags } from "@/components/ProductTags";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { TrackRecentlyViewed } from "@/components/TrackRecentlyViewed";
import {
  categoryToSlug,
  dummyProducts,
  getCategoryTags,
  getProductBySlug,
  slugToCategory,
  styleTags,
} from "@/lib/dummy-images";

// Render dynamically on demand — avoids pre-building all 196 product pages during
// deployment, which uses too much memory on Hostinger's server.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}): Promise<Metadata> {
  const { product: productSlug } = await params;
  const product = getProductBySlug(productSlug);

  if (!product) return { title: "Product not found — Oorvi Diamonds" };

  const title = `${product.name} | Oorvi Diamonds`;
  const description = product.description.slice(0, 155);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}) {
  const { category: categorySlug, product: productSlug } = await params;

  const category = slugToCategory(categorySlug);
  const product = getProductBySlug(productSlug);

  if (!category || !product || product.category !== category) notFound();

  const gallery = product.gallery.length > 0 ? product.gallery : [product.image];

  const related = dummyProducts.filter((p) => p.category === category && p.slug !== product.slug).slice(0, 4);

  return (
    <div>
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10 pt-6 pb-16">
        <nav className="flex items-center gap-2.5 text-[13.5px] text-ink/50 mb-6">
          <Link href="/" className="hover:text-brand transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/jewellery/${categorySlug}`} className="hover:text-brand transition-colors">{category}</Link>
          <span>/</span>
          <span className="text-brand">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-[60px] items-start">
          <ProductGallery images={gallery} alt={product.name} />

          <div>
            <div className="flex items-start justify-between gap-3 mb-1">
              <p className="text-xs tracking-[4px] uppercase text-gold">{category} Collection</p>
              <ProductShareButton name={product.name} />
            </div>
            <h1 className="font-heading text-3xl sm:text-[42px] leading-[1.15] text-brand mb-2">{product.name}</h1>
            <p className="text-xs text-ink/40 mb-4">SKU: {product.sku ?? product.slug.toUpperCase().replace(/-/g, "").slice(0, 12)}</p>
            <ProductPurchasePanel
              slug={product.slug}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              rating={product.rating}
              reviewCount={product.reviewCount}
              category={category}
              description={product.description}
              attributes={product.attributes}
            />
          </div>
        </div>

        <div className="mt-12">
          <ProductTabs
            productSlug={product.slug}
            description={product.description}
            rating={product.rating}
            reviewCount={product.reviewCount}
            attributes={product.attributes}
          />
          <ProductTags categoryTags={getCategoryTags(category)} tags={styleTags} />
        </div>

        <TrackRecentlyViewed slug={product.slug} />
        <ProductPagePromo />

        <RecentlyViewed excludeSlug={product.slug} />
      </div>

      {related.length > 0 && (
        <section className="bg-[#F4ECDC] py-12 sm:py-[80px]">
          <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
            <div className="text-center mb-11">
              <p className="text-xs tracking-[5px] uppercase text-gold mb-3.5">You may also love</p>
              <h2 className="font-heading text-3xl sm:text-[40px] text-brand">Similar Designs</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-[26px]">
              {related.map((p) => (
                <ProductCard
                  key={p.slug}
                  slug={p.slug}
                  image={p.image}
                  hoverImage={p.gallery && p.gallery.length > 1 ? p.gallery[p.gallery.length - 1] : undefined}
                  name={p.name}
                  price={p.price}
                  href={`/jewellery/${categoryToSlug(p.category)}/${p.slug}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
