import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortOrder = 'asc' | 'desc';

interface DateSortToggleProps {
  label: string;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  className?: string;
}

export function DateSortToggle({ 
  label, 
  sortOrder, 
  onSortChange,
  className 
}: DateSortToggleProps) {
  const handleToggle = () => {
    onSortChange(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold touch-manipulation cursor-pointer",
        "hover:text-primary transition-colors min-h-[44px]",
        className
      )}
    >
      <span>{label}</span>
      {sortOrder === 'desc' ? (
        <ArrowDown className="h-4 w-4" />
      ) : (
        <ArrowUp className="h-4 w-4" />
      )}
    </button>
  );
}
