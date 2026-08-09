"use client";

import { FormEvent, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { InterestsPagination } from "./InterestsPagination";
import { InterestsTable, type InterestRow } from "./interests-table";
import { interestListHref, type InterestReadFilter } from "./interest-query";

interface InterestsClientProps {
  interests: InterestRow[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  allCount: number;
  unreadCount: number;
  readCount: number;
  search: string;
  filterRead: InterestReadFilter;
  locale: string;
}

async function mutateInterest(id: string, method: "PATCH" | "DELETE") {
  const response = await fetch(`/api/interests/${id}`, {
    method,
    headers: method === "PATCH" ? { "Content-Type": "application/json" } : undefined,
    body: method === "PATCH" ? JSON.stringify({ read: true }) : undefined,
  });
  if (!response.ok) throw new Error(`Interest mutation failed (${response.status})`);
}

export default function InterestsClient(props: InterestsClientProps) {
  const {
    interests, currentPage, totalPages, totalCount, allCount, unreadCount, readCount,
    search, filterRead, locale,
  } = props;
  const t = useTranslations("interests");
  const router = useRouter();
  const pathname = usePathname();
  const isRTL = locale === "ar";
  const [searchDraft, setSearchDraft] = useState(search);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [isNavigating, startNavigation] = useTransition();

  const navigate = (nextSearch: string, nextFilter: InterestReadFilter, page = 1) => {
    startNavigation(() => router.push(interestListHref(pathname, nextSearch, nextFilter, page)));
  };

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    navigate(searchDraft, filterRead);
  };

  const runMutation = async (id: string, method: "PATCH" | "DELETE") => {
    setMutatingId(id);
    try {
      await mutateInterest(id, method);
      toast.success(method === "DELETE"
        ? (isRTL ? "تم الحذف بنجاح" : "Deleted successfully")
        : (isRTL ? "تم التحديث بنجاح" : "Marked as read"));
      router.refresh();
    } catch {
      toast.error(isRTL ? "حدث خطأ" : "An error occurred");
    } finally {
      setMutatingId(null);
    }
  };

  const deleteInterest = (id: string) => {
    const confirmed = window.confirm(isRTL
      ? "هل أنت متأكد من حذف هذه الرسالة؟"
      : "Are you sure you want to delete this message?");
    if (confirmed) void runMutation(id, "DELETE");
  };

  return (
    <div className="min-h-screen bg-background p-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl">
        <div className={`mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center ${isRTL ? "sm:flex-row-reverse" : ""}`}>
          <div className={isRTL ? "text-right" : ""}>
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="mt-1 text-muted-foreground">
              {totalCount} {isRTL ? "رسالة" : "messages"}
              {unreadCount > 0 && <Badge variant="destructive" className="ml-2">{unreadCount} {isRTL ? "غير مقروء" : "unread"}</Badge>}
            </p>
          </div>
        </div>

        <div className="mb-6 space-y-4 rounded-lg border bg-card p-4">
          <form onSubmit={submitSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className={`absolute top-3 size-4 text-muted-foreground ${isRTL ? "right-4" : "left-4"}`} />
              <Input
                type="search"
                placeholder={t("searchPlaceholder")}
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                className={isRTL ? "pr-12" : "pl-12"}
              />
            </div>
            <Button type="submit" disabled={isNavigating}>
              {isNavigating ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
              {isRTL ? "بحث" : "Search"}
            </Button>
          </form>

          <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            {(["all", "unread", "read"] as const).map((filter) => (
              <Button
                key={filter}
                variant={filterRead === filter ? "default" : "outline"}
                size="sm"
                disabled={isNavigating}
                onClick={() => navigate(search, filter)}
              >
                {t(`filters.${filter}`)} ({filter === "all" ? allCount : filter === "unread" ? unreadCount : readCount})
              </Button>
            ))}
          </div>
        </div>

        <InterestsTable
          interests={interests}
          locale={locale}
          mutatingId={mutatingId}
          onMarkRead={(id) => void runMutation(id, "PATCH")}
          onDelete={deleteInterest}
        />
        <InterestsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          search={search}
          filterRead={filterRead}
          isRTL={isRTL}
        />
      </div>
    </div>
  );
}
