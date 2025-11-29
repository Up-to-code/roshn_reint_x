"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { Menu, X, Sparkles, MessageCircle, Instagram, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useSession } from "@/lib/auth-client";

const LocaleSwitcher = dynamic(() => import("@/components/LocaleSwitcher"), {
  ssr: false,
  loading: () => <div className="size-8 animate-pulse rounded-md bg-gray-600" />,
});

const LOGO_URL = "https://fhupmhxzhukzzqunrtur.supabase.co/storage/v1/object/public/images/New%20Project%201.png";
const WHATSAPP_NUMBER = "1234567890"; // Replace with actual number

const SOCIAL_LINKS = [
  { icon: MessageCircle, href: "https://tiktok.com/@yourusername", label: "TikTok" },
  { icon: Instagram, href: "https://instagram.com/yourusername", label: "Instagram" },
  { icon: Camera, href: "https://snapchat.com/add/yourusername", label: "Snapchat" },
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
      <div className="flex h-[100px] w-[160px] items-center justify-center">
        <img src={LOGO_URL} alt="Logo" className="size-full object-contain" />
      </div>
    </Link>
  );
}

// Navigation Links
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

// Social Links
function SocialLinks({ mobile }: { mobile?: boolean }) {
  return (
    <div className={cn("flex gap-3", mobile && "justify-center gap-4 border-t border-gray-600 pt-6")}>
      {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-700 hover:text-white"
          aria-label={label}
        >
          <Icon className="size-5" />
        </a>
      ))}
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

  const currentLocale = typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "en";
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
