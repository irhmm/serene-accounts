import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
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
import { Calendar } from '@/components/ui/calendar';
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

interface OrderFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (order: Omit<MitraOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: MitraOrder | null;
  workers: Worker[];
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
  const [kekurangan, setKekurangan] = useState(0);
  const [totalPembayaran, setTotalPembayaran] = useState(0);
  const [feeFreelance, setFeeFreelance] = useState(0);
  const [tanggalEnd, setTanggalEnd] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<OrderStatus>('pending');
  const [statusPelunasan, setStatusPelunasan] = useState<SettlementStatus>('belum_lunas');
  const [catatanAdmin, setCatatanAdmin] = useState('');

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
      setKekurangan(initialData.kekurangan);
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
    setKekurangan(0);
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Order' : 'Tambah Order Baru'}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4 p-1">
            <div className="grid grid-cols-2 gap-4">
              {/* Nomor Order */}
              <div className="space-y-2">
                <Label htmlFor="nomorOrder">Nomor Order</Label>
                <Input
                  id="nomorOrder"
                  value={nomorOrder}
                  onChange={(e) => setNomorOrder(e.target.value)}
                  required
                />
              </div>

              {/* Type Order */}
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

            {/* Detail Order */}
            <div className="space-y-2">
              <Label htmlFor="detailOrder">Detail Order</Label>
              <Textarea
                id="detailOrder"
                value={detailOrder}
                onChange={(e) => setDetailOrder(e.target.value)}
                required
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Nama PJ Freelance */}
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

              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
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

            <div className="grid grid-cols-2 gap-4">
              {/* Tanggal Start */}
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
                      {tanggalStart ? format(tanggalStart, 'PPP') : 'Pilih tanggal'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={tanggalStart}
                      onSelect={(date) => date && setTanggalStart(date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Tanggal End */}
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
                      {tanggalEnd ? format(tanggalEnd, 'PPP') : 'Pilih tanggal'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
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

            <div className="grid grid-cols-2 gap-4">
              {/* Status Pembayaran */}
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

              {/* Status Pelunasan */}
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

            <div className="grid grid-cols-2 gap-4">
              {/* Total DP */}
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

              {/* Total Pembayaran */}
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
              {/* Kekurangan */}
              <div className="space-y-2">
                <Label htmlFor="kekurangan">Kekurangan (Rp)</Label>
                <Input
                  id="kekurangan"
                  type="number"
                  value={kekurangan}
                  onChange={(e) => setKekurangan(Number(e.target.value))}
                  min={0}
                />
              </div>

              {/* Fee Freelance */}
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

            {/* Catatan */}
            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan</Label>
              <Textarea
                id="catatan"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                rows={2}
              />
            </div>

            {/* Catatan Admin */}
            <div className="space-y-2">
              <Label htmlFor="catatanAdmin">Catatan Admin</Label>
              <Textarea
                id="catatanAdmin"
                value={catatanAdmin}
                onChange={(e) => setCatatanAdmin(e.target.value)}
                rows={2}
              />
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
