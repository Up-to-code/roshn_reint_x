"use client";

import { useState, useEffect, useMemo, useCallback, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Building, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
}

interface HomePropertiesGridProps {
  locale: string;
  initialProperties?: Property[];
}

const ITEMS_PER_PAGE = 12;

// Smart prose class generator for rich text formatting
const getProseClasses = (isRTL: boolean) => {
  const base = "prose prose-sm max-w-none text-slate-600";
  const direction = isRTL 
    ? "text-right prose-headings:text-right prose-ul:text-right prose-ol:text-right prose-blockquote:text-right"
    : "text-left prose-headings:text-left prose-ul:text-left prose-ol:text-left prose-blockquote:text-left";
  
  return `${base} ${direction} 
    [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
    prose-p:text-sm prose-p:leading-snug prose-p:my-1
    prose-headings:text-sm prose-headings:font-semibold prose-headings:text-slate-800 prose-headings:my-1 prose-headings:leading-tight
    prose-strong:text-slate-900 prose-strong:font-semibold prose-em:text-slate-700 prose-em:italic
    prose-ul:text-sm prose-ul:my-1 prose-ul:list-disc prose-ul:pl-4 prose-ol:text-sm prose-ol:my-1 prose-ol:list-decimal prose-ol:pl-4
    prose-li:text-sm prose-li:my-0 prose-li:leading-snug
    prose-a:text-primary prose-a:underline prose-a:font-medium hover:prose-a:text-primary/80 transition-colors
    prose-blockquote:my-1 prose-blockquote:border-l-2 prose-blockquote:border-slate-300 prose-blockquote:pl-3 prose-blockquote:italic prose-blockquote:text-slate-600
    prose-code:text-sm prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
    prose-pre:my-1 prose-pre:text-xs prose-img:my-1 prose-img:rounded-md prose-hr:my-2 prose-hr:border-slate-300
    line-clamp-2 overflow-hidden`.replace(/\s+/g, ' ').trim();
};

export default function HomePropertiesGrid({ locale, initialProperties }: HomePropertiesGridProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties || []);
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const isRTL = locale === "ar";

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

  // Pagination calculations
  const totalPages = Math.ceil(properties.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProperties = useMemo(
    () => properties.slice(startIndex, endIndex),
    [properties, startIndex, endIndex]
  );

  const SkeletonCard = () => (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="aspect-[1/1.4] w-full bg-slate-200" />
      <div className="p-4">
        <div className="h-5 w-3/4 rounded bg-slate-200" />
      </div>
    </div>
  );

  const isLoading = isPending || properties.length === 0;

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
              ? `استكشف ${properties.length} عقار متاح`
              : `Explore ${properties.length} available properties`}
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
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedProperties.map((property) => (
                <Link
                  href={`/${locale}/p/${property.id}`}
                  key={property.id}
                  className="group relative block overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-2xl"
                >
                  {/* Image */}
                  <div className="relative aspect-[1/1.4] w-full overflow-hidden">
                    {property.images?.length > 0 ? (
                      <Image
                        src={property.images[0]}
                        alt={property.title || "Property"}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
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
                    <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-20`}>
                      <span className="inline-block rounded-lg bg-white/90 px-3 py-1 text-sm font-bold text-slate-900 backdrop-blur-sm">
                        {new Intl.NumberFormat(locale, { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(property.price || 0)}
                      </span>
                    </div>

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
                  
                  {/* Description */}
                  {(property.descriptionEn || property.descriptionAr) && (() => {
                    const descriptionHtml = locale === "ar"
                      ? property.descriptionAr || property.descriptionEn || ""
                      : property.descriptionEn || property.descriptionAr || "";
                    if (!descriptionHtml) return null;
                    
                    return (
                      <div className="p-4 pt-3">
                        <div
                          className={getProseClasses(isRTL)}
                          dir={isRTL ? "rtl" : "ltr"}
                          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                        />
                      </div>
                    );
                  })()}
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
                ? `صفحة ${currentPage} من ${totalPages} - عرض ${startIndex + 1} إلى ${Math.min(endIndex, properties.length)} من ${properties.length}`
                : `Page ${currentPage} of ${totalPages} - Showing ${startIndex + 1} to ${Math.min(endIndex, properties.length)} of ${properties.length}`
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
