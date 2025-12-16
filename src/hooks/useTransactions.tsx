import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Transaction, TransactionType, FreelanceCategory, ExpenseStatus } from '@/types/transaction';
import { toast } from 'sonner';

interface DbTransaction {
  id: string;
  tanggal: string;
  detail: string;
  type: string;
  jumlah_masuk_dp: number;
  jumlah_keluar_dp: number;
  saldo_akhir: number;
  keterangan_freelance: string;
  status_pengeluaran: string;
  catatan: string | null;
  created_at: string;
  updated_at: string;
}

const mapDbToTransaction = (db: DbTransaction): Transaction => ({
  id: db.id,
  date: new Date(db.tanggal),
  detail: db.detail,
  type: db.type as TransactionType,
  amountIn: db.jumlah_masuk_dp,
  amountOut: db.jumlah_keluar_dp,
  balance: db.saldo_akhir,
  freelanceCategory: db.keterangan_freelance as FreelanceCategory,
  expenseStatus: db.status_pengeluaran as ExpenseStatus,
  notes: db.catatan || '',
});

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('tanggal', { ascending: true });

    if (error) {
      toast.error('Gagal memuat data transaksi');
      console.error(error);
    } else if (data) {
      setTransactions(data.map(mapDbToTransaction));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'balance'>) => {
    // Calculate per-row balance: amountIn - amountOut
    const rowBalance = transaction.amountIn - transaction.amountOut;

    const { error } = await supabase.from('transactions').insert({
      tanggal: transaction.date.toISOString().split('T')[0],
      detail: transaction.detail,
      type: transaction.type,
      jumlah_masuk_dp: transaction.amountIn,
      jumlah_keluar_dp: transaction.amountOut,
      saldo_akhir: rowBalance,
      keterangan_freelance: transaction.freelanceCategory,
      status_pengeluaran: transaction.expenseStatus,
      catatan: transaction.notes || null,
    });

    if (error) {
      toast.error('Gagal menambah transaksi');
      console.error(error);
      return false;
    }

    toast.success('Transaksi berhasil ditambahkan');
    await fetchTransactions();
    return true;
  };

  const updateTransaction = async (id: string, transaction: Omit<Transaction, 'id' | 'balance'>) => {
    const { error } = await supabase.from('transactions').update({
      tanggal: transaction.date.toISOString().split('T')[0],
      detail: transaction.detail,
      type: transaction.type,
      jumlah_masuk_dp: transaction.amountIn,
      jumlah_keluar_dp: transaction.amountOut,
      keterangan_freelance: transaction.freelanceCategory,
      status_pengeluaran: transaction.expenseStatus,
      catatan: transaction.notes || null,
    }).eq('id', id);

    if (error) {
      toast.error('Gagal memperbarui transaksi');
      console.error(error);
      return false;
    }

    toast.success('Transaksi berhasil diperbarui');
    await fetchTransactions();
    return true;
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);

    if (error) {
      toast.error('Gagal menghapus transaksi');
      console.error(error);
      return false;
    }

    toast.success('Transaksi berhasil dihapus');
    await fetchTransactions();
    return true;
  };

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  };
}
