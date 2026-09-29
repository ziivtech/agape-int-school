import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, readSessionToken } from "./lib/auth/session";

// Keeps anyone without a valid signed session out of the admin area.
// Per-role checks happen in each API route (lib/auth/server.ts).
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isAuthApi = pathname === "/api/admin/auth";
  if (isLoginPage || isAuthApi) return NextResponse.next();

  const session = await readSessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (session) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ success: false, error: "Please sign in." }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", req.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
