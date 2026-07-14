export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { getPrisma } from "@/lib/prisma";
import { CuratedProductGrid } from "@/components/CuratedProductGrid";
import { HeroPeekCarousel } from "@/components/HeroPeekCarousel";
import { PromoSlider } from "@/components/PromoSlider";
import { SectionHeading } from "@/components/SectionHeading";
import { ReelsGrid } from "@/components/ReelsGrid";
import { Reveal } from "@/components/Reveal";
import {
  categoryImages as defaultCategoryImages,
  dummyProducts,
  dummyTestimonials,
  heroSlides,
  productImages,
  collectionImages,
} from "@/lib/dummy-images";
import type {
  AdminReel,
  AdminCollection,
  AdminTestimonial,
  HomepageSection,
  HeroSlideAdmin,
  PromoStrip,
  TrustBadge,
} from "@/lib/admin-store";

// Seed defaults (used when DB has no value yet)
const defaultSections: HomepageSection[] = [
  { id: "hero", label: "Hero slider", meta: "", manageLabel: "", enabled: true },
  { id: "categories", label: "Category circles", meta: "", manageLabel: "", enabled: true },
  { id: "best-sellers", label: "Best Sellers", meta: "", manageLabel: "", enabled: true },
  { id: "offer-banner", label: "Offer banner", meta: "", manageLabel: "", enabled: true },
  { id: "new-arrivals", label: "New Arrivals", meta: "", manageLabel: "", enabled: true },
  { id: "reels", label: "Video Reels", meta: "", manageLabel: "", enabled: true },
  { id: "collections", label: "Collections", meta: "", manageLabel: "", enabled: true },
  { id: "testimonials", label: "Testimonials", meta: "", manageLabel: "", enabled: true },
  { id: "trust-badges", label: "Trust badges", meta: "", manageLabel: "", enabled: true },
];

const defaultHeroSlides: HeroSlideAdmin[] = heroSlides.map((s, i) => ({
  id: `slide-${i + 1}`,
  title: s.alt,
  link: s.href,
  image: s.image,
  enabled: true,
}));

const defaultPromoStrips: PromoStrip[] = [
  { id: "promo-slide-1", position: "Homepage slider", title: "New Collection", link: "/jewellery", image: productImages[6], enabled: true },
  { id: "promo-slide-2", position: "Homepage slider", title: "Festive Sale", link: "/jewellery", image: productImages[2], enabled: true },
];

const defaultCollections: AdminCollection[] = [
  { id: "bridal", title: "Bridal", slug: "bridal", image: collectionImages.Bridal, productSlugs: [], enabled: true },
  { id: "everyday-light", title: "Everyday Light", slug: "everyday-light", image: collectionImages["Everyday Light"], productSlugs: [], enabled: true },
  { id: "gifting", title: "Gifting", slug: "gifting", image: collectionImages.Gifting, productSlugs: [], enabled: true },
  { id: "oorvi-diamond", title: "Oorvi Diamond", slug: "oorvi-diamond", image: collectionImages["Oorvi Diamond"], productSlugs: [], enabled: true },
];

const defaultTestimonials: AdminTestimonial[] = dummyTestimonials.map((t, i) => ({
  id: `testimonial-${i + 1}`,
  name: t.name,
  rating: t.rating,
  text: t.text,
  avatar: t.avatar,
  status: "approved" as const,
  featured: i === 0,
}));

const defaultTrustBadges: TrustBadge[] = [
  { id: "badge-1", icon: "✦", label: "Certified Diamonds", sub: "Every diamond is independently certified for cut, clarity and carat.", enabled: true },
  { id: "badge-2", icon: "◈", label: "BIS Hallmarked", sub: "All gold is BIS hallmarked — purity you can trust, always.", enabled: true },
  { id: "badge-3", icon: "↺", label: "Lifetime Exchange", sub: "Exchange any Oorvi piece, any time, at full diamond value.", enabled: true },
  { id: "badge-4", icon: "✧", label: "Insured Shipping", sub: "Complimentary, fully insured delivery across India.", enabled: true },
];

const instaPosts = productImages.slice(0, 5).map((image, i) => ({
  image,
  likes: ["2,148", "1,872", "3,021", "1,540", "2,689"][i],
}));

const categoryTiles = [
  { name: "Diamond Rings", href: "/jewellery/rings", imageKey: "Rings" as const },
  { name: "Necklaces & Pendants", href: "/jewellery/necklaces", imageKey: "Necklaces" as const },
  { name: "Earrings", href: "/jewellery/earrings", imageKey: "Earrings" as const },
  { name: "Bangles & Bracelets", href: "/jewellery/bracelets", imageKey: "Bracelets" as const },
];

