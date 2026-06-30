import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;
  const response = NextResponse.redirect(new URL("/admin/login", origin), { status: 303 });
  response.cookies.delete("admin_auth");
  return response;
}
