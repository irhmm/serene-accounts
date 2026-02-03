import { Fragment, useMemo } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Pencil, Trash2 } from 'lucide-react';
import { 
  FranchiseFinance,
  formCompletenessLabels,
  formCompletenessColors,
  workStatusLabels,
  workStatusColors,
  paymentStatusLabels,
  paymentStatusColors,
} from '@/types/franchiseFinance';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DateSortToggle, SortOrder } from '@/components/ui/date-sort-toggle';

interface FranchiseFinanceTableProps {
  finances: FranchiseFinance[];
  onEdit: (finance: FranchiseFinance) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
  startIndex: number;
  sortOrder?: SortOrder;
  onSortChange?: (order: SortOrder) => void;
}

export function FranchiseFinanceTable({
  finances,
  onEdit,
  onDelete,
  isAdmin,
  startIndex,
  sortOrder = 'desc',
  onSortChange,
}: FranchiseFinanceTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return format(date, 'dd MMM yyyy', { locale: id });
  };

  // Group finances by month/year based on tanggalClosingOrder
  const groupedFinances = useMemo(() => {
    const groups: { [key: string]: FranchiseFinance[] } = {};
    
    finances.forEach((finance) => {
      const date = new Date(finance.tanggalClosingOrder);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(finance);
    });
    
    // Sort chronologically first to calculate cumulative totals
    const sortedGroups = Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b)); // Always ascending for cumulative calculation
    
    // Calculate cumulative totals for pendapatan franchise (komisiMitra)
    let cumulativeKomisiMitra = 0;
    const groupsWithCumulative = sortedGroups.map(([key, items]) => {
      const monthlyKomisiMitra = items.reduce((sum, f) => sum + f.komisiMitra, 0);
      cumulativeKomisiMitra += monthlyKomisiMitra;
      
      return {
        key,
        month: parseInt(key.split('-')[1]),
        year: parseInt(key.split('-')[0]),
        finances: items.sort((a, b) => {
          const dateA = new Date(a.tanggalClosingOrder).getTime();
          const dateB = new Date(b.tanggalClosingOrder).getTime();
          return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        }),
        totalOrders: items.length,
        totalRevenue: items.reduce((sum, f) => sum + f.totalPaymentCust, 0),
        totalFeeMentor: items.reduce((sum, f) => sum + f.feeMentor, 0),
        totalKeuntungan: items.reduce((sum, f) => sum + f.keuntunganBersih, 0),
        totalKomisiMitra: monthlyKomisiMitra,
        accumulatedKomisiMitra: cumulativeKomisiMitra,
      };
    });
    
    // Re-sort based on display order
    return groupsWithCumulative.sort((a, b) => 
      sortOrder === 'desc' ? b.key.localeCompare(a.key) : a.key.localeCompare(b.key)
    );
  }, [finances, sortOrder]);

  if (finances.length === 0) {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">No</TableHead>
              <TableHead className="min-w-[120px]">Tgl Closing</TableHead>
              <TableHead className="min-w-[200px]">Detail Order</TableHead>
              <TableHead className="min-w-[120px]">No. Order</TableHead>
              <TableHead className="min-w-[150px]">Franchise</TableHead>
              <TableHead className="min-w-[120px]">PJ Mentor</TableHead>
              <TableHead className="min-w-[130px]">Status Kelengkapan</TableHead>
              <TableHead className="min-w-[140px]">Total Payment</TableHead>
              <TableHead className="min-w-[130px]">Fee Mentor (43%)</TableHead>
              <TableHead className="min-w-[140px]">Keuntungan Bersih</TableHead>
              <TableHead className="min-w-[130px]">Komisi Mitra (40%)</TableHead>
              <TableHead className="min-w-[140px]">Tgl Bayar Franchisee</TableHead>
              <TableHead className="min-w-[120px]">Status Bayar</TableHead>
              <TableHead className="min-w-[120px]">Status Kerja</TableHead>
              <TableHead className="min-w-[150px]">Catatan Handover</TableHead>
              {isAdmin && <TableHead className="w-24">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={isAdmin ? 16 : 15} className="text-center py-8 text-muted-foreground">
                Tidak ada data keuangan franchise
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  let rowNumber = startIndex;

  return (
    <TooltipProvider>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">No</TableHead>
              <TableHead className="min-w-[120px]">
                {onSortChange ? (
                  <DateSortToggle
                    label="Tgl Closing"
                    sortOrder={sortOrder}
                    onSortChange={onSortChange}
                  />
                ) : (
                  <span>Tgl Closing</span>
                )}
              </TableHead>
              <TableHead className="min-w-[200px]">Detail Order</TableHead>
              <TableHead className="min-w-[120px]">No. Order</TableHead>
              <TableHead className="min-w-[150px]">Franchise</TableHead>
              <TableHead className="min-w-[120px]">PJ Mentor</TableHead>
              <TableHead className="min-w-[130px]">Status Kelengkapan</TableHead>
              <TableHead className="min-w-[140px]">Total Payment</TableHead>
              <TableHead className="min-w-[130px]">Fee Mentor (43%)</TableHead>
              <TableHead className="min-w-[140px]">Keuntungan Bersih</TableHead>
              <TableHead className="min-w-[130px]">Komisi Mitra (40%)</TableHead>
              <TableHead className="min-w-[140px]">Tgl Bayar Franchisee</TableHead>
              <TableHead className="min-w-[120px]">Status Bayar</TableHead>
              <TableHead className="min-w-[120px]">Status Kerja</TableHead>
              <TableHead className="min-w-[150px]">Catatan Handover</TableHead>
              {isAdmin && <TableHead className="w-24">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedFinances.map((group) => (
              <Fragment key={group.key}>
                {/* Month Separator Header */}
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-y border-muted">
                  <TableCell colSpan={isAdmin ? 16 : 15} className="py-2">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="font-semibold text-foreground text-sm">
                        {format(new Date(group.year, group.month - 1), "MMMM yyyy", { locale: id })}
                      </span>
                      <div className="flex gap-4 text-xs flex-wrap">
                        <span className="text-muted-foreground font-medium">
                          {group.totalOrders} Order
                        </span>
                        <span className="text-primary font-medium">
                          Revenue: {formatCurrency(group.totalRevenue)}
                        </span>
                        <span className="text-destructive font-medium">
                          Fee Mentor: {formatCurrency(group.totalFeeMentor)}
                        </span>
                        <span className="text-primary font-medium">
                          Keuntungan: {formatCurrency(group.totalKeuntungan)}
                        </span>
                        <span className="text-foreground font-semibold bg-accent/50 px-2 py-0.5 rounded">
                          Akumulasi Pendapatan: {formatCurrency(group.accumulatedKomisiMitra)}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
                
                {/* Finances in this month */}
                {group.finances.map((finance) => {
                  rowNumber++;
                  return (
                    <TableRow key={finance.id}>
                      <TableCell>{rowNumber}</TableCell>
                      <TableCell>{formatDate(finance.tanggalClosingOrder)}</TableCell>
                      <TableCell className="max-w-[200px]">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="truncate block">{finance.detailOrder}</span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            {finance.detailOrder}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{finance.nomorOrder}</TableCell>
                      <TableCell>{finance.franchiseName}</TableCell>
                      <TableCell>{finance.pjMentorName}</TableCell>
                      <TableCell>
                        <Badge className={formCompletenessColors[finance.statusKelengkapan]}>
                          {formCompletenessLabels[finance.statusKelengkapan]}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(finance.totalPaymentCust)}</TableCell>
                      <TableCell>{formatCurrency(finance.feeMentor)}</TableCell>
                      <TableCell>{formatCurrency(finance.keuntunganBersih)}</TableCell>
                      <TableCell>{formatCurrency(finance.komisiMitra)}</TableCell>
                      <TableCell>{formatDate(finance.tanggalPembayaranFranchisee)}</TableCell>
                      <TableCell>
                        <Badge className={paymentStatusColors[finance.statusPembayaran]}>
                          {paymentStatusLabels[finance.statusPembayaran]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={workStatusColors[finance.statusPengerjaan]}>
                          {workStatusLabels[finance.statusPengerjaan]}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[150px]">
                        {finance.catatanHandover ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="truncate block">{finance.catatanHandover}</span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              {finance.catatanHandover}
                            </TooltipContent>
                          </Tooltip>
                        ) : '-'}
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(finance)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDelete(finance.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