async function getSiteConfig() {
  try {
    const prisma = getPrisma();
    const rows = await prisma.siteConfig.findMany({
      where: {
        key: { in: ["banners", "homepage", "testimonials", "collections", "newArrivals", "bestSellers", "categoryImages", "reels", "trustBadges"] },
      },
    });
    const db: Record<string, unknown> = {};
    for (const row of rows) db[row.key] = row.value;
    return db;
  } catch {
    return {};
  }
}

export default async function Home() {
  const db = await getSiteConfig();

  // Banners
  const banners = db.banners as { heroSlidesAdmin?: HeroSlideAdmin[]; promoStrips?: PromoStrip[] } | undefined;
  const heroSlidesAdmin: HeroSlideAdmin[] = banners?.heroSlidesAdmin ?? defaultHeroSlides;
  const promoStrips: PromoStrip[] = banners?.promoStrips ?? defaultPromoStrips;

  // Sections
  const homepageSections: HomepageSection[] = (db.homepage as HomepageSection[]) ?? defaultSections;
  const isOn = (id: string) => homepageSections.find((s) => s.id === id)?.enabled ?? true;

  // Content
  const collections: AdminCollection[] = (db.collections as AdminCollection[]) ?? defaultCollections;
  const testimonials: AdminTestimonial[] = (db.testimonials as AdminTestimonial[]) ?? defaultTestimonials;
  const reels: AdminReel[] = (db.reels as AdminReel[]) ?? [];
  const trustBadges: TrustBadge[] = (db.trustBadges as TrustBadge[]) ?? defaultTrustBadges;
  const catImages: Record<string, string> = (db.categoryImages as Record<string, string>) ?? {};
  const newArrivalsSlugs: string[] = (db.newArrivals as string[]) ?? dummyProducts.slice(0, 8).map((p) => p.slug);
  const bestSellersSlugs: string[] = (db.bestSellers as string[]) ?? dummyProducts.slice(8, 16).map((p) => p.slug);

  // Derived
  const liveHeroSlides = heroSlidesAdmin
    .filter((s) => s.enabled)
    .map((s) => ({ image: s.image, href: s.link, alt: s.title }));

  const homeSlides = promoStrips.filter((p) => p.position === "Homepage slider" && p.enabled !== false);
  const liveCollections = collections.filter((c) => c.enabled);
  const [heroCollection, ...restCollections] = liveCollections;
  const liveTestimonials = testimonials
    .filter((t) => t.status === "approved")
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, 3);
  const liveTrustBadges = trustBadges.filter((b) => b.enabled);

  return (
    <div className="pb-16">
      {/* Announcement handled globally by AnnouncementBar in SiteChrome */}

      {/* Hero — peeking carousel */}
      {isOn("hero") && (
        <section className="pt-5 pb-2">
          <HeroPeekCarousel slides={liveHeroSlides} />
        </section>
      )}

      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
        {/* Shop by Category */}
        {isOn("categories") && (
          <section className="py-12 sm:py-[90px]">
            <Reveal className="text-center mb-12">
              <p className="text-xs tracking-[5px] uppercase text-gold mb-3.5">Curated for you</p>
              <h2 className="font-heading text-4xl sm:text-[44px] text-brand">Shop by Category</h2>
            </Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-[26px]">
              {categoryTiles.map((tile, i) => (
                <Reveal key={tile.name} delay={i * 0.08}>
                  <Link href={tile.href} className="block text-center group">
                    <div className="relative aspect-[3/3.6] overflow-hidden bg-beige">
                      <Image
                        src={catImages[tile.imageKey] || defaultCategoryImages[tile.imageKey] || ""}
                        alt={tile.name}
                        fill
                        sizes="(min-width:640px) 25vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="font-heading text-lg sm:text-2xl text-brand mt-4">{tile.name}</div>
                    <div className="text-[11px] tracking-[2.5px] uppercase text-gold mt-1.5">Explore →</div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Gold divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-beige" />
          <div className="h-2 w-2 bg-gold rotate-45" />
          <div className="flex-1 h-px bg-beige" />
        </div>

        {/* Bestsellers */}
        {isOn("best-sellers") && (
          <section className="py-12 sm:py-[90px]">
            <Reveal className="flex items-end justify-between mb-11">
              <div>
                <p className="text-xs tracking-[5px] uppercase text-gold mb-3.5">Most loved</p>
                <h2 className="font-heading text-4xl sm:text-[44px] text-brand">Bestsellers</h2>
              </div>
              <Link href="/jewellery?sort=bestselling" className="text-xs tracking-[2.5px] uppercase text-gold border-b border-gold pb-1 hover:text-brand hover:border-brand transition-colors">
                View all
              </Link>
            </Reveal>
            <CuratedProductGrid slugs={bestSellersSlugs} badge="Bestseller" />
          </section>
        )}
      </div>

      {/* Promo slider — full bleed */}
      {isOn("offer-banner") && <PromoSlider slides={homeSlides} />}

      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
        {/* New Arrivals */}
        {isOn("new-arrivals") && (
          <section className="py-12 sm:py-[90px]">
            <Reveal className="flex items-end justify-between mb-11">
              <div>
                <p className="text-xs tracking-[5px] uppercase text-gold mb-3.5">Just landed</p>
                <h2 className="font-heading text-4xl sm:text-[44px] text-brand">New Arrivals</h2>
              </div>
              <Link href="/jewellery?sort=newest" className="text-xs tracking-[2.5px] uppercase text-gold border-b border-gold pb-1 hover:text-brand hover:border-brand transition-colors">
                View all
              </Link>
            </Reveal>
            <CuratedProductGrid slugs={newArrivalsSlugs} badge="New" />
          </section>
        )}

        {/* Collections bento */}
        {isOn("collections") && heroCollection && (
          <section className="py-12 sm:py-[90px]">
            <Reveal className="text-center mb-12">
              <p className="text-xs tracking-[5px] uppercase text-gold mb-3.5">Signature lines</p>
              <h2 className="font-heading text-4xl sm:text-[44px] text-brand">Our Collections</h2>
            </Reveal>
            <Reveal className="grid grid-cols-1 sm:grid-cols-[1.35fr_1fr_1fr] sm:grid-rows-[280px_280px] gap-6">
              <Link href={`/collections/${heroCollection.slug}`} className="relative sm:row-span-2 h-[280px] sm:h-auto overflow-hidden block group">
                <Image src={heroCollection.image} alt={heroCollection.title} fill sizes="(min-width:640px) 40vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand/85 to-transparent" />
                <div className="absolute left-0 right-0 bottom-0 p-7">
                  <div className="font-heading text-3xl text-gold-light">{heroCollection.title}</div>
                  <div className="text-xs tracking-[2.5px] uppercase text-gold mt-1.5">Explore →</div>
                </div>
              </Link>
              {restCollections.map((c) => (
                <Link key={c.id} href={`/collections/${c.slug}`} className="relative h-[280px] overflow-hidden block group">
                  <Image src={c.image} alt={c.title} fill sizes="(min-width:640px) 25vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand/85 to-transparent" />
                  <div className="absolute left-0 right-0 bottom-0 p-5">
                    <div className="font-heading text-2xl text-gold-light">{c.title}</div>
                    <div className="text-[11px] tracking-[2.5px] uppercase text-gold mt-1">Explore →</div>
                  </div>
                </Link>
              ))}
            </Reveal>
          </section>
        )}
      </div>

      {/* Video Reels — dark section */}
      {isOn("reels") && reels.filter((r) => r.enabled).length > 0 && (
        <section className="bg-brand py-12 sm:py-[90px]">
          <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
            <Reveal className="text-center mb-12">
              <p className="text-xs tracking-[5px] uppercase text-gold-light/70 mb-3.5">Watch & shop</p>
              <h2 className="font-heading text-4xl sm:text-[44px] text-gold-light">Oorvi in Motion</h2>
            </Reveal>
            <ReelsGrid reels={reels} />
          </div>
        </section>
      )}

      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
        {/* Instagram */}
        <section className="py-12 sm:py-[90px]">
          <Reveal className="text-center mb-12">
            <p className="flex items-center justify-center gap-2.5 text-xs tracking-[5px] uppercase text-gold mb-3.5">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
              </svg>
              @oorvidiamonds
            </p>
            <h2 className="font-heading text-4xl sm:text-[44px] text-brand">Follow Us on Instagram</h2>
            <p className="font-light text-sm sm:text-base text-ink/60 mt-3.5 max-w-md mx-auto">
              Styling stories, behind-the-scenes craftsmanship and new drops — every week.
            </p>
          </Reveal>
          <Reveal className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            {instaPosts.map((post, i) => (
              <a key={i} href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="relative aspect-square overflow-hidden block bg-beige group">
                <Image src={post.image} alt="Instagram post" fill sizes="20vw" className="object-cover" />
                <div className="absolute inset-0 bg-brand/0 group-hover:bg-brand/55 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="flex items-center gap-1.5 text-gold-light text-sm">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.3l7.8-7.8 1-1.1a5.5 5.5 0 0 0 0-7.8z" /></svg>
                    {post.likes}
                  </span>
                </div>
              </a>
            ))}
          </Reveal>
          <div className="text-center mt-10">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="inline-block border border-brand text-brand px-9 py-3.5 text-xs tracking-[2.5px] uppercase hover:bg-brand hover:text-gold-light transition-colors">
              Follow @oorvidiamonds
            </a>
          </div>
        </section>
      </div>

      {/* Brand story — dark section */}
      <section className="bg-brand text-gold-light/90">
        <div className="mx-auto max-w-[1360px] grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="relative h-[320px] lg:h-[560px]">
            <Image
              src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&h=1000&fit=crop"
              alt="Diamond craftsmanship"
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <Reveal className="px-6 sm:px-10 lg:px-20 py-16 lg:py-20">
            <p className="text-xs tracking-[5px] uppercase text-gold-light/70 mb-4.5">The House of Oorvi</p>
            <h2 className="font-heading text-3xl sm:text-[44px] leading-[1.15] text-gold-light mb-6">
              Every diamond tells a story of light
            </h2>
            <p className="font-light text-[15px] sm:text-base leading-[1.85] text-gold-light/70 mb-8">
              Each Oorvi piece begins with a hand-selected, certified diamond and is brought to life by
              master craftsmen. From the first sketch to the final polish, we honour a tradition of
              excellence — so what you wear isn&apos;t just jewellery, it&apos;s a legacy.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-5 sm:gap-x-11 mb-9">
              {[
                { stat: "100%", label: "Certified diamonds" },
                { stat: "BIS", label: "Hallmarked gold" },
                { stat: "Lifetime", label: "Exchange promise" },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center gap-x-6 sm:gap-x-11">
                  {i > 0 && <div className="w-px h-10 bg-gold-light/25 hidden sm:block" />}
                  <div>
                    <div className="font-heading text-3xl sm:text-4xl text-gold">{s.stat}</div>
                    <div className="text-[11px] tracking-[2px] uppercase text-gold-light/50 mt-1">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/about" className="inline-block border border-gold text-gold-light px-9 py-3.5 text-xs tracking-[2.5px] uppercase hover:bg-gold/10 transition-colors">
              Read Our Story
            </Link>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
        {/* Assurance strip */}
        {isOn("trust-badges") && (
          <section className="py-12 sm:py-[70px] grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-[26px] text-center">
            {liveTrustBadges.map((b, i) => (
              <Reveal key={b.id} delay={i * 0.08} className="flex flex-col items-center gap-3.5">
                <div className="h-[54px] w-[54px] border border-gold rotate-45 flex items-center justify-center">
                  <span className="-rotate-45 font-heading text-xl text-gold">{b.icon}</span>
                </div>
                <div className="font-heading text-lg sm:text-xl text-brand mt-1.5">{b.label}</div>
                <p className="text-xs sm:text-[13.5px] font-light text-ink/60 leading-relaxed max-w-[220px]">{b.sub}</p>
              </Reveal>
            ))}
          </section>
        )}

        {/* Testimonials */}
        {isOn("testimonials") && (
          <section className="pb-16 sm:pb-24">
            <SectionHeading title="What our customers say" subtitle="★ 4.8 average · 12,400+ verified reviews" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {liveTestimonials.map((t) => (
                <div key={t.id} className="rounded-lg border border-beige p-4">
                  <div className="text-gold text-sm mb-2">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
                  <p className="text-sm text-ink/80 leading-relaxed mb-3">{t.text}</p>
                  <div className="flex items-center gap-2">
                    {t.avatar ? (
                      <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0">
                        <Image src={t.avatar} alt={t.name} fill sizes="32px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-brand/10 flex items-center justify-center text-brand text-sm font-medium shrink-0">
                        {t.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm font-medium text-brand">{t.name}</span>
                    <span className="text-xs text-gold ml-auto">✓ verified</span>
                  </div>
                </div>
              ))}
              {liveTestimonials.length === 0 && (
                <p className="col-span-full text-center text-sm text-ink/40 py-8">No approved testimonials yet.</p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
