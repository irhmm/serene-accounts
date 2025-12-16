// Predefined order types
export type PredefinedOrderType = 
  | 'paket_sempro' 
  | 'paket_semhas' 
  | 'paket_wisuda'
  | 'makalah'
  | 'jurnal_non_terbit'
  | 'jurnal_terbit'
  | 'laporan_praktikum'
  | 'olah_data'
  | 'penurun_plagiasi'
  | 'ppt'
  | 'tugas_uas_uts'
  | 'desain'
  | 'bab_1'
  | 'bab_2'
  | 'bab_3'
  | 'bab_4'
  | 'bab_5'
  | 'merapikan_skripsi'
  | 'tugas_anak_teknik'
  | 'judul_skripsi'
  | 'revisi'
  | 'cari_jurnal'
  | 'paket_basic_bimbingan'
  | 'paket_pro_bimbingan'
  | 'paket_premium_bimbingan'
  | 'tugas_tugas'
  | 'bab_2_3'
  | 'artikel'
  | 'collect_data'
  | 'instrumen_penelitian'
  | 'merapikan'
  | 'modul_ajar'
  | 'judul_tesis'
  | 'vidio_pembelajaran'
  | 'lainnya'
  | 'custom';

// OrderType can be predefined or any custom string
export type OrderType = PredefinedOrderType | string;

// Work status type
export type WorkStatus = 'not_started' | 'on_progress' | 'done';

// Helper to check if type is predefined
export const isPredefinedOrderType = (type: string): type is PredefinedOrderType => {
  return type in orderTypeLabels;
};

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
  statusPengerjaan: WorkStatus;
  statusPelunasan: SettlementStatus;
  catatanAdmin: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const orderTypeLabels: Record<PredefinedOrderType, string> = {
  paket_sempro: 'PAKET SEMPRO',
  paket_semhas: 'PAKET SEMHAS',
  paket_wisuda: 'PAKET WISUDA',
  makalah: 'Makalah',
  jurnal_non_terbit: 'Jurnal (non terbit)',
  jurnal_terbit: 'Jurnal (Terbit)',
  laporan_praktikum: 'Laporan Praktikum',
  olah_data: 'Olah Data',
  penurun_plagiasi: 'Penurun Plagiasi',
  ppt: 'PPT',
  tugas_uas_uts: 'Tugas UAS UTS',
  desain: 'Desain',
  bab_1: 'BAB 1',
  bab_2: 'BAB 2',
  bab_3: 'BAB 3',
  bab_4: 'BAB 4',
  bab_5: 'BAB 5',
  merapikan_skripsi: 'Merapikan Skripsi',
  tugas_anak_teknik: 'Tugas Anak Teknik',
  judul_skripsi: 'Judul Skripsi',
  revisi: 'Revisi',
  cari_jurnal: 'Cari Jurnal',
  paket_basic_bimbingan: 'PAKET BASIC (Bimbingan)',
  paket_pro_bimbingan: 'PAKET PRO (Bimbingan)',
  paket_premium_bimbingan: 'PAKET PREMIUM (Bimbingan)',
  tugas_tugas: 'Tugas-Tugas',
  bab_2_3: 'Bab 2 & 3',
  artikel: 'Artikel',
  collect_data: 'Collect Data',
  instrumen_penelitian: 'Instrumen Penelitian',
  merapikan: 'Merapikan',
  modul_ajar: 'Modul Ajar',
  judul_tesis: 'Judul Tesis',
  vidio_pembelajaran: 'Vidio Pembelajaran',
  lainnya: 'Lainnya',
  custom: 'Ketik Sendiri',
};

export const orderTypeColors: Record<PredefinedOrderType, string> = {
  paket_sempro: 'bg-red-100 text-red-700 border-red-300',
  paket_semhas: 'bg-red-100 text-red-700 border-red-300',
  paket_wisuda: 'bg-red-100 text-red-700 border-red-300',
  makalah: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  jurnal_non_terbit: 'bg-purple-100 text-purple-700 border-purple-300',
  jurnal_terbit: 'bg-purple-100 text-purple-700 border-purple-300',
  laporan_praktikum: 'bg-orange-100 text-orange-700 border-orange-300',
  olah_data: 'bg-orange-100 text-orange-700 border-orange-300',
  penurun_plagiasi: 'bg-orange-100 text-orange-700 border-orange-300',
  ppt: 'bg-blue-100 text-blue-700 border-blue-300',
  tugas_uas_uts: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  desain: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  bab_1: 'bg-amber-800/20 text-amber-800 border-amber-600',
  bab_2: 'bg-amber-800/20 text-amber-800 border-amber-600',
  bab_3: 'bg-amber-800/20 text-amber-800 border-amber-600',
  bab_4: 'bg-amber-800/20 text-amber-800 border-amber-600',
  bab_5: 'bg-amber-800/20 text-amber-800 border-amber-600',
  merapikan_skripsi: 'bg-gray-100 text-gray-700 border-gray-300',
  tugas_anak_teknik: 'bg-gray-100 text-gray-700 border-gray-300',
  judul_skripsi: 'bg-gray-100 text-gray-700 border-gray-300',
  revisi: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  cari_jurnal: 'bg-gray-100 text-gray-700 border-gray-300',
  paket_basic_bimbingan: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  paket_pro_bimbingan: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  paket_premium_bimbingan: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  tugas_tugas: 'bg-orange-100 text-orange-700 border-orange-300',
  bab_2_3: 'bg-orange-100 text-orange-700 border-orange-300',
  artikel: 'bg-gray-100 text-gray-700 border-gray-300',
  collect_data: 'bg-gray-100 text-gray-700 border-gray-300',
  instrumen_penelitian: 'bg-blue-100 text-blue-700 border-blue-300',
  merapikan: 'bg-slate-700/20 text-slate-700 border-slate-500',
  modul_ajar: 'bg-blue-100 text-blue-700 border-blue-300',
  judul_tesis: 'bg-purple-100 text-purple-700 border-purple-300',
  vidio_pembelajaran: 'bg-gray-100 text-gray-700 border-gray-300',
  lainnya: 'bg-gray-100 text-gray-700 border-gray-300',
  custom: 'bg-teal-100 text-teal-700 border-teal-300',
};

// Helper functions for custom types
export const getOrderTypeLabel = (type: string): string => {
  return orderTypeLabels[type as PredefinedOrderType] || type;
};

export const getOrderTypeColor = (type: string): string => {
  return orderTypeColors[type as PredefinedOrderType] || 'bg-gray-100 text-gray-700 border-gray-300';
};

// Work Status labels and colors
export const workStatusLabels: Record<WorkStatus, string> = {
  not_started: 'Not Started',
  on_progress: 'On Progress',
  done: 'Done',
};

export const workStatusColors: Record<WorkStatus, string> = {
  not_started: 'bg-red-100 text-red-700 border-red-300',
  on_progress: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  done: 'bg-green-100 text-green-700 border-green-300',
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
