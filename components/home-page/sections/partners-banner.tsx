"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface PartnersBannerProps {
  logos?: { src: string; alt: string }[];
  speed?: number;
}

export function PartnersBanner({ 
  logos = [], 
  speed = 30
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
    return null;
  }

  if (logosToShow.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 md:text-3xl">
            {isRTL ? "شركاؤنا" : "Our Partners"}
          </h2>
        </div>
        
        {/* Infinite Scroll Container */}
        <div className="relative m-auto w-full overflow-hidden">
          <div 
            className="flex"
            style={{ 
              animation: `${isRTL ? 'scroll-rtl' : 'scroll-ltr'} ${speed}s linear infinite`,
            }}
          >
            {/* Render 2 sets of logos for seamless loop */}
            {[...Array(2)].map((_, setIndex) => (
              <div key={`set-${setIndex}`} className="flex shrink-0">
                {logosToShow.map((logo, index) => (
                  <div
                    key={`${setIndex}-${logo.alt}-${index}`}
                    className="mx-8 flex h-[200px] w-[150px] shrink-0 items-center justify-center"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={150}
                      height={200}
                      className="h-full w-full object-contain"
                      unoptimized
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
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-rtl {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .flex:hover {
          animation-play-state: paused !important;
        }
      `}</style>
    </section>
  );
}