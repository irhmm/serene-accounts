import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Worker, WorkerRole, WorkerStatus } from '@/types/worker';

export const useWorkers = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching workers:', error);
    } else {
      const mappedWorkers: Worker[] = (data || []).map((item) => ({
        id: item.id,
        nama: item.nama,
        nomorWa: item.nomor_wa,
        rekening: item.rekening,
        role: item.role as WorkerRole,
        status: item.status as WorkerStatus,
        createdAt: new Date(item.created_at),
      }));
      setWorkers(mappedWorkers);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const addWorker = async (worker: Omit<Worker, 'id' | 'createdAt'>) => {
    const { error } = await supabase.from('workers').insert({
      nama: worker.nama,
      nomor_wa: worker.nomorWa,
      rekening: worker.rekening,
      role: worker.role,
      status: worker.status,
    });

    if (error) {
      console.error('Error adding worker:', error);
      throw error;
    }
    await fetchWorkers();
  };

  const updateWorker = async (id: string, worker: Omit<Worker, 'id' | 'createdAt'>) => {
    const { error } = await supabase
      .from('workers')
      .update({
        nama: worker.nama,
        nomor_wa: worker.nomorWa,
        rekening: worker.rekening,
        role: worker.role,
        status: worker.status,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating worker:', error);
      throw error;
    }
    await fetchWorkers();
  };

  const deleteWorker = async (id: string) => {
    const { error } = await supabase.from('workers').delete().eq('id', id);

    if (error) {
      console.error('Error deleting worker:', error);
      throw error;
    }
    await fetchWorkers();
  };

  return {
    workers,
    loading,
    fetchWorkers,
    addWorker,
    updateWorker,
    deleteWorker,
  };
};
