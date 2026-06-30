import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = formData.get("password");
  const next = (formData.get("next") as string) || "/admin";

  // Use NEXT_PUBLIC_SITE_URL so redirects work behind Hostinger's reverse proxy
  // (request.url gives the internal 0.0.0.0:3000 address, not the public domain).
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;

  if (password !== process.env.ADMIN_PASSWORD) {
    const url = new URL("/admin/login", origin);
    url.searchParams.set("next", next);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, { status: 303 });
  }

  const response = NextResponse.redirect(new URL(next, origin), { status: 303 });
  response.cookies.set("admin_auth", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return response;
}
