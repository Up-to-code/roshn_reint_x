"use client";

import { useState, useEffect, useMemo, useCallback, useTransition, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { Building, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stripHtml } from "@/lib/utils";

interface Property {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  images: string[];
  price?: number;
  title?: string;
  city?: string;
  district?: string;
  href?: string;
  standalone?: boolean;
}

interface HomePropertiesGridProps {
  locale: string;
  initialProperties?: Property[];
}

const ITEMS_PER_PAGE = 12;

export default function HomePropertiesGrid({ locale, initialProperties }: HomePropertiesGridProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties || []);
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  const isRTL = locale === "ar";

  const roshnReitProject = useMemo<Property>(
    () => ({
      id: "roshn-reit",
      titleEn: "Roshn Reit",
      titleAr: "روشن ريت",
      title: locale === "ar" ? "روشن ريت" : "Roshn Reit",
      descriptionEn: "Darb Al Haramain project in Jeddah.",
      descriptionAr: "مشروع درب الحرمين في جدة.",
      images: ["/logo.png"],
      city: locale === "ar" ? "جدة" : "Jeddah",
      district: locale === "ar" ? "درب الحرمين" : "Darb Al Haramain",
      href: "/roshn-plus",
      standalone: true,
    }),
    [locale]
  );

  const fetchProperties = useCallback(async () => {
    try {
      const res = await fetch("/api/properties", {
        next: { revalidate: 60 },
      });
      if (!res.ok) throw new Error("Failed to load properties");

      const data: Property[] = await res.json();

      const localizedData = data.map((item) => ({
        ...item,
        title:
          locale === "ar"
            ? item.titleAr || item.titleEn
            : item.titleEn || item.titleAr,
      }));

      setProperties(localizedData);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  }, [locale]);

  useEffect(() => {
    if (!initialProperties || initialProperties.length === 0) {
      startTransition(() => {
        fetchProperties();
      });
    } else {
      const localizedData = initialProperties.map((item) => ({
        ...item,
        title:
          locale === "ar"
            ? item.titleAr || item.titleEn
            : item.titleEn || item.titleAr,
      }));
      setProperties(localizedData);
    }
  }, [initialProperties, locale, fetchProperties]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.property-list-card');
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
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      }
    }
  }, [properties, currentPage]);

  const visibleProperties = useMemo(
    () => [
      roshnReitProject,
      ...properties.filter((property) => property.id !== roshnReitProject.id),
    ],
    [properties, roshnReitProject]
  );

  // Pagination calculations
  const totalPages = Math.ceil(visibleProperties.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProperties = useMemo(
    () => visibleProperties.slice(startIndex, endIndex),
    [visibleProperties, startIndex, endIndex]
  );

  const SkeletonCard = () => (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="aspect-[1/1.4] w-full bg-slate-200" />
      <div className="p-4">
        <div className="h-5 w-3/4 rounded bg-slate-200" />
      </div>
    </div>
  );

  const isLoading = isPending && visibleProperties.length === 0;

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="py-20 my-40"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold text-slate-900">
            {locale === "ar" ? "جميع العقارات" : "All Properties"}
          </h2>
          <p className="text-lg text-slate-600">
            {locale === "ar"
              ? `استكشف ${visibleProperties.length} عقار متاح`
              : `Explore ${visibleProperties.length} available properties`}
          </p>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : paginatedProperties.length > 0 ? (
          <>
            <div ref={gridRef} className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedProperties.map((property) => (
                <Link
                  href={property.href || `/${locale}/p/${property.id}`}
                  key={property.id}
                  className="property-list-card opacity-0 translate-y-8 group relative block overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-2xl"
                >
                  {/* Image */}
                  <div className={`relative aspect-[1/1.4] w-full overflow-hidden ${property.standalone ? "bg-[#424242]" : ""}`}>
                    {property.images?.length > 0 ? (
                      <Image
                        src={property.images[0]}
                        alt={property.title || "Property"}
                        fill
                        className={`${property.standalone ? "object-contain p-8" : "object-cover"} transition-transform duration-700 group-hover:scale-105`}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={currentPage === 1}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-slate-200">
                        <Building className="size-16 text-slate-400" />
                      </div>
                    )}

                    {/* Full smooth shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40" />

                    {/* Price Tag */}
                    {typeof property.price === "number" && (
                      <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-20`}>
                        <span className="inline-block rounded-lg bg-white/90 px-3 py-1 text-sm font-bold text-slate-900 backdrop-blur-sm">
                          {new Intl.NumberFormat(locale, { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(property.price)}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <div className="absolute bottom-5 left-5 right-5 z-20">
                      <h3 className="line-clamp-1 text-lg font-semibold text-white drop-shadow-lg">
                        {property.title}
                      </h3>
                      {(property.city || property.district) && (
                        <p className="mt-1 text-sm text-white/90">
                          {property.city}
                          {property.district && `, ${property.district}`}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`mt-12 flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="gap-2"
                >
                  <ChevronLeft className={`size-4 ${isRTL ? 'rotate-180' : ''}`} />
                  {isRTL ? 'السابق' : 'Previous'}
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 10) {
                      pageNum = i + 1;
                    } else if (currentPage <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 4) {
                      pageNum = totalPages - 9 + i;
                    } else {
                      pageNum = currentPage - 4 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="min-w-[40px]"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="gap-2"
                >
                  {isRTL ? 'التالي' : 'Next'}
                  <ChevronRight className={`size-4 ${isRTL ? 'rotate-180' : ''}`} />
                </Button>
              </div>
            )}

            {/* Page Info */}
            <div className={`mt-4 text-center text-sm text-slate-600 ${isRTL ? 'text-right' : ''}`}>
              {isRTL 
                ? `صفحة ${currentPage} من ${totalPages} - عرض ${startIndex + 1} إلى ${Math.min(endIndex, visibleProperties.length)} من ${visibleProperties.length}`
                : `Page ${currentPage} of ${totalPages} - Showing ${startIndex + 1} to ${Math.min(endIndex, visibleProperties.length)} of ${visibleProperties.length}`
              }
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <Building className="mx-auto size-16 text-slate-400 mb-4" />
            <p className="text-lg text-slate-600">
              {isRTL ? "لا توجد عقارات متاحة حالياً" : "No properties available at the moment"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
