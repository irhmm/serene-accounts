import { Pencil, Trash2 } from 'lucide-react';
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
import {
  Worker,
  workerRoleLabels,
  workerRoleColors,
  workerStatusLabels,
  workerStatusColors,
} from '@/types/worker';

interface WorkerTableProps {
  workers: Worker[];
  isAdmin: boolean;
  onEdit: (worker: Worker) => void;
  onDelete: (id: string) => void;
}

export const WorkerTable = ({ workers, isAdmin, onEdit, onDelete }: WorkerTableProps) => {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">No</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Nomor WA</TableHead>
            <TableHead>Rekening</TableHead>
            <TableHead className="text-center">Role</TableHead>
            <TableHead className="text-center">Status</TableHead>
            {isAdmin && <TableHead className="text-center">Aksi</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {workers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 7 : 6} className="text-center py-8 text-muted-foreground">
                Tidak ada data worker
              </TableCell>
            </TableRow>
          ) : (
            workers.map((worker, index) => (
              <TableRow key={worker.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="font-medium">{worker.nama}</TableCell>
                <TableCell>{worker.nomorWa}</TableCell>
                <TableCell>{worker.rekening || '-'}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={workerRoleColors[worker.role]}>
                    {workerRoleLabels[worker.role]}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={workerStatusColors[worker.status]}>
                    {workerStatusLabels[worker.status]}
                  </Badge>
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(worker)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(worker.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
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
    </div>
  );
};
