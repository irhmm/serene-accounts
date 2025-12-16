-- Drop old CHECK constraints that are causing errors
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_type_check;
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_keterangan_freelance_check;

-- Add new constraint for type with all 14 transaction types
ALTER TABLE transactions ADD CONSTRAINT transactions_type_check 
CHECK (type IN (
  'pemasukan_dp', 
  'pemasukan_pelunasan', 
  'pengeluaran_fee_mitra', 
  'pengeluaran_fee_admin', 
  'pengeluaran_iklan', 
  'pengeluaran_event', 
  'refund', 
  'payment_paket_bimbingan', 
  'pengeluaran_operasional', 
  'pemasukan_cicilan', 
  'lunas_didepan', 
  'fee_affiliate', 
  'pemasukan', 
  'pengeluaran_fee_franchise'
));