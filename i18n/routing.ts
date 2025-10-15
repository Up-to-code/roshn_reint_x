import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
 

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",

  pathnames: {
    "/": {
      en: "/",
      ar: "/",
    },
    "/admin": {
      en: "/admin",
      ar: "/admin",
    },
    "/dashboard": {
      en: "/dashboard",
      ar: "/dashboard",
    },
    "/dashboard/global": {
      en: "/dashboard/global",
      ar: "/dashboard/global",
    },
    "/dashboard/settings": {
      en: "/dashboard/settings",
      ar: "/dashboard/settings",
    },
    "/login": {
      en: "/login",
      ar: "/login",
    },
    "/register": {
      en: "/register",
      ar: "/register",
    },
    "/projects": {
      en: "/projects",
      ar: "/projects",
    },
    "/about": {
      en: "/about",
      ar: "/about",
    },
    "/contact": {
      en: "/contact",
      ar: "/contact",
    },
    "/docs": {
      en: "/docs",
      ar: "/docs",
    },
    "/admin/projects": {
      en: "/admin/projects",
      ar: "/admin/projects",
    },
    "/admin/forms": {
      en: "/admin/forms",
      ar: "/admin/forms",
    },
    "/admin/blogs": {
      en: "/admin/blogs",
      ar: "/admin/blogs",
    },
    "/admin/media": {
      en: "/admin/media",
      ar: "/admin/media",
    },
    "/404": {
      en: "/404",
      ar: "/404",
    },
  },
});

// ✅ الأنواع (types)
export type Locale = (typeof routing.locales)[number];
export type Pathnames = keyof typeof routing["pathnames"];

// ✅ wrappers بتاعت Next-intl Navigation
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
