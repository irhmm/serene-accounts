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
  pemasukan_dp: 'bg-green-100 text-green-700 border-green-300',
  pemasukan_pelunasan: 'bg-green-100 text-green-700 border-green-300',
  pengeluaran_fee_mitra: 'bg-red-100 text-red-700 border-red-300',
  pengeluaran_fee_admin: 'bg-red-100 text-red-700 border-red-300',
  pengeluaran_iklan: 'bg-red-100 text-red-700 border-red-300',
  pengeluaran_event: 'bg-red-100 text-red-700 border-red-300',
  refund: 'bg-purple-100 text-purple-700 border-purple-300',
  payment_paket_bimbingan: 'bg-blue-100 text-blue-700 border-blue-300',
  pengeluaran_operasional: 'bg-orange-100 text-orange-700 border-orange-300',
  pemasukan_cicilan: 'bg-green-100 text-green-700 border-green-300',
  lunas_didepan: 'bg-gray-100 text-gray-700 border-gray-300',
  fee_affiliate: 'bg-gray-100 text-gray-700 border-gray-300',
  pemasukan: 'bg-green-100 text-green-700 border-green-300',
  pengeluaran_fee_franchise: 'bg-red-100 text-red-700 border-red-300',
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
