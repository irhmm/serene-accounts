import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Pencil, Trash2 } from 'lucide-react';
import { FranchiseFinance } from '@/types/franchiseFinance';
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

interface FranchiseFinanceTableProps {
  finances: FranchiseFinance[];
  onEdit: (finance: FranchiseFinance) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
  startIndex: number;
}

export function FranchiseFinanceTable({
  finances,
  onEdit,
  onDelete,
  isAdmin,
  startIndex,
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'done':
        return <Badge className="bg-green-500 hover:bg-green-600">Done</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">No</TableHead>
            <TableHead className="min-w-[120px]">Tanggal Order</TableHead>
            <TableHead className="min-w-[200px]">Detail Order</TableHead>
            <TableHead className="min-w-[120px]">No. Order</TableHead>
            <TableHead className="min-w-[150px]">Franchise</TableHead>
            <TableHead className="min-w-[140px]">Total Payment</TableHead>
            <TableHead className="min-w-[130px]">Fee Mentor (43%)</TableHead>
            <TableHead className="min-w-[140px]">Keuntungan Bersih</TableHead>
            <TableHead className="min-w-[130px]">Komisi Mitra (40%)</TableHead>
            <TableHead className="min-w-[140px]">Tgl Bayar Franchisee</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="min-w-[150px]">Catatan</TableHead>
            {isAdmin && <TableHead className="w-24">Aksi</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {finances.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 13 : 12} className="text-center py-8 text-muted-foreground">
                Tidak ada data keuangan franchise
              </TableCell>
            </TableRow>
          ) : (
            finances.map((finance, index) => (
              <TableRow key={finance.id}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>{formatDate(finance.tanggalOrder)}</TableCell>
                <TableCell className="max-w-[200px] truncate">{finance.detailOrder}</TableCell>
                <TableCell>{finance.nomorOrder}</TableCell>
                <TableCell>{finance.franchiseName}</TableCell>
                <TableCell>{formatCurrency(finance.totalPaymentCust)}</TableCell>
                <TableCell>{formatCurrency(finance.feeMentor)}</TableCell>
                <TableCell>{formatCurrency(finance.keuntunganBersih)}</TableCell>
                <TableCell>{formatCurrency(finance.komisiMitra)}</TableCell>
                <TableCell>{formatDate(finance.tanggalPembayaranFranchisee)}</TableCell>
                <TableCell>{getStatusBadge(finance.statusPembayaran)}</TableCell>
                <TableCell className="max-w-[150px] truncate">{finance.catatan || '-'}</TableCell>
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
