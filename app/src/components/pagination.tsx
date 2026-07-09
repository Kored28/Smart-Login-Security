import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  entriesPerPage: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  const pages = new Set<number>([1, totalPages, currentPage]);

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const result: (number | "ellipsis")[] = [];
  const sorted = Array.from(pages).sort((a, b) => a - b);

  let prev = 0;
  for (const page of sorted) {
    if (prev && page - prev > 1) {
      result.push("ellipsis");
    }
    result.push(page);
    prev = page;
  }

  return result;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalEntries,
  entriesPerPage,
  onPageChange,
}: PaginationProps) => {
  const start = (currentPage - 1) * entriesPerPage + 1;
  const end = Math.min(currentPage * entriesPerPage, totalEntries);
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between border-t rounded-b-[12px] px-6 py-4 bg-[#EFF4FF33]">
      <p className="text-sm text-muted-foreground">
        Showing {start} to {end} of {totalEntries} entries
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-[8px] hover:bg-accent hover:text-white"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4"></ChevronLeft>
        </Button>

        {pages.map((page, idx) => {
          if (page === "ellipsis") {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-sm text-muted-foreground">
                ...
              </span>
            );
          }

          return (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              className="h-8 w-8 rounded-[8px] hover:bg-accent hover:text-white active:bg-accent"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-[8px] hover:bg-accent hover:text-white"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4"></ChevronRight>
        </Button>
      </div>
    </div>
  );
}

export default Pagination