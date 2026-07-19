import Image from "next/image";
import Link from "next/link";

const shopLinks = ["Rings", "Earrings", "Necklaces", "Bracelets", "Pendants", "Nose Pins"];
const companyLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Certification", href: "/help/care-warranty" },
  { label: "Lifetime Exchange", href: "/help/care-warranty" },
  { label: "Contact Us", href: "/help/contact" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M15 8.5h-2a1.5 1.5 0 0 0-1.5 1.5v2H15l-.5 3H11.5v6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER ?? ""}`,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M7 17l-3 1 1-3a7.5 7.5 0 1 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 9.5c0 2.5 2.5 5 5 5 .5-1 .5-1.5 0-2l-1.5-.5-1 1c-1-.5-2-1.5-2.5-2.5l1-1-.5-1.5c-.5-.5-1-.5-2 0z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="bg-brand text-gold-light/70">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10 pt-12 sm:pt-[70px] pb-6 sm:pb-[30px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-[50px] pb-8 sm:pb-[50px] border-b border-gold-light/15">
          <div>
            <Image src="/brand/oorvi-logo.png" alt="Oorvi Diamonds" width={200} height={64} className="h-14 w-auto object-contain rounded-md mb-4" />
            <p className="text-sm font-light leading-relaxed text-gold-light/60 max-w-[280px]">
              Fine diamond jewellery, crafted to celebrate every moment of your life.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-8 w-8 place-items-center rounded-full border border-gold-light/30 text-gold-light/80 hover:border-gold hover:text-gold transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[3px] uppercase text-gold-light mb-5">Shop</h4>
            <ul className="space-y-3 text-sm font-light">
              {shopLinks.map((l) => (
                <li key={l}>
                  <Link href={`/jewellery/${l.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-gold">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[3px] uppercase text-gold-light mb-5">Company</h4>
            <ul className="space-y-3 text-sm font-light">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[3px] uppercase text-gold-light mb-5">Stay in touch</h4>
            <p className="text-sm font-light mb-4 text-gold-light/60">New collections and private previews, in your inbox.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 min-w-0 bg-white/[0.06] border border-gold-light/30 text-gold-light placeholder:text-gold-light/40 px-4 py-3 text-sm focus:outline-none"
              />
              <button className="shrink-0 bg-gold text-brand px-5 py-3 text-xs tracking-[2px] uppercase hover:bg-gold-light transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 pt-6 text-xs font-light text-gold-light/45 text-center sm:text-left">
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-gold-light/80">Privacy</Link>
            <Link href="/terms" className="hover:text-gold-light/80">Terms</Link>
            <Link href="/help/shipping-returns" className="hover:text-gold-light/80">Shipping & Returns</Link>
          </div>
          <div className="sm:text-right leading-relaxed">
            <p>A-607, Kakade City, Karvenagar, Pune 411052</p>
            <p>WhatsApp: +91 70574 18065 · © {new Date().getFullYear()} Oorvi Diamonds</p>
          </div>
        </div>

        <p className="text-center text-xs font-light text-gold-light/35 pt-5">
          Developed by Diiamond Guru Professiional Service
        </p>
      </div>
    </footer>
  );
}
