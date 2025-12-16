import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MitraOrder, OrderType, PaymentStatus, SettlementStatus, WorkStatus } from '@/types/mitraOrder';
import { toast } from 'sonner';

export const useMitraOrders = () => {
  const [orders, setOrders] = useState<MitraOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchOrders = useCallback(async (page: number = 1, perPage: number = 10) => {
    setLoading(true);
    try {
      // Get total count
      const { count } = await supabase
        .from('mitra_orders')
        .select('*', { count: 'exact', head: true });

      setTotalCount(count || 0);

      // Get paginated data
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      const { data, error } = await supabase
        .from('mitra_orders')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const mappedOrders: MitraOrder[] = (data || []).map((order) => ({
        id: order.id,
        nomorOrder: order.nomor_order,
        detailOrder: order.detail_order,
        typeOrder: order.type_order as OrderType,
        namaPjFreelance: order.nama_pj_freelance,
        catatan: order.catatan,
        tanggalStart: new Date(order.tanggal_start),
        statusPembayaran: order.status_pembayaran as PaymentStatus,
        totalDp: order.total_dp,
        kekurangan: order.kekurangan,
        totalPembayaran: order.total_pembayaran,
        feeFreelance: order.fee_freelance,
        tanggalEnd: order.tanggal_end ? new Date(order.tanggal_end) : null,
        statusPengerjaan: (order as any).status_pengerjaan as WorkStatus || 'not_started',
        statusPelunasan: order.status_pelunasan as SettlementStatus,
        catatanAdmin: order.catatan_admin,
        createdAt: new Date(order.created_at!),
        updatedAt: new Date(order.updated_at!),
      }));

      setOrders(mappedOrders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error('Gagal memuat data order');
    } finally {
      setLoading(false);
    }
  }, []);

  const addOrder = async (order: Omit<MitraOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { error } = await supabase.from('mitra_orders').insert({
        nomor_order: order.nomorOrder,
        detail_order: order.detailOrder,
        type_order: order.typeOrder,
        nama_pj_freelance: order.namaPjFreelance,
        catatan: order.catatan,
        tanggal_start: order.tanggalStart.toISOString().split('T')[0],
        status_pembayaran: order.statusPembayaran,
        total_dp: order.totalDp,
        kekurangan: order.kekurangan,
        total_pembayaran: order.totalPembayaran,
        fee_freelance: order.feeFreelance,
        tanggal_end: order.tanggalEnd ? order.tanggalEnd.toISOString().split('T')[0] : null,
        status_pengerjaan: order.statusPengerjaan,
        status_pelunasan: order.statusPelunasan,
        catatan_admin: order.catatanAdmin,
      } as any);

      if (error) throw error;
      toast.success('Order berhasil ditambahkan');
      return true;
    } catch (error: any) {
      console.error('Error adding order:', error);
      toast.error('Gagal menambahkan order');
      return false;
    }
  };

  const updateOrder = async (id: string, order: Omit<MitraOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { error } = await supabase
        .from('mitra_orders')
        .update({
          nomor_order: order.nomorOrder,
          detail_order: order.detailOrder,
          type_order: order.typeOrder,
          nama_pj_freelance: order.namaPjFreelance,
          catatan: order.catatan,
          tanggal_start: order.tanggalStart.toISOString().split('T')[0],
          status_pembayaran: order.statusPembayaran,
          total_dp: order.totalDp,
          kekurangan: order.kekurangan,
          total_pembayaran: order.totalPembayaran,
          fee_freelance: order.feeFreelance,
          tanggal_end: order.tanggalEnd ? order.tanggalEnd.toISOString().split('T')[0] : null,
          status_pengerjaan: order.statusPengerjaan,
          status_pelunasan: order.statusPelunasan,
          catatan_admin: order.catatanAdmin,
        } as any)
        .eq('id', id);

      if (error) throw error;
      toast.success('Order berhasil diperbarui');
      return true;
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast.error('Gagal memperbarui order');
      return false;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const { error } = await supabase.from('mitra_orders').delete().eq('id', id);

      if (error) throw error;
      toast.success('Order berhasil dihapus');
      return true;
    } catch (error: any) {
      console.error('Error deleting order:', error);
      toast.error('Gagal menghapus order');
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
