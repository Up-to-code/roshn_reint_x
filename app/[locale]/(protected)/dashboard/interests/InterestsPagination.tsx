"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { interestListHref, type InterestReadFilter } from "./interest-query";

interface InterestsPaginationProps {
  currentPage: number;
  totalPages: number;
  search: string;
  filterRead: InterestReadFilter;
  isRTL: boolean;
}

export function InterestsPagination({ currentPage, totalPages, search, filterRead, isRTL }: InterestsPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handlePageChange = (page: number) => {
    router.push(interestListHref(pathname, search, filterRead, page));
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`mt-6 flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="size-4" />
        {isRTL ? 'السابق' : 'Previous'}
      </Button>
      <span className="text-sm text-muted-foreground">
        {isRTL ? 'صفحة' : 'Page'} {currentPage} {isRTL ? 'من' : 'of'} {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {isRTL ? 'التالي' : 'Next'}
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
