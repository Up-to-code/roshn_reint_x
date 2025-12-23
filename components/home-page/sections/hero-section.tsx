"use client";

import { HeroSection as HeroSectionType } from "@/types/home-page";
import { useEffect, useRef } from "react";

interface HeroSectionProps {
  content: HeroSectionType;
}

export function HeroSection({ content }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined' && videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  const Overlay = () => (
    <div
      className="absolute inset-0"
      style={{ backgroundColor: content.overlayColor || 'rgba(0,0,0,0.4)' }}
      aria-hidden="true"
    />
  );

  // Render background - video or image
  const renderBackground = () => {
    if (content.backgroundVideo) {
      return (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        >
          <source src={content.backgroundVideo} type="video/mp4" />
          <source src={content.backgroundVideo} type="video/webm" />
        </video>
      );
    }

    if (content.backgroundImage) {
      return (
        <img
          src={content.backgroundImage}
          alt={content.title || "Hero Background"}
          className="h-full w-full object-cover"
        />
      );
    }

    return null;
  };

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900"
      aria-label={content.title || "Hero section"}
    >
      {/* Background (Video or Image) */}
      <div className="absolute inset-0 z-0">
        {renderBackground()}
        <Overlay />
      </div>

      {/* Content - Strictly Right aligned (RTL) with improved styling */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-8 sm:px-12 md:px-16 py-24 text-white">
        <div className="flex flex-col items-end space-y-10">
          {/* Accent Text */}
          {content.accentText && (
            <div className="inline-block rounded-full bg-[#FF8C42]/20 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-[#FF8C42] backdrop-blur-sm sm:text-base">
              {content.accentText}
            </div>
          )}

          {/* Main Title - Impactful Scale & Right Aligned */}
          {content.title && (
            <h1
              className="text-right text-[48px] font-bold tracking-tight sm:text-[64px] md:text-[80px] lg:text-[88px] xl:text-[96px]"
              style={{ lineHeight: '1.1' }}
              dir="rtl"
            >
              {/<[^>]+>/.test(content.title) ? (
                <div
                  className="block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl [&_*]:text-inherit [&_*]:font-inherit [&_*]:leading-[1.1] [&_p]:mb-4 [&_p]:last:mb-0 [&_strong]:font-bold [&_em]:italic [&_br]:block [&_br]:h-2"
                  dangerouslySetInnerHTML={{ __html: content.title }}
                />
              ) : (
                <span className="block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                  {content.title.split('\n').map((line, index) => (
                    <span key={index} className="block mb-2 last:mb-0" style={{ lineHeight: '1.2' }}>
                      {line.trim() || '\u00A0'}
                    </span>
                  ))}
                </span>
              )}
            </h1>
          )}

          {/* Subtitle - Strictly 24px and Right Aligned */}
          {content.subtitle && (
            <div
              className="max-w-4xl text-right text-[24px] font-medium text-gray-200/90 leading-relaxed"
              dir="rtl"
            >
              {/<[^>]+>/.test(content.subtitle) ? (
                <div
                  className="[&_*]:text-inherit [&_*]:font-inherit [&_p]:mb-2 [&_p]:last:mb-0 [&_strong]:font-bold [&_em]:italic"
                  dangerouslySetInnerHTML={{ __html: content.subtitle }}
                />
              ) : (
                <span>{content.subtitle}</span>
              )}
            </div>
          )}

          {/* Buttons & Scroll Indicator - Removed per request */}
        </div>
      </div>
    </section>
  );
}