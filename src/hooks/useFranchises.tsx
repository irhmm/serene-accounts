import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Franchise, FranchiseStatus } from '@/types/franchise';

export const useFranchises = () => {
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFranchises = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('franchises')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching franchises:', error);
      setFranchises([]);
    } else {
      setFranchises(
        (data || []).map((item) => ({
          id: item.id,
          namaFranchise: item.nama_franchise,
          alamat: item.alamat,
          kontrakMulai: new Date(item.kontrak_mulai),
          kontrakBerakhir: new Date(item.kontrak_berakhir),
          keterangan: item.keterangan as FranchiseStatus,
          rekening: item.rekening,
          catatan: item.catatan,
          createdAt: new Date(item.created_at || ''),
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFranchises();
  }, [fetchFranchises]);

  const addFranchise = async (franchise: Omit<Franchise, 'id' | 'createdAt'>) => {
    const { error } = await supabase.from('franchises').insert({
      nama_franchise: franchise.namaFranchise,
      alamat: franchise.alamat,
      kontrak_mulai: franchise.kontrakMulai.toISOString().split('T')[0],
      kontrak_berakhir: franchise.kontrakBerakhir.toISOString().split('T')[0],
      keterangan: franchise.keterangan,
      rekening: franchise.rekening,
      catatan: franchise.catatan,
    });

    if (error) {
      console.error('Error adding franchise:', error);
      throw error;
    }
    await fetchFranchises();
  };

  const updateFranchise = async (id: string, franchise: Omit<Franchise, 'id' | 'createdAt'>) => {
    const { error } = await supabase
      .from('franchises')
      .update({
        nama_franchise: franchise.namaFranchise,
        alamat: franchise.alamat,
        kontrak_mulai: franchise.kontrakMulai.toISOString().split('T')[0],
        kontrak_berakhir: franchise.kontrakBerakhir.toISOString().split('T')[0],
        keterangan: franchise.keterangan,
        rekening: franchise.rekening,
        catatan: franchise.catatan,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating franchise:', error);
      throw error;
    }
    await fetchFranchises();
  };

  const deleteFranchise = async (id: string) => {
    const { error } = await supabase.from('franchises').delete().eq('id', id);

    if (error) {
      console.error('Error deleting franchise:', error);
      throw error;
    }
    await fetchFranchises();
  };

  return {
    franchises,
    loading,
    fetchFranchises,
    addFranchise,
    updateFranchise,
    deleteFranchise,
  };
};
