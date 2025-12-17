import { useEffect, useState, forwardRef } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Franchise, FranchiseStatus, franchiseStatusLabels } from "@/types/franchise";

interface FranchiseFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (franchise: Omit<Franchise, "id" | "createdAt">) => void;
  editingFranchise?: Franchise | null;
}

export const FranchiseForm = forwardRef<HTMLDivElement, FranchiseFormProps>(({
  open,
  onClose,
  onSubmit,
  editingFranchise,
}, ref) => {
  const [namaFranchise, setNamaFranchise] = useState("");
  const [alamat, setAlamat] = useState("");
  const [kontrakMulai, setKontrakMulai] = useState<Date>(new Date());
  const [kontrakBerakhir, setKontrakBerakhir] = useState<Date>(new Date());
  const [keterangan, setKeterangan] = useState<FranchiseStatus>("non_verified");
  const [rekening, setRekening] = useState("");
  const [catatan, setCatatan] = useState("");

  useEffect(() => {
    if (editingFranchise) {
      setNamaFranchise(editingFranchise.namaFranchise);
      setAlamat(editingFranchise.alamat);
      setKontrakMulai(editingFranchise.kontrakMulai);
      setKontrakBerakhir(editingFranchise.kontrakBerakhir);
      setKeterangan(editingFranchise.keterangan);
      setRekening(editingFranchise.rekening || "");
      setCatatan(editingFranchise.catatan || "");
    } else {
      resetForm();
    }
  }, [editingFranchise, open]);

  const resetForm = () => {
    setNamaFranchise("");
    setAlamat("");
    setKontrakMulai(new Date());
    setKontrakBerakhir(new Date());
    setKeterangan("non_verified");
    setRekening("");
    setCatatan("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      namaFranchise,
      alamat,
      kontrakMulai,
      kontrakBerakhir,
      keterangan,
      rekening: rekening || null,
      catatan: catatan || null,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingFranchise ? "Edit Franchise" : "Tambah Franchise"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="namaFranchise">Nama Franchise *</Label>
            <Input
              id="namaFranchise"
              value={namaFranchise}
              onChange={(e) => setNamaFranchise(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat *</Label>
            <Textarea
              id="alamat"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kontrak Mulai *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !kontrakMulai && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {kontrakMulai ? format(kontrakMulai, "dd/MM/yyyy") : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={kontrakMulai}
                    onSelect={(date) => date && setKontrakMulai(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Kontrak Berakhir *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !kontrakBerakhir && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {kontrakBerakhir ? format(kontrakBerakhir, "dd/MM/yyyy") : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={kontrakBerakhir}
                    onSelect={(date) => date && setKontrakBerakhir(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keterangan">Keterangan *</Label>
            <Select value={keterangan} onValueChange={(v) => setKeterangan(v as FranchiseStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(franchiseStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rekening">Rekening</Label>
            <Input
              id="rekening"
              value={rekening}
              onChange={(e) => setRekening(e.target.value)}
              placeholder="Nomor rekening"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="catatan">Catatan</Label>
            <Textarea
              id="catatan"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan tambahan"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              {editingFranchise ? "Simpan" : "Tambah"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});

FranchiseForm.displayName = 'FranchiseForm';
