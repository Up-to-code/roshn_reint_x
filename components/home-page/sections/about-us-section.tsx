"use client";

import { AboutUsSection as AboutUsSectionType } from "@/types/home-page";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface AboutUsSectionProps {
  content: AboutUsSectionType;
}

export function AboutUsSection({ content }: AboutUsSectionProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    gsap.registerPlugin(ScrollTrigger);

    if (sectionRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: isRTL ? 50 : -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          }
        }
      );

      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: isRTL ? -50 : 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          }
        }
      );
    }
  }, [isRTL, mounted]);

  if (!content) return null;

  return (
    <section ref={sectionRef} className="bg-transparent py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 ${isRTL ? "lg:grid-flow-col-dense" : ""}`}>
          {/* Content Section */}
          <div ref={textRef} className={`${isRTL ? "lg:order-2" : "lg:order-1"} opacity-0`}>
            {/* Title */}
            <h2 className="mb-6 text-3xl font-bold leading-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl lg:mb-8 lg:text-5xl">
              {typeof content.title === 'string' ? content.title : 'About Us'}
            </h2>
            
            {/* Content Paragraphs */}
            <div className="mb-8 space-y-4 text-zinc-600 dark:text-zinc-400 lg:mb-12 lg:space-y-6">
              {(() => {
                const textContent = content.content;
                if (typeof textContent === 'string') {
                  // Check if it looks like HTML
                  const isHtml = /<[a-z][\s\S]*>/i.test(textContent);
                  if (isHtml) {
                    return (
                      <div 
                        className="prose prose-zinc dark:prose-invert max-w-none text-base leading-relaxed lg:text-lg [&_p]:mb-4 last:[&_p]:mb-0"
                        dangerouslySetInnerHTML={{ __html: textContent }} 
                      />
                    );
                  }
                  
                  // Regular text fallback
                  return textContent.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-base leading-relaxed lg:text-lg">
                      {paragraph}
                    </p>
                  ));
                }
                if (Array.isArray(textContent as any)) {
                  return (textContent as any[]).map((paragraph: any, index: number) => (
                    <p key={index} className="text-base leading-relaxed lg:text-lg">
                      {typeof paragraph === 'string' ? paragraph : JSON.stringify(paragraph)}
                    </p>
                  ));
                }
                return null;
              })()}
            </div>

            {/* Stats Grid */}
            {Array.isArray(content.stats) && content.stats.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
                {content.stats.map((stat, index) => (
                  <div 
                    key={stat?.id || index} 
                    className="rounded-lg border border-[#E0DDD8] bg-white p-4 text-center shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    <div className="mb-2 text-2xl font-bold text-zinc-900 sm:text-3xl lg:text-4xl">
                      {typeof stat?.value === 'string' || typeof stat?.value === 'number' ? stat.value : ''}
                    </div>
                    <div className="text-xs font-medium uppercase tracking-wider text-zinc-500 sm:text-sm">
                      {typeof stat?.label === 'string' ? stat.label : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image Section */}
          <div ref={imageRef} className={`${isRTL ? "lg:order-1" : "lg:order-2"} opacity-0`}>
            {typeof content.image === 'string' && content.image && (
              <div className="group relative overflow-hidden rounded-xl">
                <img
                  src={content.image}
                  alt={typeof content.title === 'string' ? content.title : ''}
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-80 lg:h-96 xl:h-[500px]"
                />
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-zinc-900 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}