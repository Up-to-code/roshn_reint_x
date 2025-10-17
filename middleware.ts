// FILE: middleware.ts
import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// 👇 إعداد i18n middleware
const i18n = createMiddleware(routing);

// 👇 دمج المصادقة مع i18n بشكل آمن لـ Edge runtime
const auth = withAuth(
  (req) => i18n(req),
  {
    pages: {
      signIn: "/api/auth/signin", // أو المسار اللي عندك
    },
  }
);

export default auth;

// 👇 إعداد matcher
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/(en|ar)/:path*",
  ],
};
