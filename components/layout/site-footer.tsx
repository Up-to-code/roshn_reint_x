"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Link, type Pathnames } from "@/i18n/routing";
import { Phone, MessageCircle } from "lucide-react";

const PHONE_NUMBER = "1234567890";
const WHATSAPP_NUMBER = "1234567890";
const INSTAGRAM_URL = "https://instagram.com";
const TIKTOK_URL = "https://tiktok.com";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const footerLinks: Array<{ label: string; href: Pathnames }> = [
    { label: isRTL ? "الرئيسية" : "Home", href: "/" },
    { label: isRTL ? "المشاريع" : "Projects", href: "/p" },
    { label: isRTL ? "خدماتنا" : "Services", href: "/services" },
    { label: isRTL ? "المدونة" : "Blog", href: "/blog" },
    { label: isRTL ? "من نحن" : "About", href: "/about" },
    { label: isRTL ? "اتصل بنا" : "Contact", href: "/contact" },
  ];

  return (
    <footer className={cn("mt-auto border-t bg-white py-12 text-gray-600", className)}>
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
                © {new Date().getFullYear()} {isRTL ? "روشن" : "Roshn"}. {isRTL ? "جميع الحقوق محفوظة" : "All rights reserved"}.
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
            {/* Call */}
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="rounded-full bg-blue-100 p-3 text-blue-600 transition-all hover:bg-blue-200 hover:scale-110"
              aria-label="Call"
            >
              <Phone className="size-5" />
            </a>
            
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25D366]/10 p-3 text-[#25D366] transition-all hover:bg-[#25D366]/20 hover:scale-110"
              aria-label="WhatsApp"
            >
              <MessageCircle className="size-5" />
            </a>
            
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