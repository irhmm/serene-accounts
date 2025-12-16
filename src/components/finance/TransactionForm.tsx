import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Transaction,
  TransactionType,
  FreelanceCategory,
  ExpenseStatus,
  transactionTypeLabels,
  transactionTypeColors,
  freelanceCategoryLabels,
  expenseStatusLabels,
} from "@/types/transaction";

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (transaction: Omit<Transaction, 'id' | 'balance'>) => void;
  editTransaction?: Transaction;
}

export function TransactionForm({ 
  open, 
  onOpenChange, 
  onSubmit, 
  editTransaction 
}: TransactionFormProps) {
  const [date, setDate] = useState<Date>(editTransaction?.date || new Date());
  const [detail, setDetail] = useState(editTransaction?.detail || "");
  const [type, setType] = useState<TransactionType>(editTransaction?.type || "pemasukan_dp");
  const [amountIn, setAmountIn] = useState(editTransaction?.amountIn?.toString() || "");
  const [amountOut, setAmountOut] = useState(editTransaction?.amountOut?.toString() || "");
  const [freelanceCategory, setFreelanceCategory] = useState<FreelanceCategory>(
    editTransaction?.freelanceCategory || "other"
  );
  const [expenseStatus, setExpenseStatus] = useState<ExpenseStatus>(
    editTransaction?.expenseStatus || "pending"
  );
  const [notes, setNotes] = useState(editTransaction?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date,
      detail,
      type,
      amountIn: parseFloat(amountIn) || 0,
      amountOut: parseFloat(amountOut) || 0,
      freelanceCategory,
      expenseStatus,
      notes,
    });
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setDate(new Date());
    setDetail("");
    setType("pemasukan_dp");
    
    setAmountIn("");
    setAmountOut("");
    setFreelanceCategory("other");
    setExpenseStatus("pending");
    setNotes("");
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editTransaction ? "Edit Transaksi" : "Tambah Transaksi Baru"}
          </DialogTitle>
          <DialogDescription>
            Isi detail transaksi keuangan Anda di bawah ini.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            {/* Tanggal */}
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd MMMM yyyy", { locale: id }) : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Detail Transaksi */}
            <div className="space-y-2">
              <Label htmlFor="detail">Detail Transaksi</Label>
              <Input
                id="detail"
                placeholder="Masukkan detail transaksi"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                required
                className="input-focus"
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Tipe</Label>
              <Select value={type} onValueChange={(v) => setType(v as TransactionType)}>
                <SelectTrigger className="input-focus">
                  <SelectValue placeholder="Pilih tipe">
                    {type && (
                      <span className={cn("inline-flex px-2 py-0.5 rounded-full text-xs font-medium border", transactionTypeColors[type])}>
                        {transactionTypeLabels[type]}
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-popover max-h-[300px]">
                  {Object.entries(transactionTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value} className="cursor-pointer">
                      <span className={cn("inline-flex px-2 py-0.5 rounded-full text-xs font-medium border", transactionTypeColors[value as TransactionType])}>
                        {label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amountIn">Jumlah Masuk DP (Rp)</Label>
                <Input
                  id="amountIn"
                  placeholder="0"
                  value={amountIn}
                  onChange={(e) => setAmountIn(e.target.value.replace(/\D/g, ''))}
                  className="input-focus"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amountOut">Jumlah Keluar DP (Rp)</Label>
                <Input
                  id="amountOut"
                  placeholder="0"
                  value={amountOut}
                  onChange={(e) => setAmountOut(e.target.value.replace(/\D/g, ''))}
                  className="input-focus"
                />
              </div>
            </div>

            {/* Freelance Category */}
            <div className="space-y-2">
              <Label htmlFor="freelanceCategory">Keterangan Freelance</Label>
              <Select 
                value={freelanceCategory} 
                onValueChange={(v) => setFreelanceCategory(v as FreelanceCategory)}
              >
                <SelectTrigger className="input-focus">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {Object.entries(freelanceCategoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Expense Status */}
            <div className="space-y-2">
              <Label htmlFor="expenseStatus">Status Pengeluaran</Label>
              <Select 
                value={expenseStatus} 
                onValueChange={(v) => setExpenseStatus(v as ExpenseStatus)}
              >
                <SelectTrigger className="input-focus">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {Object.entries(expenseStatusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Catatan */}
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                placeholder="Tambahkan catatan (opsional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-focus resize-none"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" className="btn-primary-gradient">
              {editTransaction ? "Simpan Perubahan" : "Tambah Transaksi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
