export type TransactionType = 'income' | 'expense' | 'transfer';

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
  income: 'Pemasukan',
  expense: 'Pengeluaran',
  transfer: 'Transfer',
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
