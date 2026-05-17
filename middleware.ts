import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Simple i18n middleware wrapper - no auth logic
// Auth is handled in dashboard layout
export default createMiddleware(routing);

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|roshn-plus).*)",
    "/(en|ar)/:path*",
  ],
};
