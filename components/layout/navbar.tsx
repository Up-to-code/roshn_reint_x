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
const INSTAGRAM_URL = "https://www.instagram.com/roshnreit?igsh=MXFlbTk5eGwzd3J6MA==";
const SNAPCHAT_URL = "https://snapchat.com/t/9vzZRHpk";
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

// Social Links with Instagram, Snapchat, TikTok
function SocialLinks({ mobile }: { mobile?: boolean }) {
  return (
    <div className={cn("flex gap-3", mobile && "justify-center gap-4 border-t border-gray-600 pt-6")}>
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

      {/* Snapchat */}
      <a
        href={SNAPCHAT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg p-2 text-[#FFFC00] transition-all hover:bg-[#FFFC00]/20 hover:text-[#e6e200]"
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
