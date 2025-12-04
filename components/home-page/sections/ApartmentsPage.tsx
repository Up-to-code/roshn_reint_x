"use client";

import { useState, useEffect, useMemo, useCallback, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Building } from "lucide-react";

interface Property {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  images: string[];
  title?: string;
  description?: string;
}

interface HomePropertiesGridProps {
  locale: string;
}

export default function HomePropertiesGrid({ locale }: HomePropertiesGridProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isPending, startTransition] = useTransition();
  const isRTL = locale === "ar";

  // Fetch properties with caching
  const fetchProperties = useCallback(async () => {
    try {
      const res = await fetch("/api/properties", {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      });
      if (!res.ok) throw new Error("Failed to load properties");

      const data: Property[] = await res.json();

      const localizedData = data.map((item) => ({
        ...item,
        title:
          locale === "ar"
            ? item.titleAr || item.titleEn
            : item.titleEn || item.titleAr,
        description:
          locale === "ar"
            ? item.descriptionAr || item.descriptionEn
            : item.descriptionEn || item.descriptionAr,
      }));

      setProperties(localizedData);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  }, [locale]);

  // Fetch on mount or locale change
  useEffect(() => {
    startTransition(() => {
      fetchProperties();
    });
  }, [fetchProperties]);

  // Limit visible properties to 6
  const visibleProperties = useMemo(
    () => properties.slice(0, 6),
    [properties]
  );

  // Skeleton Card Component
  const SkeletonCard = () => (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-md">
      <div className="h-[420px] w-full bg-slate-200" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 rounded bg-slate-200" />
        <div className="h-4 w-1/2 rounded bg-slate-200" />
      </div>
    </div>
  );

  const isLoading = isPending || properties.length === 0;

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-gradient-to-br from-slate-50 to-slate-100 py-20"
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
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : visibleProperties.map((property) => (
                <Link
                  href={`/${locale}/p/${property.id}`}
                  key={property.id}
                  className="group relative block overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-2xl"
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
      </div>
    </section>
  );
}
