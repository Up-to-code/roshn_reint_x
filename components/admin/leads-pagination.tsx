"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface LeadsPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function LeadsPagination({ currentPage, totalPages }: LeadsPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handlePageChange = (page: number) => {
    if (page === 1) {
      router.push(pathname);
    } else {
      router.push(`${pathname}?page=${page}`);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="size-4" />
        Previous
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
              onClick={() => handlePageChange(pageNum)}
              className="min-w-[40px]"
            >
              {pageNum}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}

