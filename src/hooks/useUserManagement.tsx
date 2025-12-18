import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FranchiseUser {
  id: string;
  email: string;
  created_at: string;
}

export function useUserManagement() {
  const [users, setUsers] = useState<FranchiseUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Anda harus login terlebih dahulu');
        return;
      }

      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: { action: 'list' },
      });

      if (error) {
        console.error('Fetch users error:', error);
        toast.error('Gagal memuat daftar user');
        return;
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error('Fetch users error:', error);
      toast.error('Gagal memuat daftar user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Anda harus login terlebih dahulu');
        return false;
      }

      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: { action: 'create', email, password },
      });

      if (error) {
        console.error('Create user error:', error);
        toast.error(error.message || 'Gagal membuat user');
        return false;
      }

      if (data.error) {
        toast.error(data.error);
        return false;
      }

      toast.success('User franchise berhasil dibuat');
      await fetchUsers();
      return true;
    } catch (error: any) {
      console.error('Create user error:', error);
      toast.error(error.message || 'Gagal membuat user');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchUsers]);

  const deleteUser = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Anda harus login terlebih dahulu');
        return false;
      }

      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: { action: 'delete', userId },
      });

      if (error) {
        console.error('Delete user error:', error);
        toast.error(error.message || 'Gagal menghapus user');
        return false;
      }

      if (data.error) {
        toast.error(data.error);
        return false;
      }

      toast.success('User berhasil dihapus');
      await fetchUsers();
      return true;
    } catch (error: any) {
      console.error('Delete user error:', error);
      toast.error(error.message || 'Gagal menghapus user');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchUsers]);

  const resetPassword = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Anda harus login terlebih dahulu');
        return null;
      }

      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: { action: 'reset-password', userId },
      });

      if (error) {
        console.error('Reset password error:', error);
        toast.error(error.message || 'Gagal mereset password');
        return null;
      }

      if (data.error) {
        toast.error(data.error);
        return null;
      }

      toast.success('Link reset password berhasil dibuat');
      return data.recoveryLink;
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Gagal mereset password');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    users,
    isLoading,
    fetchUsers,
    createUser,
    deleteUser,
    resetPassword,
  };
}
