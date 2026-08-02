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
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,14,20,0.6)_0%,rgba(3,14,20,0.08)_36%,rgba(3,14,20,0.15)_58%,rgba(3,11,16,0.82)_100%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 animate-[heroColorShift_12s_ease-in-out_infinite_alternate] bg-[radial-gradient(circle_at_84%_64%,rgba(245,170,74,0.2),transparent_25%),radial-gradient(circle_at_17%_30%,rgba(23,145,153,0.22),transparent_30%)] mix-blend-screen motion-reduce:animate-none"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-20%] top-[42%] h-px animate-[heroLightSweep_9s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-[#f6c47a]/50 to-transparent motion-reduce:animate-none"
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

        @keyframes heroColorShift {
          from {
            opacity: 0.45;
            transform: scale(1);
          }
          to {
            opacity: 0.9;
            transform: scale(1.08);
          }
        }

        @keyframes heroLightSweep {
          0%,
          100% {
            opacity: 0;
            transform: translateX(-20%);
          }
          38%,
          62% {
            opacity: 0.7;
          }
          50% {
            transform: translateX(20%);
          }
        }
      `}</style>
    </section>
  );
}
