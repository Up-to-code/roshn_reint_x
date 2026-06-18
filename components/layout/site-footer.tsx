"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Link, type Pathnames } from "@/i18n/routing";
import { Phone } from "lucide-react";
import { useState, useEffect } from "react";

const PHONE_NUMBER = "1234567890";
const WHATSAPP_NUMBER = "1234567890";
const INSTAGRAM_URL = "https://www.instagram.com/roshnreit?igsh=MXFlbTk5eGwzd3J6MA==";
const SNAPCHAT_URL = "https://snapchat.com/t/9vzZRHpk";
const TIKTOK_URL = "https://tiktok.com";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  const t = useTranslations("footer");
  const [year, setYear] = useState<number | null>(null);

  // Only set the year on client side to avoid hydration mismatch
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const footerLinks: Array<{ label: string; href: Pathnames }> = [
    { label: t("home"), href: "/" },
    { label: t("projects"), href: "/p" },
    { label: t("services"), href: "/services" },
    { label: t("blog"), href: "/blog" },
    { label: t("about"), href: "/about" },
    { label: t("contact"), href: "/contact" },
  ];

  return (
    <footer className={cn("mt-auto border-t border-stone-300 py-12 text-gray-700", className)} style={{ backgroundColor: "#F0EDE8" }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-8">
          {/* Top Section: Logo, Links, Social */}
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Logo & Copyright */}
            <div className="flex flex-col items-center gap-4 md:items-start">
              <div className="relative h-20 w-96">
                <Image
                  src="https://qtthbbfudgvtstwevhbf.supabase.co/storage/v1/object/public/images/main_logo__5_-images-8-removebg-preview.png"
                  alt="Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <p className="text-sm text-gray-500">
                © {year || "2024"} {t("brandName")}. {t("rightsReserved")}.
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-wrap justify-center gap-6 md:justify-end">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center justify-center gap-4 border-t pt-6">
            {/* Instagram */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-pink-100 p-3 text-pink-600 transition-all hover:bg-pink-200 hover:scale-110"
              aria-label="Instagram"
            >
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            
            {/* Snapchat */}
            <a
              href={SNAPCHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-yellow-100 p-3 text-yellow-500 transition-all hover:bg-yellow-200 hover:scale-110"
              aria-label="Snapchat"
            >
              <svg
                className="size-5"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.5a5.503 5.503 0 0 0-5.32 4.394c-.201 1.109.13 1.97.668 2.502.5.495.496.883.473 1.25-.035.534-.413 1.054-1.503 1.354-1.042.287-1.12.836-1.08 1.157.042.332.324.537.839.882.35.234.664.572.664 1.053 0 .42-.27.85-1.08 1.096-.642.195-1.161.76-1.161 1.341 0 1.139 1.464 2.471 7.5 2.471s7.5-1.332 7.5-2.471c0-.58-.52-1.146-1.161-1.341-.81-.246-1.08-.676-1.08-1.096 0-.481.314-.819.664-1.053.515-.345.797-.55.839-.882.04-.321-.038-.87-1.08-1.157-1.09-.3-1.468-.82-1.503-1.354-.023-.367-.027-.755.473-1.25.538-.532.87-1.393.668-2.502A5.503 5.503 0 0 0 12 2.5Zm2.743 4.145a.75.75 0 1 0-1.486.208.75.75 0 0 0 1.486-.208Zm-4.75-.208a.75.75 0 1 1-1.486.208.75.75 0 0 1 1.486-.208Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>

            {/* TikTok */}
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gray-100 p-3 text-gray-800 transition-all hover:bg-gray-200 hover:scale-110 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              aria-label="TikTok"
            >
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}