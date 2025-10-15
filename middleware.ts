// @ts-ignore - NextAuth middleware helper is exported from our local setup
import { auth } from "auth";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Compose auth with i18n middleware in a single default export
const i18n = createMiddleware(routing);

export default auth((req) => {
  return i18n(req);
});


// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)" , "/(en|ar)/:path*"],
}