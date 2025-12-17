import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FranchiseOrder, FormCompletenessStatus, WorkStatus } from '@/types/franchiseOrder';
import { toast } from 'sonner';

export const useFranchiseOrders = () => {
  const [orders, setOrders] = useState<FranchiseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchOrders = useCallback(async (page: number = 1, perPage: number = 10) => {
    setLoading(true);
    try {
      // Get total count
      const { count } = await supabase
        .from('franchise_orders')
        .select('*', { count: 'exact', head: true });

      setTotalCount(count || 0);

      // Get paginated data
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      const { data, error } = await supabase
        .from('franchise_orders')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const mappedOrders: FranchiseOrder[] = (data || []).map((order: any) => ({
        id: order.id,
        nomorOrder: order.nomor_order,
        detailOrder: order.detail_order,
        tanggalMasuk: new Date(order.tanggal_masuk),
        catatan: order.catatan,
        deadline: order.deadline ? new Date(order.deadline) : null,
        pjFranchisee: order.pj_franchisee,
        totalPembayaran: order.total_pembayaran,
        statusKelengkapan: order.status_kelengkapan as FormCompletenessStatus,
        catatanHandover: order.catatan_handover,
        pjMentor: order.pj_mentor,
        tanggalSelesai: order.tanggal_selesai ? new Date(order.tanggal_selesai) : null,
        statusPengerjaan: order.status_pengerjaan as WorkStatus,
        createdAt: new Date(order.created_at),
        updatedAt: new Date(order.updated_at),
      }));

      setOrders(mappedOrders);
    } catch (error: any) {
      console.error('Error fetching franchise orders:', error);
      toast.error('Gagal memuat data order franchise');
    } finally {
      setLoading(false);
    }
  }, []);

  const addOrder = async (order: Omit<FranchiseOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { error } = await supabase.from('franchise_orders').insert({
        nomor_order: order.nomorOrder,
        detail_order: order.detailOrder,
        tanggal_masuk: order.tanggalMasuk.toISOString().split('T')[0],
        catatan: order.catatan,
        deadline: order.deadline ? order.deadline.toISOString().split('T')[0] : null,
        pj_franchisee: order.pjFranchisee,
        total_pembayaran: order.totalPembayaran,
        status_kelengkapan: order.statusKelengkapan,
        catatan_handover: order.catatanHandover,
        pj_mentor: order.pjMentor,
        tanggal_selesai: order.tanggalSelesai ? order.tanggalSelesai.toISOString().split('T')[0] : null,
        status_pengerjaan: order.statusPengerjaan,
      });

      if (error) throw error;
      toast.success('Order franchise berhasil ditambahkan');
      return true;
    } catch (error: any) {
      console.error('Error adding franchise order:', error);
      toast.error('Gagal menambahkan order franchise');
      return false;
    }
  };

  const updateOrder = async (id: string, order: Omit<FranchiseOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { error } = await supabase
        .from('franchise_orders')
        .update({
          nomor_order: order.nomorOrder,
          detail_order: order.detailOrder,
          tanggal_masuk: order.tanggalMasuk.toISOString().split('T')[0],
          catatan: order.catatan,
          deadline: order.deadline ? order.deadline.toISOString().split('T')[0] : null,
          pj_franchisee: order.pjFranchisee,
          total_pembayaran: order.totalPembayaran,
          status_kelengkapan: order.statusKelengkapan,
          catatan_handover: order.catatanHandover,
          pj_mentor: order.pjMentor,
          tanggal_selesai: order.tanggalSelesai ? order.tanggalSelesai.toISOString().split('T')[0] : null,
          status_pengerjaan: order.statusPengerjaan,
        })
        .eq('id', id);

      if (error) throw error;
      toast.success('Order franchise berhasil diperbarui');
      return true;
    } catch (error: any) {
      console.error('Error updating franchise order:', error);
      toast.error('Gagal memperbarui order franchise');
      return false;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const { error } = await supabase.from('franchise_orders').delete().eq('id', id);

      if (error) throw error;
      toast.success('Order franchise berhasil dihapus');
      return true;
    } catch (error: any) {
      console.error('Error deleting franchise order:', error);
      toast.error('Gagal menghapus order franchise');
      return false;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    totalCount,
    fetchOrders,
    addOrder,
    updateOrder,
    deleteOrder,
  };
};
