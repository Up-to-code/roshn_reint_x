import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const i18n = createMiddleware(routing);

// Protected routes that require authentication
const protectedPaths = ["/dashboard"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => 
    pathname.includes(path)
  );

  if (isProtectedPath) {
    // Get session from Better Auth cookies
    const sessionToken = request.cookies.get("better-auth.session_token");
    
    if (!sessionToken) {
      // Redirect to login if not authenticated
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Continue with i18n middleware
  return i18n(request);
}

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/(en|ar)/:path*"],
};