// --- Middleware code (middleware.ts) ---

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Route configuration - should match your client-side config
const ROUTES = {
  LANDING: "/",
  HOME: "/home",
  PROTECTED_ROUTES: ["/home", "/governance", "/markets"],
  // Public routes that don't require wallet connection
  PUBLIC_ROUTES: [
    "/",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
    "/predictions",
    "/nfts",
  ],
  // API routes and Next.js internals that should be excluded from middleware
  EXCLUDED_ROUTES: [
    "/api",
    "/_next",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
  ],
} as const;

// Helper function to check if route is protected
function isProtectedRoute(pathname: string): boolean {
  // Check if the exact pathname or a path starting with it is protected
  return ROUTES.PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

// Helper function to check if route is public
function isPublicRoute(pathname: string): boolean {
  // Check if the exact pathname or a path starting with it is public
  return ROUTES.PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route),
  );
}

// Helper function to check if route should be excluded from middleware
function isExcludedRoute(pathname: string): boolean {
  return ROUTES.EXCLUDED_ROUTES.some((route) => pathname.startsWith(route));
}

// Helper function to detect wallet connection status from cookies/headers
function getWalletConnectionStatus(request: NextRequest): {
  isConnected: boolean;
  hasWalletData: boolean;
} {
  const walletConnectedCookie = request.cookies.get("wallet-connected");
  const walletAddressCookie = request.cookies.get("wallet-address");

  // In a real application, you might validate the address or use a signed session cookie.
  const isConnected = !!(
    walletConnectedCookie?.value === "true" || walletAddressCookie?.value
  );
  const hasWalletData = !!walletAddressCookie?.value;

  return { isConnected, hasWalletData };
}

// Main middleware function
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, and Next.js internals
  if (isExcludedRoute(pathname)) {
    return NextResponse.next();
  }

  const { isConnected } = getWalletConnectionStatus(request);
  const url = request.nextUrl.clone();

  let response = NextResponse.next();

  // Add debug headers in development
  if (process.env.NODE_ENV === "development") {
    response.headers.set(
      "x-middleware-wallet-connected",
      isConnected.toString(),
    );
    response.headers.set("x-middleware-pathname", pathname);
  }

  // Apply security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Apply CORS headers for API routes
  if (pathname.startsWith("/api/")) {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
  }

  // Apply cache headers for static assets
  if (pathname.startsWith("/_next/static/")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable",
    );
  }

  // --- Core Authentication Logic ---

  // 1. Handle protected routes
  if (isProtectedRoute(pathname)) {
    if (!isConnected) {
      // User is not connected, redirect to landing page with return URL
      url.pathname = ROUTES.LANDING;
      url.searchParams.set("redirect", pathname);

      console.log(
        `[Middleware] Redirecting from protected route ${pathname} to landing (not connected)`,
      );
      return NextResponse.redirect(url);
    }
    // If connected, allow access to protected route
    console.log(`[Middleware] Allowing access to protected route ${pathname}`);
    return response;
  }

  // 2. Handle landing page when wallet is connected
  if (pathname === ROUTES.LANDING && isConnected) {
    const redirectTo = request.nextUrl.searchParams.get("redirect");

    if (redirectTo && isProtectedRoute(redirectTo)) {
      // If there's a valid redirect parameter from a protected route, go there
      url.pathname = redirectTo;
      url.searchParams.delete("redirect"); // Clean up the redirect param
    } else {
      // Otherwise, redirect to default home page
      url.pathname = ROUTES.HOME;
    }

    console.log(
      `[Middleware] Redirecting connected wallet from landing to ${url.pathname}`,
    );
    return NextResponse.redirect(url);
  }

  // 3. Handle public routes (allow access regardless of wallet status)
  if (isPublicRoute(pathname)) {
    console.log(`[Middleware] Allowing access to public route ${pathname}`);
    return response;
  }

  // Default: Allow the request to proceed for any other route not explicitly handled
  console.log(`[Middleware] Default: allowing request to ${pathname}`);
  return response;
}

// Middleware configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml (SEO files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
