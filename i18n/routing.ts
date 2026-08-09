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
    "/dashboard/settings": {
      en: "/dashboard/settings",
      ar: "/dashboard/settings",
    },
    "/dashboard/p": {
      en: "/dashboard/p",
      ar: "/dashboard/p",
    },
    "/dashboard/p/create": {
      en: "/dashboard/p/create",
      ar: "/dashboard/p/create",
    },
    "/dashboard/blog": {
      en: "/dashboard/blog",
      ar: "/dashboard/blog",
    },
    "/dashboard/home": {
      en: "/dashboard/home",
      ar: "/dashboard/home",
    },
    "/dashboard/about": {
      en: "/dashboard/about",
      ar: "/dashboard/about",
    },
    "/dashboard/forms": {
      en: "/dashboard/forms",
      ar: "/dashboard/forms",
    },
    "/dashboard/interests": {
      en: "/dashboard/interests",
      ar: "/dashboard/interests",
    },
    "/dashboard/services": {
      en: "/dashboard/services",
      ar: "/dashboard/services",
    },
    "/dashboard/leads": {
      en: "/dashboard/leads",
      ar: "/dashboard/leads",
    },
    "/dashboard/users": {
      en: "/dashboard/users",
      ar: "/dashboard/users",
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
    "/p": {
      en: "/p",
      ar: "/p",
    },
    "/services": {
      en: "/services",
      ar: "/services",
    },
    "/blog": {
      en: "/blog",
      ar: "/blog",
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
    "/terms": {
      en: "/terms",
      ar: "/terms",
    },
    "/privacy": {
      en: "/privacy",
      ar: "/privacy",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathnames = keyof typeof routing["pathnames"];

export const { Link } = createNavigation(routing);
