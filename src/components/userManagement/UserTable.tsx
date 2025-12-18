import { useState } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { KeyRound, Trash2, Copy, Loader2 } from 'lucide-react';
import { FranchiseUser } from '@/hooks/useUserManagement';
import { toast } from 'sonner';

interface UserTableProps {
  users: FranchiseUser[];
  isLoading: boolean;
  onDelete: (userId: string) => Promise<boolean>;
  onResetPassword: (userId: string) => Promise<string | null>;
}

export function UserTable({ users, isLoading, onDelete, onResetPassword }: UserTableProps) {
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteUserId) return;
    setProcessingId(deleteUserId);
    await onDelete(deleteUserId);
    setDeleteUserId(null);
    setProcessingId(null);
  };

  const handleResetPassword = async (userId: string) => {
    setProcessingId(userId);
    const link = await onResetPassword(userId);
    if (link) {
      setResetLink(link);
    }
    setProcessingId(null);
  };

  const copyToClipboard = () => {
    if (resetLink) {
      navigator.clipboard.writeText(resetLink);
      toast.success('Link berhasil disalin');
    }
  };

  if (users.length === 0 && !isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Belum ada user franchise terdaftar
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Terdaftar</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Franchise</Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.created_at), 'dd MMM yyyy', { locale: id })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResetPassword(user.id)}
                        disabled={processingId === user.id}
                      >
                        {processingId === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <KeyRound className="h-4 w-4" />
                        )}
                        <span className="sr-only">Reset Password</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteUserId(user.id)}
                        disabled={processingId === user.id}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Hapus</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus User?</AlertDialogTitle>
            <AlertDialogDescription>
              User akan dihapus secara permanen dan tidak dapat dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Link Dialog */}
      <Dialog open={!!resetLink} onOpenChange={() => setResetLink(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Link Reset Password</DialogTitle>
            <DialogDescription>
              Salin link di bawah ini dan kirimkan ke user untuk mereset password mereka.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={resetLink || ''}
                readOnly
                className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted truncate"
              />
              <Button onClick={copyToClipboard} variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Link ini hanya berlaku sekali dan akan kedaluwarsa.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
