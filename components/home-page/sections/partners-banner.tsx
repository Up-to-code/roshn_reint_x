"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface PartnersBannerProps {
  logos?: { src: string; alt: string }[];
  speed?: number;
  className?: string;
}

// Wrapper that hides itself when the image fails to load
function PartnerLogoCard({ src, alt, cardKey }: { src: string; alt: string; cardKey: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      key={cardKey}
      className={cn(
        "mx-6 md:mx-10 flex h-[120px] w-[120px] md:h-[160px] md:w-[160px]",
        "items-center justify-center",
        "bg-white rounded-lg shadow-sm",
        "p-4"
      )}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-contain"
        loading="lazy"
        onError={() => {
          if (cardRef.current) {
            cardRef.current.style.display = "none";
          }
        }}
      />
    </div>
  );
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
      <section className={cn("w-full bg-transparent py-12", className)} dir="ltr">
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
    <section className={cn("w-full bg-transparent py-16", className)}>
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
          {/* Gradient overlays for smooth fade effect — brand grey #F0EDE8 */}
          <div
            className={cn(
              "absolute top-0 bottom-0 w-32 z-10 pointer-events-none",
              isRTL ? "right-0" : "left-0"
            )}
            style={{
              background: isRTL
                ? "linear-gradient(to left, #F0EDE8, rgba(240,237,232,0.8), transparent)"
                : "linear-gradient(to right, #F0EDE8, rgba(240,237,232,0.8), transparent)",
            }}
          />
          <div
            className={cn(
              "absolute top-0 bottom-0 w-32 z-10 pointer-events-none",
              isRTL ? "left-0" : "right-0"
            )}
            style={{
              background: isRTL
                ? "linear-gradient(to right, #F0EDE8, rgba(240,237,232,0.8), transparent)"
                : "linear-gradient(to left, #F0EDE8, rgba(240,237,232,0.8), transparent)",
            }}
          />

          {/* Scrolling container - using inline-flex for seamless loop */}
          <div className="inline-flex w-full flex-nowrap">
            {/* First set of logos */}
            <div
              className={cn(
                "flex items-center justify-center md:justify-start shrink-0",
                isRTL ? "animate-scroll-rtl" : "animate-scroll-ltr"
              )}
              style={{
                animationDuration: `${speed}s`,
              }}
            >
              {logosToShow.map((logo, index) => (
                <PartnerLogoCard
                  key={`first-${index}`}
                  cardKey={`first-${index}`}
                  src={logo.src}
                  alt={logo.alt}
                />
              ))}
            </div>

            {/* Second set of logos (duplicate for seamless loop) */}
            <div
              className={cn(
                "flex items-center justify-center md:justify-start shrink-0",
                isRTL ? "animate-scroll-rtl" : "animate-scroll-ltr"
              )}
              style={{
                animationDuration: `${speed}s`,
              }}
              aria-hidden="true"
            >
              {logosToShow.map((logo, index) => (
                <PartnerLogoCard
                  key={`second-${index}`}
                  cardKey={`second-${index}`}
                  src={logo.src}
                  alt={logo.alt}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-ltr {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }

        @keyframes scroll-rtl {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(100%);
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

        .animate-scroll-ltr {
          animation: scroll-ltr linear infinite;
        }

        .animate-scroll-rtl {
          animation: scroll-rtl linear infinite;
        }
      `}</style>
    </section>
  );
}