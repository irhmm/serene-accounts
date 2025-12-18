import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UserTable } from '@/components/userManagement/UserTable';
import { UserForm } from '@/components/userManagement/UserForm';
import { useAuth } from '@/hooks/useAuth';
import { useUserManagement } from '@/hooks/useUserManagement';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function KelolaUser() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { users, isLoading, fetchUsers, createUser, deleteUser, resetPassword } = useUserManagement();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }
    if (!loading && user && !isAdmin) {
      toast.error('Anda tidak memiliki akses ke halaman ini');
      navigate('/orders');
      return;
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchUsers();
    }
  }, [user, isAdmin, fetchUsers]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kelola User Franchise</h1>
            <p className="text-muted-foreground">
              Kelola akun user franchise yang dapat mengakses sistem
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Tambah User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Daftar User Franchise</CardTitle>
            </div>
            <CardDescription>
              User franchise dapat melihat Jadwal Order Mitra dan Keuangan Franchise dalam mode read-only
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserTable
              users={users}
              isLoading={isLoading}
              onDelete={deleteUser}
              onResetPassword={resetPassword}
            />
          </CardContent>
        </Card>

        <UserForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={createUser}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
}
