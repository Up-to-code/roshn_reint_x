"use client";

import { HeroSection as HeroSectionType } from "@/types/home-page";
import { useEffect, useRef, useState } from "react";

interface HeroSectionProps {
  content: HeroSectionType;
}

export function HeroSection({ content }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (videoRef.current) {
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

  // Don't render video on server to prevent hydration mismatch
  const renderBackground = () => {
    if (!isClient) {
      // Server-side render fallback
      return content.backgroundImage ? (
        <img
          src={content.backgroundImage}
          alt={content.title || "Hero Background"}
          className="h-full w-full object-cover"
        />
      ) : null;
    }

    return content.backgroundVideo ? (
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
    ) : content.backgroundImage ? (
      <img
        src={content.backgroundImage}
        alt={content.title || "Hero Background"}
        className="h-full w-full object-cover"
      />
    ) : null;
  };

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black"
      aria-label={content.title || "Hero section"}
    >
      {/* Background (Video or Image) */}
      <div className="absolute inset-0 z-0">
        {renderBackground()}
        <Overlay />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          {content.accentText && (
            <span className="block text-[#FF8C42]">{content.accentText}</span>
          )}
          <span className="leading-snug">{content.title}</span>
        </h1>

        {content.subtitle && (
          <p className="mb-10 text-lg leading-relaxed text-gray-200 sm:text-xl lg:text-2xl">
            {content.subtitle}
          </p>
        )}

        {/* Form Fields from Hero */}
        {content.formFields && content.formFields.length > 0 && (
          <div className="mx-auto mt-8 w-full max-w-md">
            <form className="space-y-4 rounded-lg bg-white/10 backdrop-blur-sm p-6">
              {content.formFields.map((field: any, index: number) => (
                <div key={index}>
                  <label className="mb-2 block text-sm font-medium text-white">
                    {field.label}
                    {field.required && <span className="text-red-400">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      required={field.required}
                      placeholder={field.placeholder}
                      rows={4}
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-white/60 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      name={field.name}
                      required={field.required}
                      placeholder={field.placeholder}
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-white/60 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="w-full rounded-lg bg-[#FF8C42] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#FF7A2E]"
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
        <div className="animate-bounce">
          <div className="flex h-12 w-6 justify-center rounded-full border-2 border-[#FF8C42]">
            <div className="mt-2 h-3 w-1 rounded-full bg-[#FF8C42]" />
          </div>
        </div>
      </div>
    </section>
  );
}