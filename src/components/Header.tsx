"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { useUser } from "@/lib/user-store";
import { CartDrawer } from "@/components/CartDrawer";

const navLinks = [
  { label: "All Jewellery", href: "/jewellery" },
  { label: "Rings", href: "/jewellery/rings" },
  { label: "Earrings", href: "/jewellery/earrings" },
  { label: "Necklaces", href: "/jewellery/necklaces" },
  { label: "Pendants", href: "/jewellery/pendants" },
  { label: "Bracelets", href: "/jewellery/bracelets" },
  { label: "Nose Pins", href: "/jewellery/nose-pins" },
];

function HeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.3l7.8-7.8 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 7h12l1.5 13a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 20z" />
      <path d="M9 10V6a3 3 0 0 1 6 0v4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.5" y2="16.5" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

export function Header() {
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, isLoggedIn } = useUser();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-ivory border-b border-beige">
        <div className="mx-auto max-w-[1560px] flex items-center gap-6 sm:gap-8 px-4 sm:px-6 lg:px-10 py-[10px]">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="lg:hidden shrink-0 text-brand hover:text-gold transition-colors"
          >
            <MenuIcon />
          </button>

          <Link href="/" className="shrink-0 rounded-lg overflow-hidden">
            <Image src="/brand/oorvi-logo.png" alt="Oorvi Diamonds" width={160} height={52} className="h-[52px] w-auto object-contain block" priority />
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-[14.5px] text-ink/85 shrink-0">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="whitespace-nowrap py-2 hover:text-brand transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <form onSubmit={handleSearchSubmit} className="hidden sm:flex flex-1 min-w-[180px] items-center gap-3 rounded-full border border-beige bg-white px-5 py-[9px] text-ink/50">
            <SearchIcon />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for diamond necklace"
              className="flex-1 bg-transparent text-[15px] text-ink placeholder:text-ink/40 focus:outline-none"
            />
          </form>

          <div className="flex items-center gap-6 shrink-0 ml-auto sm:ml-0">
            <Link href="/account/wishlist" aria-label="Wishlist" className="relative text-brand hover:text-gold transition-colors">
              <HeartIcon />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 grid h-4 w-4 place-items-center rounded-full bg-brand text-[10px] text-gold-light">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>
            <Link href={isLoggedIn ? "/account" : "/login"} aria-label="Account" className="text-brand hover:text-gold transition-colors">
              {isLoggedIn && user ? (
                <span className="font-heading italic text-base font-semibold">{user.name.charAt(0).toUpperCase()}</span>
              ) : (
                <UserIcon />
              )}
            </Link>
            <button onClick={() => setCartOpen(true)} aria-label="Cart" className="relative text-brand hover:text-gold transition-colors">
              <BagIcon />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 grid h-4 w-4 place-items-center rounded-full bg-brand text-[10px] text-gold-light">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} className="fixed inset-0 z-[98] bg-brand/50 animate-fadeIn lg:hidden" />
          <div className="fixed top-0 left-0 bottom-0 z-[99] w-[85%] max-w-[320px] bg-ivory shadow-2xl flex flex-col lg:hidden animate-fadeUp" style={{ animationDuration: "0.3s" }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-beige shrink-0">
              <Image src="/brand/oorvi-logo.png" alt="Oorvi Diamonds" width={130} height={42} className="h-9 w-auto object-contain rounded-md" />
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="text-2xl leading-none text-brand hover:text-gold">
                ×
              </button>
            </div>

            <form
              onSubmit={(e) => {
                handleSearchSubmit(e);
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 mx-6 mt-5 rounded-full border border-beige bg-white px-4 py-2.5 text-ink/50"
            >
              <SearchIcon />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for diamond necklace"
                className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
              />
            </form>

            <nav className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 text-[15px] text-ink/85 border-b border-beige/70 hover:text-brand transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
