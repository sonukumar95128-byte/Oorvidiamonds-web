import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { CartProvider } from "@/lib/cart-store";
import { AdminProvider } from "@/lib/admin-store";
import { WishlistProvider } from "@/lib/wishlist-store";
import { UserProvider } from "@/lib/user-store";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")),
  title: {
    default: "Oorvi Diamonds — Fine Diamond Jewellery",
    template: "%s",
  },
  description: "Certified diamonds set in 18K gold — handcrafted fine jewellery for every occasion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-ink">
        <AdminProvider>
          <UserProvider>
            <CartProvider>
              <WishlistProvider>
                <SiteChrome>{children}</SiteChrome>
              </WishlistProvider>
            </CartProvider>
          </UserProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
