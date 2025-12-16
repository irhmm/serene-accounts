import { Search, Filter, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { workStatusLabels, paymentStatusLabels } from '@/types/mitraOrder';

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

interface OrderSearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  paymentFilter: string;
  onPaymentFilterChange: (value: string) => void;
  monthFilter: string;
  onMonthFilterChange: (value: string) => void;
  yearFilter: string;
  onYearFilterChange: (value: string) => void;
  availableYears: number[];
}

export function OrderSearchFilter({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  paymentFilter,
  onPaymentFilterChange,
  monthFilter,
  onMonthFilterChange,
  yearFilter,
  onYearFilterChange,
  availableYears,
}: OrderSearchFilterProps) {
  return (
    <div className="bg-card rounded-lg border p-3 md:p-4 shadow-sm overflow-hidden">
      <div className="flex flex-col gap-3 md:gap-4">
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nomor order atau nama freelance..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap">
          {/* Month & Year Filters */}
          <div className="flex items-center gap-2 flex-1 sm:flex-none">
            <Calendar className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <Select value={monthFilter} onValueChange={onMonthFilterChange}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Bulan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Bulan</SelectItem>
                {monthNames.map((name, index) => (
                  <SelectItem key={index} value={String(index + 1)}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select value={yearFilter} onValueChange={onYearFilterChange}>
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tahun</SelectItem>
              {availableYears.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filters */}
          <div className="flex items-center gap-2 flex-1 sm:flex-none">
            <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Pengerjaan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Pengerjaan</SelectItem>
                {Object.entries(workStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select value={paymentFilter} onValueChange={onPaymentFilterChange}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Pembayaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Pembayaran</SelectItem>
              {Object.entries(paymentStatusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
