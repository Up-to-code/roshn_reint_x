import type { Metadata } from "next";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { siteConfig } from "@/config/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false,
}: { title?: string; description?: string; image?: string; noIndex?: boolean } = {}): Metadata {
  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    openGraph: { type: "website", locale: "ar_SA", url: siteConfig.url, title, description, siteName: siteConfig.name, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    icons: "/favicon.ico",
    manifest: "/site.webmanifest",
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export function formatDate(_createdAt: Date, input: string | number): string {
  return new Date(input).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function calculateReadingTime(content: string, locale: "ar" | "en" = "ar") {
  const words = stripHtml(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / (locale === "ar" ? 150 : 200)));
}

export function stripHtml(html: string): string {
  if (!html) return "";
  const entities: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&nbsp;": " ", "&hellip;": "…", "&mdash;": "—", "&ndash;": "–" };
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(amp|lt|gt|quot|#39|nbsp|hellip|mdash|ndash);/gi, entity => entities[entity.toLowerCase()] || entity)
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/\s+/g, " ")
    .trim();
}
