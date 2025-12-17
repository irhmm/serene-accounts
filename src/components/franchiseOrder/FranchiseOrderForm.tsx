import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, FileText, Building2, User, Settings } from 'lucide-react';
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
  FranchiseOrder,
  FormCompletenessStatus,
  WorkStatus,
  formCompletenessLabels,
  workStatusLabels,
} from '@/types/franchiseOrder';
import { Franchise } from '@/types/franchise';
import { Worker } from '@/types/worker';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface FranchiseOrderFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (order: Omit<FranchiseOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: FranchiseOrder | null;
  franchises: Franchise[];
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

export function FranchiseOrderForm({ open, onClose, onSubmit, initialData, franchises, workers }: FranchiseOrderFormProps) {
  const [nomorOrder, setNomorOrder] = useState('');
  const [detailOrder, setDetailOrder] = useState('');
  const [tanggalMasuk, setTanggalMasuk] = useState<Date>(new Date());
  const [catatan, setCatatan] = useState('');
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [pjFranchisee, setPjFranchisee] = useState('');
  const [totalPembayaran, setTotalPembayaran] = useState(0);
  const [statusKelengkapan, setStatusKelengkapan] = useState<FormCompletenessStatus>('perlu_detail');
  const [catatanHandover, setCatatanHandover] = useState('');
  const [pjMentor, setPjMentor] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState<Date | undefined>(undefined);
  const [statusPengerjaan, setStatusPengerjaan] = useState<WorkStatus>('not_started');

  useEffect(() => {
    if (initialData) {
      setNomorOrder(initialData.nomorOrder);
      setDetailOrder(initialData.detailOrder);
      setTanggalMasuk(initialData.tanggalMasuk);
      setCatatan(initialData.catatan || '');
      setDeadline(initialData.deadline || undefined);
      setPjFranchisee(initialData.pjFranchisee);
      setTotalPembayaran(initialData.totalPembayaran);
      setStatusKelengkapan(initialData.statusKelengkapan);
      setCatatanHandover(initialData.catatanHandover || '');
      setPjMentor(initialData.pjMentor);
      setTanggalSelesai(initialData.tanggalSelesai || undefined);
      setStatusPengerjaan(initialData.statusPengerjaan);
    } else {
      resetForm();
    }
  }, [initialData, open]);

  const resetForm = () => {
    setNomorOrder('');
    setDetailOrder('');
    setTanggalMasuk(new Date());
    setCatatan('');
    setDeadline(undefined);
    setPjFranchisee('');
    setTotalPembayaran(0);
    setStatusKelengkapan('perlu_detail');
    setCatatanHandover('');
    setPjMentor('');
    setTanggalSelesai(undefined);
    setStatusPengerjaan('not_started');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nomorOrder,
      detailOrder,
      tanggalMasuk,
      catatan: catatan || null,
      deadline: deadline || null,
      pjFranchisee,
      totalPembayaran,
      statusKelengkapan,
      catatanHandover: catatanHandover || null,
      pjMentor,
      tanggalSelesai: tanggalSelesai || null,
      statusPengerjaan,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {initialData ? 'Edit Order Franchise' : 'Tambah Order Franchise Baru'}
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
                    placeholder="FRO-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tanggal Masuk</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !tanggalMasuk && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {tanggalMasuk ? format(tanggalMasuk, 'dd MMM yyyy') : 'Pilih tanggal'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={tanggalMasuk}
                        onSelect={(date) => date && setTanggalMasuk(date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
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

            {/* Section 2: Franchise & Deadline */}
            <div className="space-y-4">
              <SectionHeader icon={<Building2 className="h-4 w-4" />} title="Franchise & Deadline" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>PJ Franchisee</Label>
                  <Select value={pjFranchisee} onValueChange={setPjFranchisee} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih franchisee" />
                    </SelectTrigger>
                    <SelectContent>
                      {franchises.map((franchise) => (
                        <SelectItem key={franchise.id} value={franchise.namaFranchise}>
                          {franchise.namaFranchise}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Deadline</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !deadline && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deadline ? format(deadline, 'dd MMM yyyy') : 'Pilih deadline'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={deadline}
                        onSelect={setDeadline}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label>Status Kelengkapan Form</Label>
                  <Select
                    value={statusKelengkapan}
                    onValueChange={(v) => setStatusKelengkapan(v as FormCompletenessStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(formCompletenessLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Section 3: Handover & Mentor */}
            <div className="space-y-4">
              <SectionHeader icon={<User className="h-4 w-4" />} title="Handover & Mentor" />
              <div className="space-y-2">
                <Label htmlFor="catatanHandover">Catatan Hand Over</Label>
                <Textarea
                  id="catatanHandover"
                  value={catatanHandover}
                  onChange={(e) => setCatatanHandover(e.target.value)}
                  placeholder="Catatan handover..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>PJ Mentor</Label>
                <Select value={pjMentor} onValueChange={setPjMentor} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mentor" />
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
            </div>

            <Separator />

            {/* Section 4: Status */}
            <div className="space-y-4">
              <SectionHeader icon={<Settings className="h-4 w-4" />} title="Status" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tanggal Selesai Pengerjaan Pusat</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !tanggalSelesai && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {tanggalSelesai ? format(tanggalSelesai, 'dd MMM yyyy') : 'Pilih tanggal'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={tanggalSelesai}
                        onSelect={setTanggalSelesai}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Status Pengerjaan</Label>
                  <Select
                    value={statusPengerjaan}
                    onValueChange={(v) => setStatusPengerjaan(v as WorkStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(workStatusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
