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

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  typeFilter: TransactionType | 'all';
  onTypeFilterChange: (type: TransactionType | 'all') => void;
  statusFilter: ExpenseStatus | 'all';
  onStatusFilterChange: (status: ExpenseStatus | 'all') => void;
  monthFilter: number | 'all';
  onMonthFilterChange: (month: number | 'all') => void;
  yearFilter: number | 'all';
  onYearFilterChange: (year: number | 'all') => void;
  dayFilter: number | 'all';
  onDayFilterChange: (day: number | 'all') => void;
  availableYears: number[];
}

const getDaysInMonth = (month: number | 'all', year: number | 'all'): number => {
  if (month === 'all' || year === 'all') return 0;
  return new Date(year, month, 0).getDate();
};

export function SearchFilter({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  monthFilter,
  onMonthFilterChange,
  yearFilter,
  onYearFilterChange,
  dayFilter,
  onDayFilterChange,
  availableYears,
}: SearchFilterProps) {
  const showDayFilter = monthFilter !== 'all' && yearFilter !== 'all';
  const daysInMonth = getDaysInMonth(monthFilter, yearFilter);
  return (
    <div className="flex flex-col gap-3">
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
      <div className="flex flex-col sm:flex-row gap-3">
        <Select 
          value={monthFilter.toString()} 
          onValueChange={(v) => onMonthFilterChange(v === 'all' ? 'all' : parseInt(v))}
        >
          <SelectTrigger className="w-full sm:w-[160px] input-focus">
            <SelectValue placeholder="Semua Bulan" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">Semua Bulan</SelectItem>
            {monthNames.map((name, index) => (
              <SelectItem key={index} value={(index + 1).toString()}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          value={yearFilter.toString()} 
          onValueChange={(v) => onYearFilterChange(v === 'all' ? 'all' : parseInt(v))}
        >
          <SelectTrigger className="w-full sm:w-[140px] input-focus">
            <SelectValue placeholder="Semua Tahun" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">Semua Tahun</SelectItem>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {showDayFilter && (
          <Select 
            value={dayFilter.toString()} 
            onValueChange={(v) => onDayFilterChange(v === 'all' ? 'all' : parseInt(v))}
          >
            <SelectTrigger className="w-full sm:w-[130px] input-focus">
              <SelectValue placeholder="Tanggal" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">Semua Tanggal</SelectItem>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  Tanggal {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}