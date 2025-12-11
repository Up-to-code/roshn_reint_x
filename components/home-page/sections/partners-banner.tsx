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

  // Use default empty array if logos is undefined
  const logosToShow = logos || [];

  if (!mounted) {
    return null; // Return nothing during SSR and initial client render
  }

  // If no logos provided, don't render anything
  if (logosToShow.length === 0) {
    return null; // Completely hide the component when no data
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
            className="flex w-max animate-infinite-scroll hover:[animation-play-state:paused]"
            style={{ animationDuration: `${speed}s` }}
          >
            {/* Render 4 sets of logos to ensure seamless loop on large screens */}
            {[...Array(4)].map((_, setIndex) => (
              <div key={`set-${setIndex}`} className="flex">
                {logosToShow.map((logo, index) => (
                  <div
                    key={`${setIndex}-${logo.alt}-${index}`}
                    className="mx-12 flex h-24 w-40 items-center justify-center"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={160}
                      height={80}
                      className="h-auto w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}