import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import {
  TransactionType,
  ExpenseStatus,
  transactionTypeLabels,
  expenseStatusLabels,
} from "@/types/transaction";

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  typeFilter: TransactionType | 'all';
  onTypeFilterChange: (type: TransactionType | 'all') => void;
  statusFilter: ExpenseStatus | 'all';
  onStatusFilterChange: (status: ExpenseStatus | 'all') => void;
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari transaksi..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 input-focus"
        />
      </div>
      <Select value={typeFilter} onValueChange={(v) => onTypeFilterChange(v as TransactionType | 'all')}>
        <SelectTrigger className="w-full sm:w-[160px] input-focus">
          <SelectValue placeholder="Semua Tipe" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          <SelectItem value="all">Semua Tipe</SelectItem>
          {Object.entries(transactionTypeLabels).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={(v) => onStatusFilterChange(v as ExpenseStatus | 'all')}>
        <SelectTrigger className="w-full sm:w-[160px] input-focus">
          <SelectValue placeholder="Semua Status" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          <SelectItem value="all">Semua Status</SelectItem>
          {Object.entries(expenseStatusLabels).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
