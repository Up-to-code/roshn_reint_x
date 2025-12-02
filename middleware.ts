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

  // Extract locale from the pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0];
  const isLocale = routing.locales.includes(firstSegment as any);
  
  // If path doesn't have locale, let i18n middleware handle it first
  // It will redirect /dashboard to /ar/dashboard (default locale)
  if (!isLocale && pathname !== "/") {
    return i18n(request);
  }

  // If path has locale, check if it's protected
  if (isLocale) {
    const locale = firstSegment;
    const pathWithoutLocale = "/" + pathSegments.slice(1).join("/");
    
    // Skip auth check for login/register pages to avoid redirect loops
    if (pathWithoutLocale === "/login" || pathWithoutLocale === "/register") {
      return i18n(request);
    }
    
    // Check if the path (without locale) is protected
    const isProtectedPath = protectedPaths.some(path => 
      pathWithoutLocale === path || pathWithoutLocale.startsWith(path + "/")
    );

    if (isProtectedPath) {
      // Check for Better Auth session cookie
      // Better Auth uses "better-auth.session_token" as the cookie name
      const sessionToken = request.cookies.get("better-auth.session_token");
      
      // Also check for alternative cookie names that Better Auth might use
      const hasSession = sessionToken || 
                        request.cookies.get("better-auth.session") ||
                        request.cookies.get("better-auth_session_token");
      
      if (!hasSession) {
        // Redirect to login with locale - no query parameters needed
        // After login, user will be redirected to dashboard by default
        const loginUrl = new URL(`/${locale}/login`, request.url);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // Continue with i18n middleware for all other cases
  return i18n(request);
}

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/(en|ar)/:path*"],
};