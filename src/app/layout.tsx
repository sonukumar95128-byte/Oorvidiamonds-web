import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { CartProvider } from "@/lib/cart-store";
import { AdminProvider } from "@/lib/admin-store";
import { WishlistProvider } from "@/lib/wishlist-store";
import { CompareProvider } from "@/lib/compare-store";
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

const siteName = "Oorvi Diamonds";
const defaultTitle = "Oorvi Diamonds — Fine Diamond Jewellery";
const defaultDescription = "Certified diamonds set in 18K gold — handcrafted fine jewellery for every occasion.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")),
  title: {
    default: defaultTitle,
    template: "%s",
  },
  description: defaultDescription,
  openGraph: {
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/brand/oorvi-logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [{ url: "/brand/oorvi-logo.png" }],
  },
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
                <CompareProvider>
                  <SiteChrome>{children}</SiteChrome>
                </CompareProvider>
              </WishlistProvider>
            </CartProvider>
          </UserProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
