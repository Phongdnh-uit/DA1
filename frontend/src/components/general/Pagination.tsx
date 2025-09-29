"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export default function PaginationTabs({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const lastPageIndex = totalPages - 1;

    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 1) {
        pages.push(0, 1, 2, "...", lastPageIndex);
      } else if (currentPage >= lastPageIndex - 1) {
        pages.push(
          0,
          "...",
          lastPageIndex - 2,
          lastPageIndex - 1,
          lastPageIndex,
        );
      } else {
        pages.push(
          0,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          lastPageIndex,
        );
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            aria-label="Go to first page"
            size="icon"
            onClick={() => onPageChange?.(0)}
            className={cn(currentPage === 0 && "pointer-events-none")}
          >
            <ChevronFirst className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            aria-label="Go to previous page"
            size="icon"
            className={cn(currentPage === 0 && "pointer-events-none")}
            onClick={() => onPageChange?.(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>

        {pages.map((page, i) => (
          <PaginationItem key={i}>
            {page === "..." ? (
              <span className="px-2 text-gray-400">…</span>
            ) : (
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange?.(page as number)}
              >
                {(page as number) + 1}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationLink
            aria-label="Go to next page"
            size="icon"
            onClick={() => onPageChange?.(currentPage + 1)}
            className={cn(
              currentPage === totalPages - 1 && "pointer-events-none",
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            aria-label="Go to last page"
            size="icon"
            className={cn(
              currentPage === totalPages - 1 && "pointer-events-none",
            )}
            onClick={() => onPageChange?.(totalPages - 1)}
          >
            <ChevronLast className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
