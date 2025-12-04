"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";

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
        
        {/* Logos container - Simple grid layout */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logosToShow.map((logo, index) => (
            <div
              key={`${logo.alt}-${index}`}
              className="relative flex h-12 w-auto items-center justify-center md:h-16"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={64}
                className="object-contain opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                sizes="(max-width: 768px) 48px, 64px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}