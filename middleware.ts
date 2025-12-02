import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const i18n = createMiddleware(routing);

// Protected routes that require authentication
const protectedPaths = ["/dashboard", "/admin"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip auth check for API routes and static files
  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico")) {
    return i18n(request);
  }

  // Extract locale from the current pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0];
  const isLocale = routing.locales.includes(firstSegment as any);
  const locale = isLocale ? firstSegment : routing.defaultLocale;
  const pathWithoutLocale = isLocale ? "/" + pathSegments.slice(1).join("/") : pathname;
  
  // Check if the path (without locale) is protected
  const isProtectedPath = protectedPaths.some(path => 
    pathWithoutLocale === path || pathWithoutLocale.startsWith(path + "/")
  );

  // If path doesn't have locale and is protected, let i18n middleware add locale first
  // Then we'll check auth on the next request
  if (!isLocale && isProtectedPath) {
    // Let i18n middleware redirect to /{locale}/dashboard first
    return i18n(request);
  }

  // If path has locale and is protected, check authentication
  if (isLocale && isProtectedPath) {
    // Get session from Better Auth cookies
    const sessionToken = request.cookies.get("better-auth.session_token");
    
    if (!sessionToken) {
      // Redirect to login with locale and preserve the original path
      const loginUrl = new URL(`/${locale}/login`, request.url);
      // Store the full pathname with locale as the 'from' parameter
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Continue with i18n middleware for non-protected paths or authenticated users
  return i18n(request);
}

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/(en|ar)/:path*"],
};