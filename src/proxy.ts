import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "admin_auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const authed = request.cookies.get(ADMIN_COOKIE)?.value === "1";
    if (!authed) {
      // Use request.nextUrl.origin so the redirect works correctly behind
      // Hostinger's reverse proxy (request.url gives 0.0.0.0:3000 internally).
      const loginUrl = new URL("/admin/login", request.nextUrl.origin);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
