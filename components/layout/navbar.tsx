"use client";

import { useState, useEffect } from "react";
 import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { Menu, X, Sparkles } from "lucide-react";
import { FaTiktok, FaInstagram, FaSnapchat } from "react-icons/fa";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
 
const LocaleSwitcher = dynamic(() => import("../LocaleSwitcher"), {
  ssr: false,
  loading: () => <div className="size-10 animate-pulse rounded-lg bg-muted"></div>
});

const LOGO_URL = "https://17mm2glo1t.ufs.sh/f/rQix7xjgXapPnMkzCZsvM65OTuZmLfX0irPqwtUyhICdlcAW";

export function NavBar() {
  const { data: session } = useSession();
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navLinks = [
    { title: t("home"), href: "/" },
    { title: t("projects"), href: "/p" },
    { title: t("services"), href: "/services" },
    { title: t("about"), href: "/about" },
    { title: t("contact"), href: "/contact" }
  ];

  const socialLinks = [
    { icon: FaTiktok, href: "https://tiktok.com/@yourusername", label: "TikTok" },
    { icon: FaInstagram, href: "https://instagram.com/yourusername", label: "Instagram" },
    { icon: FaSnapchat, href: "https://snapchat.com/add/yourusername", label: "Snapchat" }
  ];

  if (!isMounted) {
    return (
      <header className="fixed top-6 z-40 w-full px-6">
        <div className="mx-auto max-w-7xl">
          <div className="h-24 animate-pulse rounded-2xl border bg-card/80"></div>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* Dashboard Banner */}
      {session && (
        <div className="fixed top-0 z-50 w-full border-b bg-background/80 px-6 py-3 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl">
            <Link
              href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
              className="flex items-center justify-center gap-2 text-base font-semibold transition-colors hover:text-primary"
            >
              <Sparkles className="size-5" />
              {t("goToDashboard")}
            </Link>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <header className={cn("fixed z-40 w-full px-6", session ? "top-16" : "top-6")}>
        <div className="mx-auto max-w-7xl">
          <nav className="rounded-2xl border bg-background/80 backdrop-blur-2xl">
            <div className="flex h-24 items-center justify-between px-8 lg:px-12">
              
              {/* Logo */}
              <Link href="/" className="shrink-0" onClick={() => setMobileOpen(false)}>
                <div className="relative h-16 w-20">
                  <Image
                    src={LOGO_URL}
                    alt="Logo"
                    fill
                    className="object-contain transition-transform hover:scale-105"
                    priority
                  />
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden items-center gap-2 lg:flex">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href as any}
                    className="rounded-xl px-5 py-3 text-base font-semibold transition-all hover:bg-muted hover:text-primary"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-4">
                {/* Social Links - Desktop */}
                <div className="hidden items-center gap-2 lg:flex">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl p-3 transition-all hover:bg-muted hover:text-primary"
                        aria-label={social.label}
                      >
                        <IconComponent className="size-6" />
                      </a>
                    );
                  })}
                </div>

                {/* Locale Switcher - Desktop */}
                <div className="hidden lg:block">
                  <LocaleSwitcher />
                </div>

                {/* Mobile Menu Button */}
                <button
                  className="rounded-xl p-3 transition-all hover:bg-muted lg:hidden"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                >
                  {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
              <div className="border-t bg-muted/30 p-6 backdrop-blur-xl lg:hidden">
                <div className="space-y-3">
                  {navLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href as any}
                      className="block rounded-xl px-6 py-4 text-center text-base font-semibold transition-all hover:bg-muted hover:text-primary"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>

                {/* Social Links - Mobile */}
                <div className="mt-6 flex justify-center gap-3 border-t pt-6">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl p-4 transition-all hover:bg-muted hover:text-primary"
                        aria-label={social.label}
                      >
                        <IconComponent className="size-7" />
                      </a>
                    );
                  })}
                </div>

                {/* Locale Switcher - Mobile */}
                <div className="mt-6 flex justify-center">
                  <LocaleSwitcher />
                </div>
              </div>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}