export type PaymentStatus = 'pending' | 'done';

export interface FranchiseFinance {
  id: string;
  tanggalOrder: Date;
  detailOrder: string;
  nomorOrder: string;
  franchiseId: string | null;
  franchiseName?: string;
  totalPaymentCust: number;
  feeMentor: number; // calculated: totalPaymentCust * 0.43
  keuntunganBersih: number; // calculated: totalPaymentCust * 0.57
  komisiMitra: number; // calculated: keuntunganBersih * 0.40
  tanggalPembayaranFranchisee: Date | null;
  statusPembayaran: PaymentStatus;
  catatan: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FranchiseFinanceFormData {
  tanggalOrder: Date;
  detailOrder: string;
  nomorOrder: string;
  franchiseId: string;
  totalPaymentCust: number;
  tanggalPembayaranFranchisee: Date | null;
  statusPembayaran: PaymentStatus;
  catatan: string;
}
