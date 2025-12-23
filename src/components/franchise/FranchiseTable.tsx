import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Franchise,
  franchiseStatusLabels,
  franchiseStatusColors,
} from "@/types/franchise";
import { DateSortToggle, SortOrder } from "@/components/ui/date-sort-toggle";

interface FranchiseTableProps {
  franchises: Franchise[];
  onEdit: (franchise: Franchise) => void;
  onDelete: (id: string) => void;
  sortOrder?: SortOrder;
  onSortChange?: (order: SortOrder) => void;
}

export const FranchiseTable = ({
  franchises,
  onEdit,
  onDelete,
  sortOrder = 'desc',
  onSortChange,
}: FranchiseTableProps) => {
  const formatDate = (date: Date) => {
    return format(date, "dd MMM yyyy", { locale: id });
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">No</TableHead>
            <TableHead>Nama Franchise</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>
              {onSortChange ? (
                <DateSortToggle
                  label="Jangka Waktu Kontrak"
                  sortOrder={sortOrder}
                  onSortChange={onSortChange}
                />
              ) : (
                <span>Jangka Waktu Kontrak</span>
              )}
            </TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead>Rekening</TableHead>
            <TableHead>Catatan</TableHead>
            <TableHead className="w-24">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {franchises.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Tidak ada data franchise
              </TableCell>
            </TableRow>
          ) : (
            franchises.map((franchise, index) => (
              <TableRow key={franchise.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{franchise.namaFranchise}</TableCell>
                <TableCell>{franchise.alamat}</TableCell>
                <TableCell>
                  {formatDate(franchise.kontrakMulai)} - {formatDate(franchise.kontrakBerakhir)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={franchiseStatusColors[franchise.keterangan]}
                  >
                    {franchiseStatusLabels[franchise.keterangan]}
                  </Badge>
                </TableCell>
                <TableCell>{franchise.rekening || "-"}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {franchise.catatan || "-"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(franchise)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(franchise.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
