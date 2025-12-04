"use client";

import { useState, useEffect, useMemo, useCallback, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Building } from "lucide-react";

interface Property {
  id: string;
  titleEn: string;
  titleAr: string;
  images: string[];
  title?: string;
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
      }));

      setProperties(localizedData);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  }, [locale]);

  useEffect(() => {
    startTransition(() => {
      fetchProperties();
    });
  }, [fetchProperties]);

  const visibleProperties = useMemo(
    () => properties.slice(0, 6),
    [properties]
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
      className=" py-20 my-40"
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
                        priority
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-slate-200">
                        <Building className="size-16 text-slate-400" />
                      </div>
                    )}

                    {/* Full smooth shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40" />

                    {/* Title */}
                    <div className="absolute bottom-5 left-5 right-5 z-20">
                      <h3 className="line-clamp-1 text-lg font-semibold text-white drop-shadow-lg">
                        {property.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
