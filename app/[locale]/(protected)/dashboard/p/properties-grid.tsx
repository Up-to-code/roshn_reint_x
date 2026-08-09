"use client";

import Image from "next/image";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Edit, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { stripHtml } from "@/lib/utils";
import type { SerializedPropertyRecord } from "@/lib/properties/property-core";

const pageWindow = (current: number, total: number, size = 7) => {
  const count = Math.min(size, total);
  const start = Math.max(1, Math.min(current - Math.floor(count / 2), total - count + 1));
  return Array.from({ length: count }, (_, index) => start + index);
};

export function PropertiesGrid({
  properties,
  hasAnyProperties,
  locale,
  currentPage,
  totalPages,
  deletingId,
  onDelete,
  onPageChange,
}: {
  properties: SerializedPropertyRecord[];
  hasAnyProperties: boolean;
  locale: string;
  currentPage: number;
  totalPages: number;
  deletingId: string | null;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
}) {
  const t = useTranslations("properties");
  const format = useFormatter();
  const isRTL = locale === "ar";
  const title = (property: SerializedPropertyRecord) =>
    (locale === "ar" ? property.titleAr : property.titleEn || property.titleAr);

  if (!properties.length) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-muted-foreground">{hasAnyProperties ? t("noProperties") : t("createFirst")}</p>
        {!hasAnyProperties && (
          <Button asChild className="mt-4">
            <Link href={`/${locale}/dashboard/p/create`}><Plus className="size-4" />{t("actions.add")}</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => {
          const location = [property.city, property.district].filter(Boolean).join(", ");
          const descriptionHtml = locale === "ar"
            ? property.descriptionAr || property.descriptionEn
            : property.descriptionEn || property.descriptionAr;
          const description = descriptionHtml ? stripHtml(descriptionHtml).trim() : "";
          return (
            <article key={property.id} className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
              <div className="relative aspect-video w-full overflow-hidden">
                {property.images[0] ? (
                  <Image
                    src={property.images[0]}
                    alt={title(property)}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                    {isRTL ? "لا توجد صورة" : "No Image"}
                  </div>
                )}
                <div className="absolute right-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs text-primary-foreground">
                  {property.images.length} {isRTL ? "صورة" : "images"}
                </div>
              </div>

              <div className="p-4">
                <div className={`mb-3 flex items-start justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                    {format.dateTime(new Date(property.createdAt), { dateStyle: "medium" })}
                  </span>
                  <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Button asChild variant="ghost" size="icon" className="size-8">
                      <Link href={`/${locale}/dashboard/p/edit/${property.id}`}><Edit className="size-4" /></Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(property.id)}
                      disabled={deletingId === property.id}
                    >
                      {deletingId === property.id
                        ? <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        : <Trash2 className="size-4" />}
                    </Button>
                  </div>
                </div>
                <p className="font-bold text-primary">
                  {format.number(property.price, { style: "currency", currency: "SAR", maximumFractionDigits: 0 })}
                </p>
                <h3 className={`mb-2 line-clamp-2 text-lg font-semibold ${isRTL ? "text-right" : ""}`}>{title(property)}</h3>
                {location && <p className={`mb-3 text-sm text-muted-foreground ${isRTL ? "text-right" : ""}`}>📍 {location}</p>}
                {description && <p className={`mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground ${isRTL ? "text-right" : "text-left"}`}>{description}</p>}
                <div className={`border-t pt-3 text-xs text-muted-foreground ${isRTL ? "text-right" : ""}`}>
                  {isRTL ? "آخر تحديث:" : "Last updated:"} {format.dateTime(new Date(property.updatedAt), { dateStyle: "medium" })}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {totalPages > 1 && (
        <nav aria-label="Property pages" className={`mt-8 flex items-center justify-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            <ChevronLeft className="size-4" />{isRTL ? "السابق" : "Previous"}
          </Button>
          <div className="flex items-center gap-1">
            {pageWindow(currentPage, totalPages).map((page) => (
              <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => onPageChange(page)} className="min-w-10">
                {page}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            {isRTL ? "التالي" : "Next"}<ChevronRight className="size-4" />
          </Button>
        </nav>
      )}
    </>
  );
}
