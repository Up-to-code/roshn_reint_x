"use client";

import { useState, useEffect } from "react";

interface PartnersBannerProps {
  logos?: { src: string; alt: string }[];
  speed?: number;
}

export function PartnersBanner({ 
  logos = [], 
  speed = 30
}: PartnersBannerProps) {
  const [mounted, setMounted] = useState(false);

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
    <section className="w-full bg-orange-500 px-4 py-8">
      {/* 10px spacing at top */}
      <div className="h-[10px]" />
      {/* Logos container */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-orange-500 to-transparent" />
        <div className="absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-orange-500 to-transparent" />
        
        {/* Scrolling logos */}
        <div
          className="animate-scroll flex items-center gap-20 md:gap-28"
          style={{
            width: "max-content",
            animationDuration: `${speed}s`
          }}
        >
          {logosToShow.map((logo, index) => (
            <div
              key={`${logo.alt}-${index}`}
              className="shrink-0 px-4"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-16 w-auto object-contain opacity-60 mix-blend-multiply transition-opacity duration-300 hover:opacity-100 md:h-24"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}