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
      videoRef.current.play().catch(() => { });
    }
  }, []);

  const isHtml = (str: string) => /<[^>]+>/.test(str);

  return (
    <section className="relative flex min-h-screen items-center justify-start overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
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

      {/* Content aligned RIGHT - Standard for Arabic/RTL */}
      <div className="relative z-10 w-full max-w-4xl ml-auto pr-12 sm:pr-16 md:pl-24 py-24 text-white flex flex-col items-end space-y-6 text-right">

        {/* Accent Text */}
        {content.accentText && (
          <span className="rounded-full border border-[#FF8C42]/10 bg-[#FF8C42]/20 px-6 py-2 text-sm font-semibold uppercase tracking-widest text-[#FF8C42] backdrop-blur-md">
            {content.accentText}
          </span>
        )}

        {/* Title - Bigger with proper line height */}
        {content.title && (
          <h1 className="w-full font-bold tracking-tight text-[60px] sm:text-[80px] lg:text-[90px] leading-[1.2] text-white">
            {isHtml(content.title) ? (
              <span
                className="block w-full [&_*]:text-inherit [&_*]:font-inherit [&_strong]:font-extrabold"
                dangerouslySetInnerHTML={{ __html: content.title }}
              />
            ) : (
              <span className="block w-full">
                {content.title}
              </span>
            )}
          </h1>
        )}

        {/* Subtitle - Bigger with improved spacing */}
        {content.subtitle && (
          <div className="w-full text-right text-[30px] sm:text-[38px] md:text-[45px] font-medium leading-[1.5] text-gray-200/90 tracking-wide">
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
