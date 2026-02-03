import { Fragment, useMemo } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { MoreHorizontal, Edit, Trash2, ClipboardList } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  MitraOrder,
  paymentStatusLabels,
  paymentStatusColors,
  settlementStatusLabels,
  settlementStatusColors,
  workStatusLabels,
  workStatusColors,
  getOrderTypeLabel,
  getOrderTypeColor,
} from '@/types/mitraOrder';
import { DateSortToggle, SortOrder } from '@/components/ui/date-sort-toggle';

interface OrderTableProps {
  orders: MitraOrder[];
  isAdmin: boolean;
  onEdit: (order: MitraOrder) => void;
  onDelete: (order: MitraOrder) => void;
  currentPage: number;
  perPage: number;
  sortOrder?: SortOrder;
  onSortChange?: (order: SortOrder) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export function OrderTable({
  orders,
  isAdmin,
  onEdit,
  onDelete,
  currentPage,
  perPage,
  sortOrder = 'desc',
  onSortChange,
}: OrderTableProps) {
  // Group orders by month/year based on tanggalStart
  const groupedOrders = useMemo(() => {
    const groups: { [key: string]: MitraOrder[] } = {};
    
    orders.forEach((order) => {
      const date = new Date(order.tanggalStart);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(order);
    });
    
    return Object.entries(groups)
      .sort(([a], [b]) => sortOrder === 'desc' ? b.localeCompare(a) : a.localeCompare(b))
      .map(([key, items]) => ({
        key,
        month: parseInt(key.split('-')[1]),
        year: parseInt(key.split('-')[0]),
        orders: items.sort((a, b) => {
          const dateA = new Date(a.tanggalStart).getTime();
          const dateB = new Date(b.tanggalStart).getTime();
          return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        }),
        totalOrders: items.length,
        totalPembayaran: items.reduce((sum, o) => sum + o.totalPembayaran, 0),
        totalFeeMitra: items.reduce((sum, o) => sum + o.feeFreelance, 0),
      }));
  }, [orders, sortOrder]);

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center card-shadow">
        <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-muted flex items-center justify-center">
          <ClipboardList className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Belum ada order</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Mulai dengan menambahkan order pertama
        </p>
      </div>
    );
  }

  let rowNumber = (currentPage - 1) * perPage;

  return (
    <TooltipProvider>
      <div className="rounded-lg border bg-card overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[50px] text-center font-semibold">No</TableHead>
                <TableHead className="min-w-[110px] font-semibold">No. Order</TableHead>
                <TableHead className="min-w-[180px] font-semibold">Detail</TableHead>
                <TableHead className="min-w-[100px] font-semibold">Type</TableHead>
                <TableHead className="min-w-[130px] font-semibold">PJ Freelance</TableHead>
                <TableHead className="min-w-[100px] font-semibold">Pengerjaan</TableHead>
                <TableHead className="min-w-[100px]">
                  {onSortChange ? (
                    <DateSortToggle
                      label="Tgl Start"
                      sortOrder={sortOrder}
                      onSortChange={onSortChange}
                    />
                  ) : (
                    <span className="font-semibold">Tgl Start</span>
                  )}
                </TableHead>
                <TableHead className="min-w-[100px] font-semibold">Deadline</TableHead>
                <TableHead className="min-w-[110px] font-semibold">Pembayaran</TableHead>
                <TableHead className="min-w-[110px] text-right font-semibold">Total DP</TableHead>
                <TableHead className="min-w-[120px] text-right font-semibold">Total Bayar</TableHead>
                <TableHead className="min-w-[110px] text-right font-semibold">Kekurangan</TableHead>
                <TableHead className="min-w-[100px] text-right font-semibold">Fee Mitra</TableHead>
                <TableHead className="min-w-[100px] font-semibold">Pelunasan</TableHead>
                {isAdmin && <TableHead className="w-[60px] text-center font-semibold">Aksi</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedOrders.map((group) => (
                <Fragment key={group.key}>
                  {/* Month Separator Header */}
                  <TableRow className="bg-muted/30 hover:bg-muted/30 border-y border-muted">
                    <TableCell colSpan={isAdmin ? 15 : 14} className="py-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-foreground text-sm">
                          {format(new Date(group.year, group.month - 1), "MMMM yyyy", { locale: id })}
                        </span>
                        <div className="flex gap-4 text-xs">
                          <span className="text-muted-foreground font-medium">
                            {group.totalOrders} Order
                          </span>
                          <span className="text-emerald-600 font-medium">
                            Pembayaran: {formatCurrency(group.totalPembayaran)}
                          </span>
                          <span className="text-blue-600 font-medium">
                            Fee Mitra: {formatCurrency(group.totalFeeMitra)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* Orders in this month */}
                  {group.orders.map((order, index) => {
                    rowNumber++;
                    return (
                      <TableRow 
                        key={order.id} 
                        className="hover:bg-muted/30 transition-colors animate-fade-in"
                      >
                        <TableCell className="text-center font-medium text-muted-foreground">
                          {rowNumber}
                        </TableCell>
                        <TableCell className="font-semibold text-foreground">{order.nomorOrder}</TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="max-w-[180px] truncate block cursor-help">
                                {order.detailOrder}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-[300px]">
                              <p className="whitespace-pre-wrap">{order.detailOrder}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getOrderTypeColor(order.typeOrder)}>
                            {getOrderTypeLabel(order.typeOrder)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{order.namaPjFreelance}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={workStatusColors[order.statusPengerjaan] || workStatusColors.not_started}>
                            {workStatusLabels[order.statusPengerjaan] || workStatusLabels.not_started}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(order.tanggalStart, 'dd MMM yy', { locale: id })}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {order.tanggalDeadline 
                            ? format(order.tanggalDeadline, 'dd MMM yy', { locale: id }) 
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={paymentStatusColors[order.statusPembayaran]}>
                            {paymentStatusLabels[order.statusPembayaran]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(order.totalDp)}</TableCell>
                        <TableCell className="text-right font-semibold text-emerald-600">
                          {formatCurrency(order.totalPembayaran)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-amber-600">
                          {formatCurrency(order.kekurangan)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-blue-600">
                          {formatCurrency(order.feeFreelance)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={settlementStatusColors[order.statusPelunasan]}>
                            {settlementStatusLabels[order.statusPelunasan]}
                          </Badge>
                        </TableCell>
                        {isAdmin && (
                          <TableCell className="text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-popover">
                                <DropdownMenuItem onClick={() => onEdit(order)} className="cursor-pointer">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => onDelete(order)} 
                                  className="cursor-pointer text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Hapus
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
      </div>
    </TooltipProvider>
  );
}
