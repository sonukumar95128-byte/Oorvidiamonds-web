"use client";

import Link from "next/link";
import { CuratedProductGrid } from "@/components/CuratedProductGrid";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { getOorviDiamondSlugs } from "@/lib/dummy-images";

const heroImage =
  "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1800&h=900&fit=crop";
const storyImage =
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&h=1000&fit=crop";

const features = [
  {
    title: "IGI Certified",
    text: "Every diamond arrives with an independent certificate of authenticity.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  {
    title: "Ethically Sourced",
    text: "Conflict-free stones, traceable from mine to setting.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8L12 3z" />
    ),
  },
  {
    title: "Handcrafted in India",
    text: "Set by master artisans with decades of fine jewellery craft.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l7 4v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-4z" />
    ),
  },
  {
    title: "Lifetime Exchange",
    text: "Trade up any Oorvi Diamond piece at its original value, always.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h5M20 20v-5h-5M4 9a8 8 0 0114.9-3M20 15a8 8 0 01-14.9 3" />
    ),
  },
];

export default function OorviDiamondPage() {
  const slugs = getOorviDiamondSlugs();

  return (
    <div>
      {/* Hero */}
      <section className="relative aspect-[4/5] sm:aspect-[16/7] w-full overflow-hidden flex items-center justify-center">
        <img
          src={heroImage}
          alt="Oorvi Diamond"
          className="absolute inset-0 h-full w-full object-cover animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand/85 via-brand/25 to-transparent" />
        <div className="relative z-10 text-center px-4">
          <p className="animate-fadeUp text-xs sm:text-sm tracking-[0.3em] uppercase text-gold-light mb-3">
            The Diamond Edit
          </p>
          <h1
            className="animate-fadeUp font-heading text-4xl sm:text-6xl text-white"
            style={{ animationDelay: "0.1s" }}
          >
            Oorvi Diamond
          </h1>
          <p
            className="animate-fadeUp mt-4 max-w-md mx-auto text-sm sm:text-base text-white/85"
            style={{ animationDelay: "0.2s" }}
          >
            Where every facet is cut to catch the light — and hold your story.
          </p>
          <a
            href="#collection"
            className="animate-fadeUp relative inline-block mt-8 overflow-hidden rounded-full bg-gold px-8 py-3 text-sm font-medium text-brand hover:bg-gold-light transition-colors"
            style={{ animationDelay: "0.3s" }}
          >
            <span className="relative z-10">Explore the Collection</span>
            <span className="animate-shimmer absolute inset-0" />
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 space-y-20 sm:space-y-28">
        {/* Brand story */}
        <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden order-2 lg:order-1">
            <img src={storyImage} alt="Diamond craftsmanship" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Our Craft</p>
            <h2 className="font-heading text-3xl sm:text-4xl text-brand mb-5">
              Brilliance, deliberately made
            </h2>
            <p className="text-sm sm:text-base text-ink/70 leading-relaxed mb-4">
              Oorvi Diamond pieces begin as hand-selected rough stones, graded for colour and clarity
              before a single cut is made. Our artisans shape each setting around the stone&apos;s
              natural light, not the other way around.
            </p>
            <p className="text-sm sm:text-base text-ink/70 leading-relaxed">
              The result is jewellery built to be worn for generations — certified, traceable, and
              finished entirely by hand.
            </p>
          </div>
        </Reveal>

        {/* Feature strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08} className="text-center rounded-2xl border border-beige bg-white px-4 py-8 hover:-translate-y-1 transition-transform duration-300">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-beige text-gold">
                <svg className="h-6 w-6 animate-sparkle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {f.icon}
                </svg>
              </div>
              <h3 className="font-heading text-base text-brand mb-1.5">{f.title}</h3>
              <p className="text-xs text-ink/60 leading-relaxed">{f.text}</p>
            </Reveal>
          ))}
        </div>

        {/* Curated products */}
        <div id="collection" className="scroll-mt-24">
          <Reveal>
            <SectionHeading title="The Diamond Edit" subtitle="A curated edit of our finest diamond pieces" />
          </Reveal>
          <Reveal delay={0.1}>
            <CuratedProductGrid slugs={slugs} />
          </Reveal>
        </div>

        {/* Closing CTA */}
        <Reveal className="relative overflow-hidden rounded-2xl bg-brand px-6 sm:px-12 py-14 text-center">
          <span className="animate-sparkle absolute top-6 left-8 h-2 w-2 rounded-full bg-gold" />
          <span className="animate-sparkle absolute bottom-8 right-10 h-1.5 w-1.5 rounded-full bg-gold-light" style={{ animationDelay: "0.6s" }} />
          <h2 className="font-heading text-2xl sm:text-3xl text-white mb-3">
            Find the diamond that finds you
          </h2>
          <p className="text-sm text-white/70 mb-7 max-w-md mx-auto">
            Explore the full jewellery edit or speak with our team for a bespoke diamond piece.
          </p>
          <Link
            href="/jewellery"
            className="inline-block rounded-full bg-gold px-8 py-3 text-sm font-medium text-brand hover:bg-gold-light transition-colors"
          >
            Shop All Jewellery
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
