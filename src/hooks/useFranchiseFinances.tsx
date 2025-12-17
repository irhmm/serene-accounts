import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FranchiseFinance, FranchiseFinanceFormData } from '@/types/franchiseFinance';
import { toast } from 'sonner';

export function useFranchiseFinances() {
  const [finances, setFinances] = useState<FranchiseFinance[]>([]);
  const [loading, setLoading] = useState(true);

  const calculateFields = (totalPaymentCust: number) => {
    const feeMentor = Math.round(totalPaymentCust * 0.43);
    const keuntunganBersih = Math.round(totalPaymentCust * 0.57);
    const komisiMitra = Math.round(keuntunganBersih * 0.40);
    return { feeMentor, keuntunganBersih, komisiMitra };
  };

  const fetchFinances = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('franchise_finances')
        .select(`
          *,
          franchises:franchise_id (nama_franchise)
        `)
        .order('tanggal_order', { ascending: false });

      if (error) throw error;

      const mappedData: FranchiseFinance[] = (data || []).map((item: any) => {
        const calculated = calculateFields(item.total_payment_cust);
        return {
          id: item.id,
          tanggalOrder: new Date(item.tanggal_order),
          detailOrder: item.detail_order,
          nomorOrder: item.nomor_order,
          franchiseId: item.franchise_id,
          franchiseName: item.franchises?.nama_franchise || '-',
          totalPaymentCust: item.total_payment_cust,
          feeMentor: calculated.feeMentor,
          keuntunganBersih: calculated.keuntunganBersih,
          komisiMitra: calculated.komisiMitra,
          tanggalPembayaranFranchisee: item.tanggal_pembayaran_franchisee 
            ? new Date(item.tanggal_pembayaran_franchisee) 
            : null,
          statusPembayaran: item.status_pembayaran,
          catatan: item.catatan,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
        };
      });

      setFinances(mappedData);
    } catch (error: any) {
      console.error('Error fetching franchise finances:', error);
      toast.error('Gagal memuat data keuangan franchise');
    } finally {
      setLoading(false);
    }
  };

  const addFinance = async (formData: FranchiseFinanceFormData) => {
    try {
      const { error } = await supabase.from('franchise_finances').insert({
        tanggal_order: formData.tanggalOrder.toISOString().split('T')[0],
        detail_order: formData.detailOrder,
        nomor_order: formData.nomorOrder,
        franchise_id: formData.franchiseId || null,
        total_payment_cust: formData.totalPaymentCust,
        tanggal_pembayaran_franchisee: formData.tanggalPembayaranFranchisee 
          ? formData.tanggalPembayaranFranchisee.toISOString().split('T')[0] 
          : null,
        status_pembayaran: formData.statusPembayaran,
        catatan: formData.catatan || null,
      });

      if (error) throw error;

      toast.success('Data keuangan berhasil ditambahkan');
      await fetchFinances();
      return true;
    } catch (error: any) {
      console.error('Error adding franchise finance:', error);
      toast.error('Gagal menambahkan data keuangan');
      return false;
    }
  };

  const updateFinance = async (id: string, formData: FranchiseFinanceFormData) => {
    try {
      const { error } = await supabase
        .from('franchise_finances')
        .update({
          tanggal_order: formData.tanggalOrder.toISOString().split('T')[0],
          detail_order: formData.detailOrder,
          nomor_order: formData.nomorOrder,
          franchise_id: formData.franchiseId || null,
          total_payment_cust: formData.totalPaymentCust,
          tanggal_pembayaran_franchisee: formData.tanggalPembayaranFranchisee 
            ? formData.tanggalPembayaranFranchisee.toISOString().split('T')[0] 
            : null,
          status_pembayaran: formData.statusPembayaran,
          catatan: formData.catatan || null,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Data keuangan berhasil diperbarui');
      await fetchFinances();
      return true;
    } catch (error: any) {
      console.error('Error updating franchise finance:', error);
      toast.error('Gagal memperbarui data keuangan');
      return false;
    }
  };

  const deleteFinance = async (id: string) => {
    try {
      const { error } = await supabase
        .from('franchise_finances')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Data keuangan berhasil dihapus');
      await fetchFinances();
      return true;
    } catch (error: any) {
      console.error('Error deleting franchise finance:', error);
      toast.error('Gagal menghapus data keuangan');
      return false;
    }
  };

  useEffect(() => {
    fetchFinances();
  }, []);

  return {
    finances,
    loading,
    fetchFinances,
    addFinance,
    updateFinance,
    deleteFinance,
    calculateFields,
  };
}
