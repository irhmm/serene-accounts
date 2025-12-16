export type WorkerRole = 'admin' | 'mitra' | 'freelancer' | 'affiliate';
export type WorkerStatus = 'active' | 'inactive';

export interface Worker {
  id: string;
  nama: string;
  nomorWa: string;
  rekening: string | null;
  role: WorkerRole;
  status: WorkerStatus;
  createdAt: Date;
}

export const workerRoleLabels: Record<WorkerRole, string> = {
  admin: 'Admin',
  mitra: 'Mitra',
  freelancer: 'Freelancer',
  affiliate: 'Affiliate',
};

export const workerRoleColors: Record<WorkerRole, string> = {
  admin: 'bg-blue-100 text-blue-700 border-blue-300',
  mitra: 'bg-green-100 text-green-700 border-green-300',
  freelancer: 'bg-purple-100 text-purple-700 border-purple-300',
  affiliate: 'bg-orange-100 text-orange-700 border-orange-300',
};

export const workerStatusLabels: Record<WorkerStatus, string> = {
  active: 'Aktif',
  inactive: 'Tidak Aktif',
};

export const workerStatusColors: Record<WorkerStatus, string> = {
  active: 'bg-green-100 text-green-700 border-green-300',
  inactive: 'bg-gray-100 text-gray-700 border-gray-300',
};
