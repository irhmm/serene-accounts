import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { 
  FranchiseFinance, 
  FranchiseFinanceFormData, 
  PaymentStatus,
  FormCompletenessStatus,
  WorkStatus,
} from '@/types/franchiseFinance';
import { Franchise } from '@/types/franchise';
import { Worker } from '@/types/worker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface FranchiseFinanceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FranchiseFinanceFormData) => Promise<boolean>;
  editingFinance: FranchiseFinance | null;
  franchises: Franchise[];
  workers: Worker[];
  calculateFields: (total: number) => { feeMentor: number; keuntunganBersih: number; komisiMitra: number };
}

export function FranchiseFinanceForm({
  open,
  onOpenChange,
  onSubmit,
  editingFinance,
  franchises,
  workers,
  calculateFields,
}: FranchiseFinanceFormProps) {
  const [calculatedValues, setCalculatedValues] = useState({
    feeMentor: 0,
    keuntunganBersih: 0,
    komisiMitra: 0,
  });

  const form = useForm<FranchiseFinanceFormData>({
    defaultValues: {
      tanggalClosingOrder: new Date(),
      detailOrder: '',
      nomorOrder: '',
      franchiseId: '',
      pjMentor: '',
      statusKelengkapan: 'perlu_adjustment',
      totalPaymentCust: 0,
      tanggalPembayaranFranchisee: null,
      statusPembayaran: 'pending',
      statusPengerjaan: 'not_started',
      catatanHandover: '',
    },
  });

  useEffect(() => {
    if (editingFinance) {
      form.reset({
        tanggalClosingOrder: editingFinance.tanggalClosingOrder,
        detailOrder: editingFinance.detailOrder,
        nomorOrder: editingFinance.nomorOrder,
        franchiseId: editingFinance.franchiseId || '',
        pjMentor: editingFinance.pjMentor || '',
        statusKelengkapan: editingFinance.statusKelengkapan,
        totalPaymentCust: editingFinance.totalPaymentCust,
        tanggalPembayaranFranchisee: editingFinance.tanggalPembayaranFranchisee,
        statusPembayaran: editingFinance.statusPembayaran,
        statusPengerjaan: editingFinance.statusPengerjaan,
        catatanHandover: editingFinance.catatanHandover || '',
      });
      setCalculatedValues(calculateFields(editingFinance.totalPaymentCust));
    } else {
      form.reset({
        tanggalClosingOrder: new Date(),
        detailOrder: '',
        nomorOrder: '',
        franchiseId: '',
        pjMentor: '',
        statusKelengkapan: 'perlu_adjustment',
        totalPaymentCust: 0,
        tanggalPembayaranFranchisee: null,
        statusPembayaran: 'pending',
        statusPengerjaan: 'not_started',
        catatanHandover: '',
      });
      setCalculatedValues({ feeMentor: 0, keuntunganBersih: 0, komisiMitra: 0 });
    }
  }, [editingFinance, form, calculateFields]);

  const handleTotalChange = (value: number) => {
    setCalculatedValues(calculateFields(value));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleSubmit = async (data: FranchiseFinanceFormData) => {
    const success = await onSubmit(data);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingFinance ? 'Edit Data Keuangan' : 'Tambah Data Keuangan'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tanggalClosingOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Closing Order</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : 'Pilih tanggal'}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nomorOrder"
                rules={{ required: 'Nomor order wajib diisi' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Order</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nomor order" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="detailOrder"
              rules={{ required: 'Detail order wajib diisi' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detail Order</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Masukkan detail order" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="franchiseId"
                rules={{ required: 'Franchise wajib dipilih' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Franchise</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih franchise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {franchises.map((franchise) => (
                          <SelectItem key={franchise.id} value={franchise.id}>
                            {franchise.namaFranchise}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pjMentor"
                rules={{ required: 'PJ Mentor wajib dipilih' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PJ Mentor</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih mentor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {workers.map((worker) => (
                          <SelectItem key={worker.id} value={worker.id}>
                            {worker.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="statusKelengkapan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Kelengkapan Form</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="lengkap">Lengkap</SelectItem>
                      <SelectItem value="perlu_adjustment">Perlu Adjustment</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="totalPaymentCust"
                rules={{ required: 'Total payment wajib diisi' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Payment Cust</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={field.value === 0 ? '' : field.value.toString()}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/[^0-9]/g, '');
                          const value = rawValue === '' ? 0 : parseInt(rawValue, 10);
                          field.onChange(value);
                          handleTotalChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Fee Mentor (43%)</FormLabel>
                <Input
                  value={formatCurrency(calculatedValues.feeMentor)}
                  readOnly
                  tabIndex={0}
                  className="bg-muted cursor-default"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormLabel>Keuntungan Bersih (60% dari sisa)</FormLabel>
                <Input
                  value={formatCurrency(calculatedValues.keuntunganBersih)}
                  readOnly
                  tabIndex={0}
                  className="bg-muted cursor-default"
                />
              </div>

              <div className="space-y-2">
                <FormLabel>Komisi Mitra (40% dari sisa)</FormLabel>
                <Input
                  value={formatCurrency(calculatedValues.komisiMitra)}
                  readOnly
                  tabIndex={0}
                  className="bg-muted cursor-default"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tanggalPembayaranFranchisee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Pembayaran ke Franchisee</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : 'Pilih tanggal'}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="statusPembayaran"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Pembayaran</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="done">Done</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="non">Non</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="statusPengerjaan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Pengerjaan</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="done">Done</SelectItem>
                      <SelectItem value="on_progress">On Progress</SelectItem>
                      <SelectItem value="not_started">Not Started</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="catatanHandover"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan Hand Over</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Masukkan catatan hand over (opsional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit">
                {editingFinance ? 'Simpan Perubahan' : 'Tambah Data'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
