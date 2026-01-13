import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TablePaginationProps {
  currentPage: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  perPageOptions?: number[];
}

export function TablePagination({
  currentPage,
  totalItems,
  perPage,
  onPageChange,
  onPerPageChange,
  perPageOptions = [10, 25, 50, 100, 200],
}: TablePaginationProps) {
  const totalPages = Math.ceil(totalItems / perPage);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near start: 1 2 3 ... last
        for (let i = 2; i <= 3; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end: 1 ... last-2 last-1 last
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
      } else {
        // Middle: 1 ... current ... last
        pages.push('...');
        pages.push(currentPage);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Calculate display range
  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalItems);

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2">
      {/* Left side - Info */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
        <span>Showing</span>
        <Select
          value={perPage.toString()}
          onValueChange={(value) => onPerPageChange(Number(value))}
        >
          <SelectTrigger className="w-[70px] h-8 border-primary/30 focus:ring-primary flex-shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-50" position="popper" sideOffset={4}>
            {perPageOptions.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="whitespace-nowrap">
          {startItem} to {endItem} of {totalItems}
        </span>
      </div>

      {/* Right side - Pagination controls */}
      <div className="flex items-center gap-1">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={cn(
            "flex items-center gap-1 px-3 py-2 text-sm rounded-md transition-colors",
            currentPage === 1
              ? "text-muted-foreground/50 cursor-not-allowed"
              : "text-muted-foreground hover:text-primary hover:bg-primary/10"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) =>
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={cn(
                  "h-9 w-9 rounded-md flex items-center justify-center text-sm font-medium transition-colors",
                  currentPage === page
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={cn(
            "flex items-center gap-1 px-3 py-2 text-sm rounded-md transition-colors",
            currentPage === totalPages
              ? "text-muted-foreground/50 cursor-not-allowed"
              : "text-muted-foreground hover:text-primary hover:bg-primary/10"
          )}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
