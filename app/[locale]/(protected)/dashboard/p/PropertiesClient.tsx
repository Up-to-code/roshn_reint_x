"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Plus, Search } from "lucide-react";
import posthog from "posthog-js";
import { toast } from "sonner";

import { deleteProperty } from "@/app/actions/properties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SerializedPropertyRecord } from "@/lib/properties/property-core";

import { PropertiesGrid } from "./properties-grid";

const ITEMS_PER_PAGE = 12;

export default function PropertiesClient({
  initialProperties,
  locale,
}: {
  initialProperties: SerializedPropertyRecord[];
  locale: string;
}) {
  const t = useTranslations("properties");
  const commonT = useTranslations("common");
  const router = useRouter();
  const isRTL = locale === "ar";
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim().toLocaleLowerCase(locale));
  const [removedIds, setRemovedIds] = useState<Set<string>>(() => new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const properties = useMemo(
    () => initialProperties.filter((property) => !removedIds.has(property.id)),
    [initialProperties, removedIds],
  );
  const filteredProperties = useMemo(() => properties.filter((property) => {
    if (!deferredSearch) return true;
    const fields = [property.titleAr, property.titleEn, property.city, property.district];
    return fields.some((field) => field?.toLocaleLowerCase(locale).includes(deferredSearch));
  }), [deferredSearch, locale, properties]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const visiblePage = Math.min(currentPage, Math.max(1, totalPages));
  const pageProperties = filteredProperties.slice((visiblePage - 1) * ITEMS_PER_PAGE, visiblePage * ITEMS_PER_PAGE);

  const handleDelete = async (id: string) => {
    if (!window.confirm(commonT("confirmDelete"))) return;
    setDeletingId(id);
    try {
      const result = await deleteProperty(id);
      if (!result.success && !result.error?.match(/not found|404/i)) throw new Error(result.error);
      setRemovedIds((current) => new Set(current).add(id));
      if (result.success) {
        posthog.capture("property_deleted", { property_id: id });
        toast.success(commonT("success"));
      }
      router.refresh();
    } catch {
      toast.error(commonT("error"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl">
        <div className={`mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center ${isRTL ? "sm:flex-row-reverse" : ""}`}>
          <div className={isRTL ? "text-right" : ""}>
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="mt-1 text-muted-foreground">{t("subtitle")} ({filteredProperties.length} {isRTL ? "عقار" : "properties"})</p>
          </div>
          <Button asChild>
            <Link href={`/${locale}/dashboard/p/create`}><Plus className="size-4" />{t("actions.add")}</Link>
          </Button>
        </div>

        <div className="mb-6 rounded-lg border bg-card p-4">
          <div className="relative">
            <Search className={`absolute top-3 size-4 text-muted-foreground ${isRTL ? "right-4" : "left-4"}`} />
            <Input
              type="search"
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }}
              className={isRTL ? "pr-12" : "pl-12"}
            />
          </div>
        </div>

        <PropertiesGrid
          properties={pageProperties}
          hasAnyProperties={properties.length > 0}
          locale={locale}
          currentPage={visiblePage}
          totalPages={totalPages}
          deletingId={deletingId}
          onDelete={(id) => void handleDelete(id)}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
