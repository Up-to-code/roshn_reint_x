"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";

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
  const heroRef = useRef<HTMLDivElement | null>(null);
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !videoRef.current) return;
    videoRef.current.play().catch(() => { });
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !heroRef.current) return;

    // Helper to wrap text nodes in spans for word-by-word stagger
    const wrapWords = (el: HTMLElement) => {
      const walker = document.createTreeWalker(
        el,
        NodeFilter.SHOW_TEXT,
        null
      );

      const textNodes: Text[] = [];
      let node;
      while ((node = walker.nextNode())) {
        textNodes.push(node as Text);
      }

      textNodes.forEach((textNode) => {
        const text = textNode.nodeValue || "";
        const words = text.split(/(\s+)/);
        if (words.length <= 1 && text.trim() === "") return;

        const fragment = document.createDocumentFragment();
        words.forEach((word) => {
          if (word.trim() === "") {
            fragment.appendChild(document.createTextNode(word));
          } else {
            const span = document.createElement("span");
            span.className = "gsap-word inline-block opacity-0 translate-y-4";
            span.textContent = word;
            fragment.appendChild(span);
          }
        });

        if (textNode.parentNode) {
          textNode.parentNode.replaceChild(fragment, textNode);
        }
      });
    };

    // Wrap elements with .animate-words
    const targets = heroRef.current.querySelectorAll(".animate-words");
    targets.forEach((target) => wrapWords(target as HTMLElement));

    // Animate words using GSAP
    const words = heroRef.current.querySelectorAll(".gsap-word");
    if (words.length > 0) {
      gsap.killTweensOf(words);
      gsap.fromTo(
        words,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.03,
          ease: "power2.out",
          delay: 0.1,
        }
      );
    }
  }, [content, mounted]);

  const isHtml = (str: string) => /<[^>]+>/.test(str);

  return (
    <section className="relative flex min-h-screen items-center justify-start overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {mounted && content.backgroundVideo ? (
          <video
            ref={videoRef}
            src={content.backgroundVideo}
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />
        ) : mounted && content.backgroundImage ? (
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

      {/* Content alignment based on locale */}
      <div
        ref={heroRef}
        className={cn(
          "relative z-10 w-full max-w-4xl px-4 sm:px-6 md:px-8 lg:px-12 py-16 sm:py-20 md:py-24 text-white flex flex-col space-y-4 sm:space-y-6 font-sans",
          isRTL
            ? "ml-auto md:pr-16 lg:pr-24 items-end text-right"
            : "mr-auto md:pl-16 lg:pl-24 items-start text-left"
        )}
      >
        {/* Accent Text */}
        {content.accentText && (
          <span className="font-sans rounded-full border border-[#FF8C42]/10 bg-[#FF8C42]/20 px-6 py-2 text-sm font-semibold uppercase tracking-widest text-[#FF8C42] backdrop-blur-md">
            {content.accentText}
          </span>
        )}

        {/* Title - Bigger with proper line height */}
        {content.title && (
          <h1 className="w-full font-sans font-bold tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-[60px] xl:text-[80px] 2xl:text-[90px] leading-tight sm:leading-[1.2] text-white">
            {isHtml(content.title) ? (
              <span
                className="animate-words block w-full [&_*]:text-inherit [&_*]:font-inherit [&_strong]:font-bold"
                dangerouslySetInnerHTML={{ __html: content.title }}
              />
            ) : (
              <span className="animate-words block w-full">
                {content.title}
              </span>
            )}
          </h1>
        )}

        {/* Subtitle - Bigger with improved spacing */}
        {content.subtitle && (
          <div
            className={cn(
              "w-full font-sans font-bold text-base sm:text-lg md:text-2xl lg:text-[30px] xl:text-[38px] 2xl:text-[45px] leading-relaxed sm:leading-normal text-gray-200/90 tracking-wide",
              isRTL ? "text-right" : "text-left"
            )}
          >
            {isHtml(content.subtitle) ? (
              <span
                className={cn(
                  "animate-words block w-full [&_*]:block [&_*]:w-full [&_*]:text-inherit [&_strong]:font-semibold",
                  isRTL ? "[&_*]:text-right" : "[&_*]:text-left"
                )}
                dangerouslySetInnerHTML={{ __html: content.subtitle }}
              />
            ) : (
              <span className="animate-words block w-full whitespace-pre-wrap">
                {content.subtitle}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
