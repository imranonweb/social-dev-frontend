import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected private routes as per PDF specification
const protectedRoutes = [
  "/create-event",
  "/manage-events",
  "/joined-events",
  "/profile",
];

// Auth routes (redirect to home or destination if already logged in)
const authRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for Better-Auth session token or backend access token cookie
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value ||
    request.cookies.get("access-token")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If accessing a private protected route without any session token
  if (isProtectedRoute && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and visiting login/register
  if (isAuthRoute && sessionToken) {
    const redirectParam = request.nextUrl.searchParams.get("redirect") || "/";
    return NextResponse.redirect(new URL(redirectParam, request.url));
  }

  return NextResponse.next();
}

// Next.js 16 supports proxy as the successor to middleware
export const middleware = proxy;

export const config = {
  matcher: [
    "/create-event/:path*",
    "/manage-events/:path*",
    "/joined-events/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};

