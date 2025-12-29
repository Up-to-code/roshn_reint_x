import { db } from "@/lib/db";
import InterestsClient from "./InterestsClient";

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
  const filterRead = (resolvedSearchParams.filter as "all" | "unread" | "read") || "all";
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  // Build where clause for filtering
  const where: any = {};
  
  if (filterRead === "unread") {
    where.read = false;
  } else if (filterRead === "read") {
    where.read = true;
  }

  // Add search filter if provided
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
      { propertyTitle: { contains: search, mode: "insensitive" } },
      { message: { contains: search, mode: "insensitive" } },
    ];
  }

  // Fetch paginated interests and counts
  const [rawInterests, totalCount, allCount, unreadCount, readCount] = await Promise.all([
    db.interest.findMany({
      where,
      include: {
        property: {
          select: {
            id: true,
            titleEn: true,
            titleAr: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    db.interest.count({ where }), // Filtered count
    db.interest.count(), // Total count (all)
    db.interest.count({ where: { read: false } }), // Unread count
    db.interest.count({ where: { read: true } }), // Read count
  ]);

  // Serialize dates to strings to avoid hydration mismatches and serialization warnings
  const interests = rawInterests.map(interest => ({
    ...interest,
    createdAt: interest.createdAt.toISOString(),
    updatedAt: interest.updatedAt.toISOString(),
  }));

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const startIndex = skip + 1;
  const endIndex = Math.min(skip + ITEMS_PER_PAGE, totalCount);

  return (
    <InterestsClient
      interests={interests}
      currentPage={currentPage}
      totalPages={totalPages}
      totalCount={totalCount}
      allCount={allCount}
      unreadCount={unreadCount}
      readCount={readCount}
      startIndex={startIndex}
      endIndex={endIndex}
      search={search}
      filterRead={filterRead}
      locale={locale}
    />
  );
}
