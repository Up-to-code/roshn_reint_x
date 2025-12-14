"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface PartnersBannerProps {
  logos?: { src: string; alt: string }[];
  speed?: number;
  className?: string;
}

export function PartnersBanner({ 
  logos = [], 
  speed = 30,
  className
}: PartnersBannerProps) {
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const isRTL = locale === "ar";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter out partners with empty/invalid image URLs
  const logosToShow = (logos || []).filter(
    (logo) => 
      logo?.src && 
      typeof logo.src === 'string' && 
      logo.src.trim().length > 0
  );

  if (!mounted) {
    return (
      <section className={cn("w-full bg-gray-50 py-12", className)}>
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <div className="h-9 w-48 mx-auto bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="flex gap-8 justify-center">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[200px] w-[150px] bg-gray-200 animate-pulse rounded" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (logosToShow.length === 0) {
    return null;
  }

  return (
    <section className={cn("w-full bg-gradient-to-b from-gray-50 to-white py-16", className)}>
      <div className="container mx-auto px-4">
        {/* Title with fade-in animation */}
        <div className="mb-12 text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-2">
            {isRTL ? "شركاؤنا" : "Our Partners"}
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            {isRTL ? "نفخر بالعمل مع أفضل الشركات" : "Trusted by leading companies worldwide"}
          </p>
        </div>
        
        {/* Infinite Scroll Container with gradient masks */}
        <div className="relative m-auto w-full overflow-hidden">
          {/* Gradient overlays for smooth fade effect */}
          <div 
            className={cn(
              "absolute top-0 bottom-0 w-32 z-10 pointer-events-none",
              isRTL ? "right-0 bg-gradient-to-l" : "left-0 bg-gradient-to-r",
              "from-white via-white/80 to-transparent"
            )} 
          />
          <div 
            className={cn(
              "absolute top-0 bottom-0 w-32 z-10 pointer-events-none",
              isRTL ? "left-0 bg-gradient-to-r" : "right-0 bg-gradient-to-l",
              "from-white via-white/80 to-transparent"
            )} 
          />
          
          {/* Scrolling container */}
          <div 
            className={cn(
              "flex transition-all duration-300",
              "hover:scale-[1.02]"
            )}
            style={{ 
              animation: `${isRTL ? 'scroll-rtl' : 'scroll-ltr'} ${speed}s linear infinite`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.animationPlayState = 'paused';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.animationPlayState = 'running';
            }}
          >
            {/* Render 3 sets of logos for better coverage on large screens */}
            {[...Array(3)].map((_, setIndex) => (
              <div key={`set-${setIndex}`} className="flex shrink-0">
                {logosToShow.map((logo, index) => (
                  <div
                    key={`${setIndex}-${logo.alt}-${index}`}
                    className={cn(
                      "mx-6 md:mx-10 flex h-[120px] w-[120px] md:h-[160px] md:w-[160px] shrink-0",
                      "items-center justify-center",
                      "transition-transform duration-300 hover:scale-110",
                      "bg-white rounded-lg shadow-sm hover:shadow-md",
                      "p-4"
                    )}
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={160}
                      height={160}
                      className="h-full w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                      unoptimized
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-ltr {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        @keyframes scroll-rtl {
          0% {
            transform: translateX(calc(-100% / 3));
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </section>
  );
}