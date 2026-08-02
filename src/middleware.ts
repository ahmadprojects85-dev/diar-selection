import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Block known scanner probe patterns
const SUSPICIOUS_PATHS = [
  "/.env",
  "/wp-admin",
  "/wp-login.php",
  "/.git",
  "/phpmyadmin",
  "/xmlrpc.php",
  "/config.json",
  "/.aws",
  "/eval",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Block malicious probes & scanner bots
  if (SUSPICIOUS_PATHS.some((path) => pathname.toLowerCase().includes(path))) {
    return new NextResponse("Access Denied", { status: 403 });
  }

  // 2. Protect Admin Routes (except login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login") && !pathname.startsWith("/api/")) {
    const token = request.cookies.get("admin-token")?.value;
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, _next, favicon
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
