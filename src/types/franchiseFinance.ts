export type PaymentStatus = 'pending' | 'done' | 'non';
export type FormCompletenessStatus = 'lengkap' | 'perlu_adjustment';
export type WorkStatus = 'not_started' | 'on_progress' | 'done';

export interface FranchiseFinance {
  id: string;
  tanggalClosingOrder: Date;
  detailOrder: string;
  nomorOrder: string;
  franchiseId: string | null;
  franchiseName?: string;
  pjMentor: string | null;
  pjMentorName?: string;
  statusKelengkapan: FormCompletenessStatus;
  totalPaymentCust: number;
  feeMentor: number;
  keuntunganBersih: number;
  komisiMitra: number;
  tanggalPembayaranFranchisee: Date | null;
  statusPembayaran: PaymentStatus;
  statusPengerjaan: WorkStatus;
  catatanHandover: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FranchiseFinanceFormData {
  tanggalClosingOrder: Date;
  detailOrder: string;
  nomorOrder: string;
  franchiseId: string;
  pjMentor: string;
  statusKelengkapan: FormCompletenessStatus;
  totalPaymentCust: number;
  tanggalPembayaranFranchisee: Date | null;
  statusPembayaran: PaymentStatus;
  statusPengerjaan: WorkStatus;
  catatanHandover: string;
}

export const formCompletenessLabels: Record<FormCompletenessStatus, string> = {
  lengkap: 'Lengkap',
  perlu_adjustment: 'Perlu Adjustment',
};

export const formCompletenessColors: Record<FormCompletenessStatus, string> = {
  lengkap: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  perlu_adjustment: 'bg-amber-100 text-amber-700 border-amber-200',
};

export const workStatusLabels: Record<WorkStatus, string> = {
  not_started: 'Not Started',
  on_progress: 'On Progress',
  done: 'Done',
};

export const workStatusColors: Record<WorkStatus, string> = {
  not_started: 'bg-red-100 text-red-700 border-red-200',
  on_progress: 'bg-amber-100 text-amber-700 border-amber-200',
  done: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: 'Pending',
  done: 'Done',
  non: 'Non',
};

export const paymentStatusColors: Record<PaymentStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  done: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  non: 'bg-gray-100 text-gray-700 border-gray-200',
};
