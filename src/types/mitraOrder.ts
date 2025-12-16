export type OrderType = 'jasa_tugas' | 'jasa_bimbingan' | 'jasa_revisi' | 'lainnya';
export type PaymentStatus = 'belum_bayar' | 'dp' | 'lunas';
export type OrderStatus = 'pending' | 'proses' | 'selesai' | 'cancel';
export type SettlementStatus = 'belum_lunas' | 'lunas';

export interface MitraOrder {
  id: string;
  nomorOrder: string;
  detailOrder: string;
  typeOrder: OrderType;
  namaPjFreelance: string;
  catatan: string | null;
  tanggalStart: Date;
  statusPembayaran: PaymentStatus;
  totalDp: number;
  kekurangan: number;
  totalPembayaran: number;
  feeFreelance: number;
  tanggalEnd: Date | null;
  status: OrderStatus;
  statusPelunasan: SettlementStatus;
  catatanAdmin: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const orderTypeLabels: Record<OrderType, string> = {
  jasa_tugas: 'Jasa Tugas',
  jasa_bimbingan: 'Jasa Bimbingan',
  jasa_revisi: 'Jasa Revisi',
  lainnya: 'Lainnya',
};

export const orderTypeColors: Record<OrderType, string> = {
  jasa_tugas: 'bg-blue-100 text-blue-700 border-blue-300',
  jasa_bimbingan: 'bg-purple-100 text-purple-700 border-purple-300',
  jasa_revisi: 'bg-orange-100 text-orange-700 border-orange-300',
  lainnya: 'bg-gray-100 text-gray-700 border-gray-300',
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  belum_bayar: 'Belum Bayar',
  dp: 'DP',
  lunas: 'Lunas',
};

export const paymentStatusColors: Record<PaymentStatus, string> = {
  belum_bayar: 'bg-red-100 text-red-700 border-red-300',
  dp: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  lunas: 'bg-green-100 text-green-700 border-green-300',
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: 'Pending',
  proses: 'Proses',
  selesai: 'Selesai',
  cancel: 'Cancel',
};

export const orderStatusColors: Record<OrderStatus, string> = {
  pending: 'bg-gray-100 text-gray-700 border-gray-300',
  proses: 'bg-blue-100 text-blue-700 border-blue-300',
  selesai: 'bg-green-100 text-green-700 border-green-300',
  cancel: 'bg-red-100 text-red-700 border-red-300',
};

export const settlementStatusLabels: Record<SettlementStatus, string> = {
  belum_lunas: 'Belum Lunas',
  lunas: 'Lunas',
};

export const settlementStatusColors: Record<SettlementStatus, string> = {
  belum_lunas: 'bg-red-100 text-red-700 border-red-300',
  lunas: 'bg-green-100 text-green-700 border-green-300',
};
