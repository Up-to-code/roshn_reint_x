import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Simple i18n middleware wrapper - no auth logic
// Auth is handled in dashboard layout
export default createMiddleware(routing);

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    // Only localize application routes. Public assets (anything with a file
    // extension) must stay at their root URL instead of being redirected to
    // paths such as `/ar/logo.png`.
    "/((?!api|_next|roshn-plus|.*\\..*).*)",
  ],
};
