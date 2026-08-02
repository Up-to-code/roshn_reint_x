"use client";

import Image from "next/image";
import jeddahSkyline from "@/public/jeddah-skyline.png";

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

export function HeroSection({ content: _content }: HeroSectionProps) {
  return (
    <section
      aria-label="روشن ريت"
      className="relative min-h-[640px] overflow-hidden bg-[#05070a]"
      style={{ height: "100svh" }}
    >
      <div className="absolute inset-[-4%] animate-[heroZoom_14s_ease-in-out_infinite_alternate] motion-reduce:animate-none">
        <Image
          src={jeddahSkyline}
          alt="أفق مدينة جدة عند الغسق"
          fill
          priority
          sizes="100vw"
          className="animate-[heroFadeIn_1.4s_ease-out_both] object-cover object-center motion-reduce:animate-none"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,14,0.35)_0%,rgba(4,8,14,0)_30%,rgba(4,8,14,0)_55%,rgba(4,8,14,0.55)_100%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-4 flex animate-[heroFadeIn_1.6s_ease-out_1.2s_both] justify-center motion-reduce:animate-none"
      >
        <div className="h-8 w-px bg-gradient-to-b from-white/55 to-transparent" />
      </div>

      <style jsx global>{`
        @keyframes heroZoom {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.07);
          }
        }

        @keyframes heroFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
