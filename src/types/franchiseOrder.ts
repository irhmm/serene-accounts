export type FormCompletenessStatus = 'lengkap' | 'perlu_detail';
export type WorkStatus = 'not_started' | 'on_progress' | 'done';

export interface FranchiseOrder {
  id: string;
  nomorOrder: string;
  detailOrder: string;
  tanggalMasuk: Date;
  catatan: string | null;
  deadline: Date | null;
  pjFranchisee: string;
  totalPembayaran: number;
  statusKelengkapan: FormCompletenessStatus;
  catatanHandover: string | null;
  pjMentor: string;
  tanggalSelesai: Date | null;
  statusPengerjaan: WorkStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const formCompletenessLabels: Record<FormCompletenessStatus, string> = {
  lengkap: 'Lengkap',
  perlu_detail: 'Perlu Detail',
};

export const formCompletenessColors: Record<FormCompletenessStatus, string> = {
  lengkap: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  perlu_detail: 'bg-amber-100 text-amber-700 border-amber-200',
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
