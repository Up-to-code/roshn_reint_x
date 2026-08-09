"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { Building, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Property {
  id: string;
  titleEn: string | null;
  titleAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  images: string[];
  title?: string;
  description?: string;
}

interface HomePropertiesGridProps {
  locale: string;
  initialProperties: Property[];
}

const INITIAL_DISPLAY_COUNT = 6;
const LOAD_MORE_COUNT = 6;

export default function HomePropertiesGrid({ locale, initialProperties }: HomePropertiesGridProps) {
  const properties = useMemo(() => initialProperties.map(item => ({
    ...item,
    title: (locale === "ar" ? item.titleAr || item.titleEn : item.titleEn || item.titleAr) || "",
    description: (locale === "ar" ? item.descriptionAr || item.descriptionEn : item.descriptionEn || item.descriptionAr) || "",
  })), [initialProperties, locale]);
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  const gridRef = useRef<HTMLDivElement>(null);
  const isRTL = locale === "ar";

  // Get visible properties based on display count
  const visibleProperties = useMemo(
    () => properties.slice(0, displayCount),
    [properties, displayCount]
  );

  const hasMore = properties.length > displayCount;

  // Animate cards when they are loaded and visible on scroll
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (visibleProperties.length > 0 && gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.property-card');
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%", // Triggers when the top of the grid reaches 85% of the viewport height
              toggleActions: "play none none none"
            }
          }
        );
      }
    }
  }, [visibleProperties]);

  const handleShowMore = () => {
    setDisplayCount(prev => Math.min(prev + LOAD_MORE_COUNT, properties.length));
  };

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-transparent py-20"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold text-slate-900">
            {locale === "ar" ? "عقارات مميزة" : "Featured Properties"}
          </h2>
          <p className="text-lg text-slate-600">
            {locale === "ar"
              ? "استكشف أحدث العقارات لدينا"
              : "Explore our latest listings"}
          </p>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProperties.map((property) => (
                <Link
                  href={`/${locale}/p/${property.id}`}
                  key={property.id}
                  className="property-card group relative block overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-2xl opacity-0 translate-y-8"
                >
                  {/* Image */}
                  <div className="relative h-[420px] w-full overflow-hidden">
                    {property.images?.length > 0 ? (
                      <Image
                        src={property.images[0]}
                        alt={property.title || "Property"}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-slate-200">
                        <Building className="size-16 text-slate-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  </div>

                  {/* Title */}
                  <div className="absolute inset-x-6 bottom-6 z-10">
                    <h3 className="line-clamp-1 text-xl font-semibold text-white drop-shadow-lg">
                      {property.title}
                    </h3>
                  </div>
                </Link>
              ))}
        </div>

        {/* Show More Button */}
        {hasMore && (
          <div className="mt-12 flex justify-center">
            <Button
              onClick={handleShowMore}
              size="lg"
              variant="outline"
              className="group"
            >
              {locale === "ar" ? "عرض المزيد" : "Show More"}
              <ChevronRight
                className={`ml-2 size-4 transition-transform group-hover:translate-x-1 ${
                  isRTL ? "rotate-180 mr-2 ml-0" : ""
                }`}
              />
            </Button>
          </div>
        )}

        {/* View All Link */}
        {properties.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href={`/${locale}/p`}
              className="inline-flex items-center text-primary hover:underline"
            >
              {locale === "ar" ? "عرض جميع العقارات" : "View All Properties"}
              <ChevronRight
                className={`ml-1 size-4 ${isRTL ? "rotate-180 mr-1 ml-0" : ""}`}
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
