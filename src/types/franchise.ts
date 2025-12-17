export type FranchiseStatus = 'verified' | 'non_verified';

export interface Franchise {
  id: string;
  namaFranchise: string;
  alamat: string;
  kontrakMulai: Date;
  kontrakBerakhir: Date;
  keterangan: FranchiseStatus;
  rekening: string | null;
  catatan: string | null;
  createdAt: Date;
}

export const franchiseStatusLabels: Record<FranchiseStatus, string> = {
  verified: 'Verified',
  non_verified: 'Non-Verified',
};

export const franchiseStatusColors: Record<FranchiseStatus, string> = {
  verified: 'bg-green-100 text-green-700 border-green-300',
  non_verified: 'bg-yellow-100 text-yellow-700 border-yellow-300',
};
