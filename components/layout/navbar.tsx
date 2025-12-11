"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { Menu, X, Sparkles, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useSession } from "@/lib/auth-client";

const LocaleSwitcher = dynamic(() => import("@/components/LocaleSwitcher"), {
  ssr: false,
  loading: () => <div className="size-8 animate-pulse rounded-md bg-gray-600" />,
});

const LOGO_URL = "https://qtthbbfudgvtstwevhbf.supabase.co/storage/v1/object/public/images/logo.png";
const WHATSAPP_NUMBER = "1234567890";
const PHONE_NUMBER = "1234567890";
const INSTAGRAM_URL = "https://instagram.com";
const TIKTOK_URL = "https://tiktok.com";

const SOCIAL_LINKS = [
  { icon: Phone, href: `https://wa.me/${WHATSAPP_NUMBER}`, label: "Call", color: "text-blue-500 hover:text-blue-400" },
];

// Dashboard Banner
function DashboardBanner({ session, t, isRTL }: { session: any; t: any; isRTL: boolean }) {
  if (!session) return null;

  const dashboardUrl = session.user.role === "ADMIN" ? "/admin" : "/dashboard";

  return (
    <div className="fixed top-0 z-50 w-full border-b border-gray-600 bg-[#424242] py-2 text-white">
      <div className="mx-auto max-w-7xl text-center">
        <Link href={dashboardUrl} className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary">
          <Sparkles className="size-4" />
          {t("goToDashboard")}
        </Link>
      </div>
    </div>
  );
}

// Logo
function Logo({ onClick }: { onClick: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center">
      <div className="relative flex h-[100px] w-[160px] items-center justify-center">
        <Image src={LOGO_URL} alt="Logo" width={160} height={100} className="object-contain" />
      </div>
    </Link>
  );
}

// Navigation Links (without icons)
function NavLinks({ links, mobile, onClick, isRTL }: { links: any[]; mobile?: boolean; onClick?: () => void; isRTL: boolean }) {
  return (
    <>
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClick}
          className={cn(
            "font-medium text-gray-200 transition-all hover:text-white",
            mobile ? "block px-4 py-3 text-center hover:bg-gray-700" : "px-4 py-2 text-sm"
          )}
        >
          {item.title}
        </Link>
      ))}
    </>
  );
}

// Social Links with Call (WhatsApp), Instagram, TikTok
function SocialLinks({ mobile }: { mobile?: boolean }) {
  return (
    <div className={cn("flex gap-3", mobile && "justify-center gap-4 border-t border-gray-600 pt-6")}>
      {/* Call Icon - Goes to WhatsApp */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg p-2 text-blue-500 transition-all hover:bg-blue-500/20 hover:text-blue-400"
        aria-label="Call us on WhatsApp"
        title="Call us on WhatsApp"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
      
      {/* Instagram */}
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg p-2 text-pink-500 transition-all hover:bg-pink-500/20 hover:text-pink-400"
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
        className="rounded-lg p-2 text-black transition-all hover:bg-gray-700 hover:text-white dark:text-white"
        aria-label="TikTok"
      >
        <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      </a>
    </div>
  );
}

// Interest Button
function InterestButton({ mobile, onClick, isRTL }: { mobile?: boolean; onClick?: () => void; isRTL: boolean }) {
  const handleClick = () => {
    const message = isRTL
      ? "مرحباً! أنا مهتم بخدماتكم وأرغب في الحصول على مزيد من المعلومات."
      : "Hello! I'm interested in your services and would like to get more information.";
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    onClick?.();
  };

  return (
    <Button onClick={handleClick} className={cn("rounded-2xl p-5 px-8", mobile && "w-full")} size={mobile ? "lg" : "default"}>
      {isRTL ? "التسجيل في الإهتمام" : "Register Interest"}
    </Button>
  );
}

// Mobile Menu
function MobileMenu({ isOpen, onClose, navLinks, isRTL }: { isOpen: boolean; onClose: () => void; navLinks: any[]; isRTL: boolean }) {
  if (!isOpen) return null;

  return (
    <div className="border-t border-gray-600 bg-[#424242] p-6 lg:hidden">
      <div className="space-y-4">
        <NavLinks links={navLinks} mobile onClick={onClose} isRTL={isRTL} />
        <div className="pt-4">
          <InterestButton mobile onClick={onClose} isRTL={isRTL} />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-gray-600 pt-6">
        <SocialLinks mobile />
        <LocaleSwitcher />
      </div>
    </div>
  );
}

// Main NavBar
export function NavBar() {
  const { data: session } = useSession();
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);


  
  const currentLocale = useLocale();
  const isRTL = currentLocale === "ar";

  const navLinks = [
    { title: t("home"), href: "/" },
    { title: t("projects"), href: "/p" },
    { title: t("services"), href: "/services" },
    { title: t("about"), href: "/about" },
    { title: t("contact"), href: "/contact" },
  ];

  if (!mounted) {
    return (
      <header className="fixed top-6 z-40 w-full px-4">
        <div className="mx-auto max-w-7xl">
          <div className="h-20 animate-pulse rounded-xl bg-[#424242]" />
        </div>
      </header>
    );
  }

  return (
    <>
      <DashboardBanner session={session} t={t} isRTL={isRTL} />

      <header className={cn("fixed z-40 w-full px-4", session ? "top-12" : "top-6")}>
        <div className="mx-auto max-w-7xl">
          <nav className="rounded-xl   bg-[#424242] text-white" dir={isRTL ? "rtl" : "ltr"}>
            {/* Main Navigation Bar */}
            <div className="flex h-20 items-center justify-between px-6">
              <Logo onClick={() => setMobileOpen(false)} />

              {/* Desktop Navigation */}
              <div className="hidden items-center gap-2 lg:flex">
                <NavLinks links={navLinks} onClick={() => {}} isRTL={isRTL} />
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-4">
                {/* Desktop Actions */}
                <div className="hidden items-center gap-4 lg:flex">
                  <SocialLinks />
                  <LocaleSwitcher />
                  <InterestButton onClick={() => {}} isRTL={isRTL} />
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="p-2 text-gray-400 hover:text-white lg:hidden"
                  aria-label={mobileOpen ? (isRTL ? "إغلاق القائمة" : "Close menu") : (isRTL ? "فتح القائمة" : "Open menu")}
                >
                  {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>
              </div>
            </div>

            <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} navLinks={navLinks} isRTL={isRTL} />
          </nav>
        </div>
      </header>
    </>
  );
}
