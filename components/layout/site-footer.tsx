"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { Link } from "@/i18n/routing";
import { useEffect, useState } from "react";

interface FooterLink {
  id: string;
  label: string;
  href: string;
  external: boolean;
}

interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface FooterData {
  copyrightText: string;
  sections: FooterSection[];
  socialLinks: SocialLink[];
  backgroundColor: string;
  textColor: string;
  showSocialLinks: boolean;
}

// SVG Icons for Social Media
const SocialIcons = {
  facebook: (
    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  twitter: (
    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63a9.935 9.935 0 002.46-2.548l-.047-.02z"/>
    </svg>
  ),
  instagram: (
    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.017 0C8.396 0 7.986.015 6.756.072 5.526.132 4.704.333 3.995.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.139C.333 4.848.132 5.67.072 6.9.012 8.13 0 8.54 0 12.017c0 3.476.015 3.885.072 5.115.06 1.23.261 2.052.558 2.761.306.789.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.709.297 1.531.498 2.761.558 1.23.06 1.64.072 5.115.072 3.476 0 3.885-.015 5.115-.072 1.23-.06 2.052-.261 2.761-.558.79-.306 1.459-.717 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.297-.709.498-1.531.558-2.761.06-1.23.072-1.64.072-5.115 0-3.476-.015-3.885-.072-5.115-.06-1.23-.261-2.052-.558-2.761-.306-.789-.717-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.709-.297-1.531-.498-2.761-.558C15.869.012 15.459 0 12.017 0zm0 2.158c3.413 0 3.808.012 5.026.07 1.172.056 1.805.259 2.227.43.562.227.964.5 1.386.922.421.421.695.823.922 1.386.171.422.374 1.055.43 2.227.058 1.218.07 1.613.07 5.026 0 3.413-.012 3.808-.07 5.026-.056 1.172-.259 1.805-.43 2.227-.227.562-.5.964-.922 1.386-.421.421-.823.695-1.386.922-.422.171-1.055.374-2.227.43-1.218.058-1.613.07-5.026.07-3.413 0-3.808-.012-5.026-.07-1.172-.056-1.805-.259-2.227-.43-.562-.227-.964-.5-1.386-.922-.421-.421-.695-.823-.922-1.386-.171-.422-.374-1.055-.43-2.227-.058-1.218-.07-1.613-.07-5.026 0-3.413.012-3.808.07-5.026.056-1.172.259-1.805.43-2.227.227-.562.5-.964.922-1.386.421-.421.823-.695 1.386-.922.422-.171 1.055-.374 2.227-.43 1.218-.058 1.613-.07 5.026-.07zM12 5.838a6.162 6.162 0 110 12.324 6.162 6.162 0 010-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 110 2.88 1.44 1.44 0 010-2.88z"/>
    </svg>
  ),
  linkedin: (
    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  youtube: (
    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
};

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFooterData() {
      try {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/home-page?locale=${locale}`, {
          cache: 'no-store',
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data?.footer) {
            setFooterData(result.data.footer);
          }
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFooterData();
  }, [locale]);

  if (loading) {
    return (
      <footer className={cn("rounded-t-3xl bg-gray-50 py-8", className)}>
        <div className="container mx-auto px-4 text-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </footer>
    );
  }

  // Use footer data colors or default to light theme
  const bgColor = footerData?.backgroundColor || "#f8fafc";
  const textColor = footerData?.textColor || "#1e293b";
  const isLightTheme = bgColor && (bgColor.startsWith("#f") || bgColor.startsWith("#fff") || bgColor.includes("white") || bgColor.includes("light"));

  return (
    <footer 
      className={cn("mt-10 rounded-t-3xl py-12", className)} 
      style={{ 
        backgroundColor: bgColor,
        color: textColor 
      }}
    >
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className={cn("space-y-6", isRTL ? "text-right" : "")}>
            <div className={cn("flex items-center gap-4", isRTL ? "flex-row-" : "")}>
              <div className={cn(
                "relative size-12 overflow-hidden rounded-2xl border",
                isLightTheme 
                  ? "border-gray-200 bg-white shadow-sm" 
                  : "border-gray-600 bg-gray-800"
              )}>
                <Image
                  src="https://17mm2glo1t.ufs.sh/f/rQix7xjgXapPnMkzCZsvM65OTuZmLfX0irPqwtUyhICdlcAW"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
        
            </div>
            
            <p className={cn(
              "text-sm leading-relaxed",
              isLightTheme ? "text-gray-600" : "text-gray-400"
            )}>
              {isRTL 
                ? "منصة عقارية رائدة تقدم أفضل الخدمات والعقارات في المملكة" 
                : "Leading real estate platform offering the best properties and services"
              }
            </p>

            {/* Social Links with SVG Icons */}
            {footerData?.showSocialLinks && footerData.socialLinks && (
              <div className={cn("flex gap-3", isRTL ? "justify-" : "justify-start")}>
                {footerData.socialLinks.map((social) => {
                  const platform = social.platform.toLowerCase() as keyof typeof SocialIcons;
                  const IconComponent = SocialIcons[platform];
                  
                  return (
                    <Link
                      key={social.platform}
                      href={social.url as any}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "rounded-xl p-3 transition-all",
                        isLightTheme
                          ? "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                          : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white"
                      )}
                      aria-label={social.platform}
                    >
                      {IconComponent || <span>{social.platform}</span>}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Sections */}
          {footerData?.sections.map((section) => (
            <div key={section.id} className={cn("space-y-4", isRTL ? "text-right" : "")}>
              <h4 className={cn(
                "text-sm font-bold uppercase tracking-wide",
                isLightTheme ? "text-gray-900" : "text-white"
              )}>
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.id}>
                    {link.external ? (
                      <a 
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "block rounded-lg px-2 py-1 text-sm transition-colors",
                          isLightTheme
                            ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        )}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link 
                        href={link.href as any}
                        className={cn(
                          "block rounded-lg px-2 py-1 text-sm transition-colors",
                          isLightTheme
                            ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        )}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className={cn(
          "flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row",
          isLightTheme ? "border-gray-200" : "border-gray-700"
        )}>
          <p className={cn(
            "text-sm",
            isLightTheme ? "text-gray-500" : "text-gray-400"
          )}>
            {footerData?.copyrightText || `© ${new Date().getFullYear()} ${isRTL ? "العقارية" : "RealEstate"}. ${isRTL ? "جميع الحقوق محفوظة" : "All rights reserved"}`}
          </p>
          <div className="flex items-center gap-4">
            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}