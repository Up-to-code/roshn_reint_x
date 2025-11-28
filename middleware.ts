import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  // Check if user is authenticated by looking for the session token cookie
  const token = req.cookies.get("next-auth.session-token") || req.cookies.get("__Secure-next-auth.session-token");
  
  const isDashboardRoute = req.nextUrl.pathname.includes("/dashboard");
  
  // If accessing dashboard and not authenticated, redirect to login
  if (isDashboardRoute && !token) {
    const locale = req.nextUrl.pathname.split('/')[1] || 'en';
    const loginUrl = new URL(`/${locale}/login`, req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Apply internationalization middleware
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    // Apply to all routes except static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
