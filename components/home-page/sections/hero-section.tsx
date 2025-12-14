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

      {/* Content - Centered with improved styling */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-white">
        {/* Accent Text */}
        {content.accentText && (
          <div className="mb-4 inline-block rounded-full bg-[#FF8C42]/20 px-6 py-2 text-sm font-semibold uppercase tracking-wider text-[#FF8C42] backdrop-blur-sm sm:text-base">
            {content.accentText}
          </div>
        )}

        {/* Main Title - Support RTL and rich text HTML with better spacing */}
        {(() => {
          const isRTL = content.title && /[\u0600-\u06FF]/.test(content.title);
          const hasHTML = content.title && /<[^>]+>/.test(content.title);
          
          return (
            <h1 
              className={`mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl ${
                isRTL ? 'text-right' : 'text-center'
              }`}
              style={{ lineHeight: '1.2' }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {hasHTML ? (
                <div 
                  className="block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl [&_*]:text-inherit [&_*]:font-inherit [&_*]:leading-[1.2] [&_p]:mb-4 [&_p]:last:mb-0 [&_strong]:font-bold [&_em]:italic [&_br]:block [&_br]:h-2"
                  dangerouslySetInnerHTML={{ __html: content.title }}
                />
              ) : (
                <span className="block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                  {content.title ? content.title.split('\n').map((line, index) => (
                    <span key={index} className="block mb-2 last:mb-0" style={{ lineHeight: '1.2' }}>
                      {line.trim() || '\u00A0'}
                    </span>
                  )) : '\u00A0'}
                </span>
              )}
            </h1>
          );
        })()}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
        <div className="animate-bounce">
          <div className="flex h-12 w-6 justify-center rounded-full border-2 border-white/50 backdrop-blur-sm">
            <div className="mt-2 h-3 w-1 rounded-full bg-white/70" />
          </div>
        </div>
      </div>
    </section>
  );
}