import { inquiryModule } from "@/lib/inquiries/inquiry-module";
import InterestsClient from "./InterestsClient";
import type { InterestReadFilter } from "./interest-query";

const ITEMS_PER_PAGE = 20;

interface InterestsPageProps {
  params: Promise<{ locale: string }> | { locale: string };
  searchParams: Promise<{ page?: string; search?: string; filter?: string }> | { page?: string; search?: string; filter?: string };
}

export default async function InterestsPage({ params, searchParams }: InterestsPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const locale = resolvedParams.locale;
  
  const currentPage = Math.max(1, parseInt(resolvedSearchParams.page || "1", 10));
  const search = resolvedSearchParams.search || "";
  const filterRead: InterestReadFilter = resolvedSearchParams.filter === "read" || resolvedSearchParams.filter === "unread"
    ? resolvedSearchParams.filter
    : "all";
  const read = filterRead === "all" ? undefined : filterRead === "read";
  const [{ items: rawInterests, total: totalCount }, counts] = await Promise.all([
    inquiryModule.list({ kind: "PROPERTY_INTEREST", search, read, page: currentPage, pageSize: ITEMS_PER_PAGE }),
    inquiryModule.counts("PROPERTY_INTEREST"),
  ]);
  const { all: allCount, unread: unreadCount, read: readCount } = counts;

  // Serialize dates to strings to avoid hydration mismatches and serialization warnings
  const interests = rawInterests.map(interest => ({
    ...interest,
    createdAt: interest.createdAt.toISOString(),
    updatedAt: interest.updatedAt.toISOString(),
  }));

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <InterestsClient
      interests={interests}
      currentPage={currentPage}
      totalPages={totalPages}
      totalCount={totalCount}
      allCount={allCount}
      unreadCount={unreadCount}
      readCount={readCount}
      search={search}
      filterRead={filterRead}
      locale={locale}
    />
  );
}
