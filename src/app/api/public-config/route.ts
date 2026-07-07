import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

// Keys that are safe to expose publicly (no sensitive data)
const PUBLIC_KEYS = [
  "banners",
  "homepage",
  "testimonials",
  "collections",
  "settings",
  "newArrivals",
  "bestSellers",
  "categoryImages",
  "pageBanners",
  "reels",
  "trustBadges",
];

let cache: { data: Record<string, unknown>; at: number } | null = null;
const CACHE_TTL_MS = 30_000; // 30 seconds

// GET /api/public-config — no auth required, returns public site config
export async function GET() {
  try {
    if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
      return NextResponse.json(cache.data, {
        headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
      });
    }

    const prisma = getPrisma();
    const rows = await prisma.siteConfig.findMany({
      where: { key: { in: PUBLIC_KEYS } },
    });

    const result: Record<string, unknown> = {};
    for (const row of rows) result[row.key] = row.value;

    cache = { data: result, at: Date.now() };

    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
  } catch {
    return NextResponse.json({}, { status: 500 });
  }
}
