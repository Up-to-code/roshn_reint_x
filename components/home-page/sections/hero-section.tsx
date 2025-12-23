"use client";

import { useEffect, useRef } from "react";

interface HeroSectionProps {
  content: {
    title?: string;
    subtitle?: string;
    accentText?: string;
    backgroundImage?: string;
    backgroundVideo?: string;
    overlayColor?: string;
  };
}

export function HeroSection({ content }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch((err) => console.log("Video autoplay failed:", err));
    }
  }, []);

  const isHtml = (str: string) => /<[^>]+>/.test(str);

  return (
    <section
      aria-label={content.title || "Hero section"}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {content.backgroundVideo ? (
          <video
            ref={videoRef}
            src={content.backgroundVideo}
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />
        ) : content.backgroundImage ? (
          <img
            src={content.backgroundImage}
            alt={content.title || "Hero background"}
            className="h-full w-full object-cover"
          />
        ) : null}

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundColor: content.overlayColor ?? "rgba(0,0,0,0.4)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 text-white sm:px-12 md:px-16">
        <div className="flex flex-row-reverse">
          <div className="flex w-full max-w-4xl flex-col items-end space-y-6 text-right">
            
            {/* Accent Text */}
            {content.accentText && (
              <span className="inline-flex rounded-full border border-[#FF8C42]/10 bg-[#FF8C42]/20 px-6 py-2 text-sm font-semibold uppercase tracking-widest text-[#FF8C42] backdrop-blur-md">
                {content.accentText}
              </span>
            )}

            {/* Title */}
            {content.title && (
              <h1 className="w-full text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                {isHtml(content.title) ? (
                  <span
                    className="block w-full bg-gradient-to-l from-white via-gray-200 to-gray-400 bg-clip-text text-transparent drop-shadow-lg
                               [&_*]:text-inherit [&_*]:font-inherit [&_strong]:font-extrabold"
                    dangerouslySetInnerHTML={{ __html: content.title }}
                  />
                ) : (
                  <span className="block w-full bg-gradient-to-l from-white via-gray-200 to-gray-400 bg-clip-text text-transparent drop-shadow-lg whitespace-pre-wrap leading-tight">
                    {content.title}
                  </span>
                )}
              </h1>
            )}

            {/* Subtitle — FIXED FULL WIDTH */}
            {content.subtitle && (
              <div className="w-full text-right text-2xl font-medium leading-relaxed text-gray-200/90 sm:text-3xl">
                {isHtml(content.subtitle) ? (
                  <span
                    className="block w-full
                               [&_*]:block
                               [&_*]:w-full
                               [&_*]:text-right
                               [&_*]:text-inherit
                               [&_strong]:font-bold"
                    dangerouslySetInnerHTML={{ __html: content.subtitle }}
                  />
                ) : (
                  <span className="block w-full whitespace-pre-wrap">
                    {content.subtitle}
                  </span>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
