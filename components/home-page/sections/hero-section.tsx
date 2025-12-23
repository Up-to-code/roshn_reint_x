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
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const isHtml = (str: string) => /<[^>]+>/.test(str);

  return (
    <section className="relative flex min-h-screen items-center justify-end overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
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
            alt=""
            className="h-full w-full object-cover"
          />
        ) : null}

        <div
          className="absolute inset-0"
          style={{ backgroundColor: content.overlayColor ?? "rgba(0,0,0,0.45)" }}
        />
      </div>

      {/* Content aligned right */}
      <div className="relative z-10 w-full max-w-4xl pr-12 sm:pr-16 md:pr-24 py-24 text-white flex flex-col items-end space-y-6 text-right">
        
        {/* Accent Text */}
        {content.accentText && (
          <span className="rounded-full border border-[#FF8C42]/10 bg-[#FF8C42]/20 px-6 py-2 text-sm font-semibold uppercase tracking-widest text-[#FF8C42] backdrop-blur-md">
            {content.accentText}
          </span>
        )}

        {/* Title - Bigger */}
        {content.title && (
          <h1 className="w-full font-bold tracking-tight text-[48px] leading-tight">
            {isHtml(content.title) ? (
              <span
                className="block w-full bg-gradient-to-l from-white via-gray-200 to-gray-400 bg-clip-text text-transparent
                           [&_*]:text-inherit [&_*]:font-inherit [&_strong]:font-extrabold"
                dangerouslySetInnerHTML={{ __html: content.title }}
              />
            ) : (
              <span className="block w-full bg-gradient-to-l from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                {content.title}
              </span>
            )}
          </h1>
        )}

        {/* Subtitle - Bigger */}
        {content.subtitle && (
          <div className="w-full text-right text-[32px] font-medium leading-relaxed text-gray-200/90">
            {isHtml(content.subtitle) ? (
              <span
                className="block w-full [&_*]:block [&_*]:w-full [&_*]:text-right [&_*]:text-inherit [&_strong]:font-semibold"
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
    </section>
  );
}
