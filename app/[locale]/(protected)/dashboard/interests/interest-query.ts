export type InterestReadFilter = "all" | "unread" | "read";

export function interestListHref(
  pathname: string,
  search: string,
  filter: InterestReadFilter,
  page = 1,
) {
  const params = new URLSearchParams();
  if (search.trim()) params.set("search", search.trim());
  if (filter !== "all") params.set("filter", filter);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
