import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Edit, Trash2 } from 'lucide-react';
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
  MitraOrder,
  orderTypeLabels,
  orderTypeColors,
  paymentStatusLabels,
  paymentStatusColors,
  orderStatusLabels,
  orderStatusColors,
  settlementStatusLabels,
  settlementStatusColors,
} from '@/types/mitraOrder';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface OrderTableProps {
  orders: MitraOrder[];
  isAdmin: boolean;
  onEdit: (order: MitraOrder) => void;
  onDelete: (order: MitraOrder) => void;
  currentPage: number;
  perPage: number;
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
}: OrderTableProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[60px] text-center">No</TableHead>
            <TableHead className="min-w-[120px]">Nomor Order</TableHead>
            <TableHead className="min-w-[200px]">Detail Order</TableHead>
            <TableHead className="min-w-[120px]">Type Order</TableHead>
            <TableHead className="min-w-[150px]">Nama PJ Freelance</TableHead>
            <TableHead className="min-w-[150px]">Catatan</TableHead>
            <TableHead className="min-w-[110px]">Tgl Start</TableHead>
            <TableHead className="min-w-[120px]">Status Pembayaran</TableHead>
            <TableHead className="min-w-[120px] text-right">Total DP</TableHead>
            <TableHead className="min-w-[120px] text-right">Kekurangan</TableHead>
            <TableHead className="min-w-[130px] text-right">Total Pembayaran</TableHead>
            <TableHead className="min-w-[120px] text-right">Fee Freelance</TableHead>
            <TableHead className="min-w-[110px]">Tgl End</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="min-w-[120px]">Status Pelunasan</TableHead>
            <TableHead className="min-w-[150px]">Catatan Admin</TableHead>
            {isAdmin && <TableHead className="w-[100px] text-center">Aksi</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 17 : 16} className="h-24 text-center text-muted-foreground">
                Tidak ada data order
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order, index) => (
              <TableRow key={order.id} className="hover:bg-muted/30">
                <TableCell className="text-center font-medium">
                  {(currentPage - 1) * perPage + index + 1}
                </TableCell>
                <TableCell className="font-medium">{order.nomorOrder}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={order.detailOrder}>
                  {order.detailOrder}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={orderTypeColors[order.typeOrder]}>
                    {orderTypeLabels[order.typeOrder]}
                  </Badge>
                </TableCell>
                <TableCell>{order.namaPjFreelance}</TableCell>
                <TableCell className="max-w-[150px] truncate" title={order.catatan || '-'}>
                  {order.catatan || '-'}
                </TableCell>
                <TableCell>
                  {format(order.tanggalStart, 'dd MMM yyyy', { locale: id })}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={paymentStatusColors[order.statusPembayaran]}>
                    {paymentStatusLabels[order.statusPembayaran]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(order.totalDp)}</TableCell>
                <TableCell className="text-right">{formatCurrency(order.kekurangan)}</TableCell>
                <TableCell className="text-right">{formatCurrency(order.totalPembayaran)}</TableCell>
                <TableCell className="text-right">{formatCurrency(order.feeFreelance)}</TableCell>
                <TableCell>
                  {order.tanggalEnd
                    ? format(order.tanggalEnd, 'dd MMM yyyy', { locale: id })
                    : '-'}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={orderStatusColors[order.status]}>
                    {orderStatusLabels[order.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={settlementStatusColors[order.statusPelunasan]}>
                    {settlementStatusLabels[order.statusPelunasan]}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[150px] truncate" title={order.catatanAdmin || '-'}>
                  {order.catatanAdmin || '-'}
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(order)}
                        className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(order)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
