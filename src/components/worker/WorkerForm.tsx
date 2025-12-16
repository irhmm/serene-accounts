import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Worker,
  WorkerRole,
  WorkerStatus,
  workerRoleLabels,
  workerRoleColors,
  workerStatusLabels,
  workerStatusColors,
} from '@/types/worker';

interface WorkerFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (worker: Omit<Worker, 'id' | 'createdAt'>) => void;
  initialData?: Worker | null;
}

export const WorkerForm = ({ open, onClose, onSubmit, initialData }: WorkerFormProps) => {
  const [nama, setNama] = useState('');
  const [nomorWa, setNomorWa] = useState('');
  const [rekening, setRekening] = useState('');
  const [role, setRole] = useState<WorkerRole>('freelancer');
  const [status, setStatus] = useState<WorkerStatus>('active');

  useEffect(() => {
    if (initialData) {
      setNama(initialData.nama);
      setNomorWa(initialData.nomorWa);
      setRekening(initialData.rekening || '');
      setRole(initialData.role);
      setStatus(initialData.status);
    } else {
      setNama('');
      setNomorWa('');
      setRekening('');
      setRole('freelancer');
      setStatus('active');
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nama,
      nomorWa,
      rekening: rekening || null,
      role,
      status,
    });
  };

  const roleOptions: WorkerRole[] = ['admin', 'mitra', 'freelancer', 'affiliate'];
  const statusOptions: WorkerStatus[] = ['active', 'inactive'];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Worker' : 'Tambah Worker'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama</Label>
            <Input
              id="nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama worker"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomorWa">Nomor WA</Label>
            <Input
              id="nomorWa"
              value={nomorWa}
              onChange={(e) => setNomorWa(e.target.value)}
              placeholder="08xxxxxxxxxx"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rekening">Rekening</Label>
            <Input
              id="rekening"
              value={rekening}
              onChange={(e) => setRekening(e.target.value)}
              placeholder="Nomor rekening (opsional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value as WorkerRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((r) => (
                  <SelectItem key={r} value={r}>
                    <Badge variant="outline" className={workerRoleColors[r]}>
                      {workerRoleLabels[r]}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as WorkerStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    <Badge variant="outline" className={workerStatusColors[s]}>
                      {workerStatusLabels[s]}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              {initialData ? 'Simpan' : 'Tambah'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
