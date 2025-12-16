export type TransactionType = 
  | 'pemasukan_dp' 
  | 'pemasukan_pelunasan' 
  | 'pengeluaran_fee_mitra' 
  | 'pengeluaran_fee_admin' 
  | 'pengeluaran_iklan' 
  | 'pengeluaran_event' 
  | 'refund' 
  | 'payment_paket_bimbingan' 
  | 'pengeluaran_operasional' 
  | 'pemasukan_cicilan' 
  | 'lunas_didepan' 
  | 'fee_affiliate' 
  | 'pemasukan' 
  | 'pengeluaran_fee_franchise';

export type FreelanceCategory = 
  | 'design' 
  | 'development' 
  | 'writing' 
  | 'consulting' 
  | 'marketing' 
  | 'other';

export type ExpenseStatus = 
  | 'pending' 
  | 'completed' 
  | 'cancelled' 
  | 'refunded';

export interface Transaction {
  id: string;
  date: Date;
  detail: string;
  type: TransactionType;
  amountIn: number;
  amountOut: number;
  balance: number;
  freelanceCategory: FreelanceCategory;
  expenseStatus: ExpenseStatus;
  notes: string;
}

export const transactionTypeLabels: Record<TransactionType, string> = {
  pemasukan_dp: 'Pemasukan (DP)',
  pemasukan_pelunasan: 'Pemasukan (Pelunasan)',
  pengeluaran_fee_mitra: 'Pengeluaran (Fee Mitra)',
  pengeluaran_fee_admin: 'Pengeluaran (Fee Admin)',
  pengeluaran_iklan: 'Pengeluaran (Iklan)',
  pengeluaran_event: 'Pengeluaran (Event)',
  refund: 'Refund',
  payment_paket_bimbingan: 'Payment Paket Bimbingan',
  pengeluaran_operasional: 'Pengeluaran Operasional',
  pemasukan_cicilan: 'Pemasukan (Cicilan)',
  lunas_didepan: 'Lunas Didepan',
  fee_affiliate: 'Fee affiliate',
  pemasukan: 'Pemasukan',
  pengeluaran_fee_franchise: 'Pengeluaran (Fee franchise)',
};

export const transactionTypeColors: Record<TransactionType, string> = {
  pemasukan_dp: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  pemasukan_pelunasan: 'bg-green-100 text-green-700 border-green-300',
  pengeluaran_fee_mitra: 'bg-red-100 text-red-700 border-red-300',
  pengeluaran_fee_admin: 'bg-rose-100 text-rose-700 border-rose-300',
  pengeluaran_iklan: 'bg-pink-100 text-pink-700 border-pink-300',
  pengeluaran_event: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',
  refund: 'bg-purple-100 text-purple-700 border-purple-300',
  payment_paket_bimbingan: 'bg-blue-100 text-blue-700 border-blue-300',
  pengeluaran_operasional: 'bg-orange-100 text-orange-700 border-orange-300',
  pemasukan_cicilan: 'bg-teal-100 text-teal-700 border-teal-300',
  lunas_didepan: 'bg-slate-100 text-slate-700 border-slate-300',
  fee_affiliate: 'bg-amber-100 text-amber-700 border-amber-300',
  pemasukan: 'bg-lime-100 text-lime-700 border-lime-300',
  pengeluaran_fee_franchise: 'bg-cyan-100 text-cyan-700 border-cyan-300',
};

export const freelanceCategoryLabels: Record<FreelanceCategory, string> = {
  design: 'Design',
  development: 'Development',
  writing: 'Writing',
  consulting: 'Consulting',
  marketing: 'Marketing',
  other: 'Lainnya',
};

export const expenseStatusLabels: Record<ExpenseStatus, string> = {
  pending: 'Pending',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
  refunded: 'Refund',
};
