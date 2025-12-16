import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, FileText, User, Calendar, Wallet, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  MitraOrder,
  OrderType,
  PaymentStatus,
  OrderStatus,
  SettlementStatus,
  orderTypeLabels,
  paymentStatusLabels,
  orderStatusLabels,
  settlementStatusLabels,
} from '@/types/mitraOrder';
import { Worker } from '@/types/worker';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface OrderFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (order: Omit<MitraOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: MitraOrder | null;
  workers: Worker[];
}

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

function SectionHeader({ icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-border">
      <span className="text-primary">{icon}</span>
      <h3 className="font-semibold text-sm text-foreground">{title}</h3>
    </div>
  );
}

export function OrderForm({ open, onClose, onSubmit, initialData, workers }: OrderFormProps) {
  const [nomorOrder, setNomorOrder] = useState('');
  const [detailOrder, setDetailOrder] = useState('');
  const [typeOrder, setTypeOrder] = useState<OrderType>('jasa_tugas');
  const [namaPjFreelance, setNamaPjFreelance] = useState('');
  const [catatan, setCatatan] = useState('');
  const [tanggalStart, setTanggalStart] = useState<Date>(new Date());
  const [statusPembayaran, setStatusPembayaran] = useState<PaymentStatus>('belum_bayar');
  const [totalDp, setTotalDp] = useState(0);
  const [totalPembayaran, setTotalPembayaran] = useState(0);
  const [feeFreelance, setFeeFreelance] = useState(0);
  const [tanggalEnd, setTanggalEnd] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<OrderStatus>('pending');
  const [statusPelunasan, setStatusPelunasan] = useState<SettlementStatus>('belum_lunas');
  const [catatanAdmin, setCatatanAdmin] = useState('');

  // Auto-calculate kekurangan
  const kekurangan = Math.max(0, totalPembayaran - totalDp);

  useEffect(() => {
    if (initialData) {
      setNomorOrder(initialData.nomorOrder);
      setDetailOrder(initialData.detailOrder);
      setTypeOrder(initialData.typeOrder);
      setNamaPjFreelance(initialData.namaPjFreelance);
      setCatatan(initialData.catatan || '');
      setTanggalStart(initialData.tanggalStart);
      setStatusPembayaran(initialData.statusPembayaran);
      setTotalDp(initialData.totalDp);
      setTotalPembayaran(initialData.totalPembayaran);
      setFeeFreelance(initialData.feeFreelance);
      setTanggalEnd(initialData.tanggalEnd || undefined);
      setStatus(initialData.status);
      setStatusPelunasan(initialData.statusPelunasan);
      setCatatanAdmin(initialData.catatanAdmin || '');
    } else {
      resetForm();
    }
  }, [initialData, open]);

  const resetForm = () => {
    setNomorOrder('');
    setDetailOrder('');
    setTypeOrder('jasa_tugas');
    setNamaPjFreelance('');
    setCatatan('');
    setTanggalStart(new Date());
    setStatusPembayaran('belum_bayar');
    setTotalDp(0);
    setTotalPembayaran(0);
    setFeeFreelance(0);
    setTanggalEnd(undefined);
    setStatus('pending');
    setStatusPelunasan('belum_lunas');
    setCatatanAdmin('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nomorOrder,
      detailOrder,
      typeOrder,
      namaPjFreelance,
      catatan: catatan || null,
      tanggalStart,
      statusPembayaran,
      totalDp,
      kekurangan,
      totalPembayaran,
      feeFreelance,
      tanggalEnd: tanggalEnd || null,
      status,
      statusPelunasan,
      catatanAdmin: catatanAdmin || null,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {initialData ? 'Edit Order' : 'Tambah Order Baru'}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6 p-1">
            {/* Section 1: Informasi Order */}
            <div className="space-y-4">
              <SectionHeader icon={<FileText className="h-4 w-4" />} title="Informasi Order" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomorOrder">Nomor Order</Label>
                  <Input
                    id="nomorOrder"
                    value={nomorOrder}
                    onChange={(e) => setNomorOrder(e.target.value)}
                    placeholder="ORD-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type Order</Label>
                  <Select value={typeOrder} onValueChange={(v) => setTypeOrder(v as OrderType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(orderTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="detailOrder">Detail Order</Label>
                <Textarea
                  id="detailOrder"
                  value={detailOrder}
                  onChange={(e) => setDetailOrder(e.target.value)}
                  placeholder="Deskripsi detail order..."
                  required
                  rows={2}
                />
              </div>
            </div>

            <Separator />

            {/* Section 2: Freelance & Status */}
            <div className="space-y-4">
              <SectionHeader icon={<User className="h-4 w-4" />} title="Freelance & Status" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama PJ Freelance</Label>
                  <Select value={namaPjFreelance} onValueChange={setNamaPjFreelance} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih freelance" />
                    </SelectTrigger>
                    <SelectContent>
                      {workers.map((worker) => (
                        <SelectItem key={worker.id} value={worker.nama}>
                          {worker.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status Order</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(orderStatusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="catatan">Catatan</Label>
                <Textarea
                  id="catatan"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Catatan tambahan..."
                  rows={2}
                />
              </div>
            </div>

            <Separator />

            {/* Section 3: Jadwal */}
            <div className="space-y-4">
              <SectionHeader icon={<Calendar className="h-4 w-4" />} title="Jadwal" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tanggal Start</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !tanggalStart && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {tanggalStart ? format(tanggalStart, 'dd MMM yyyy') : 'Pilih tanggal'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={tanggalStart}
                        onSelect={(date) => date && setTanggalStart(date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Tanggal End</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !tanggalEnd && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {tanggalEnd ? format(tanggalEnd, 'dd MMM yyyy') : 'Pilih tanggal'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={tanggalEnd}
                        onSelect={setTanggalEnd}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <Separator />

            {/* Section 4: Keuangan */}
            <div className="space-y-4">
              <SectionHeader icon={<Wallet className="h-4 w-4" />} title="Keuangan" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalDp">Total DP (Rp)</Label>
                  <Input
                    id="totalDp"
                    type="number"
                    value={totalDp}
                    onChange={(e) => setTotalDp(Number(e.target.value))}
                    min={0}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalPembayaran">Total Pembayaran (Rp)</Label>
                  <Input
                    id="totalPembayaran"
                    type="number"
                    value={totalPembayaran}
                    onChange={(e) => setTotalPembayaran(Number(e.target.value))}
                    min={0}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kekurangan (Rp)</Label>
                  <div className="h-10 px-3 py-2 rounded-md border bg-muted/50 flex items-center">
                    <span className="text-amber-600 font-medium">{formatCurrency(kekurangan)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Otomatis: Total Pembayaran - Total DP</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feeFreelance">Fee Freelance (Rp)</Label>
                  <Input
                    id="feeFreelance"
                    type="number"
                    value={feeFreelance}
                    onChange={(e) => setFeeFreelance(Number(e.target.value))}
                    min={0}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Section 5: Status & Admin */}
            <div className="space-y-4">
              <SectionHeader icon={<Settings className="h-4 w-4" />} title="Status & Admin" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status Pembayaran</Label>
                  <Select
                    value={statusPembayaran}
                    onValueChange={(v) => setStatusPembayaran(v as PaymentStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(paymentStatusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status Pelunasan</Label>
                  <Select
                    value={statusPelunasan}
                    onValueChange={(v) => setStatusPelunasan(v as SettlementStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(settlementStatusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="catatanAdmin">Catatan Admin</Label>
                <Textarea
                  id="catatanAdmin"
                  value={catatanAdmin}
                  onChange={(e) => setCatatanAdmin(e.target.value)}
                  placeholder="Catatan khusus admin..."
                  rows={2}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {initialData ? 'Simpan' : 'Tambah'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
