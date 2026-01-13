import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkerTable } from '@/components/worker/WorkerTable';
import { WorkerForm } from '@/components/worker/WorkerForm';
import { TablePagination } from '@/components/ui/table-pagination';
import { useWorkers } from '@/hooks/useWorkers';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Worker } from '@/types/worker';
import { toast } from 'sonner';

const DataWorker = () => {
  const { workers, loading, addWorker, updateWorker, deleteWorker } = useWorkers();
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error('Anda tidak memiliki akses ke halaman ini');
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  // Cleanup state on unmount
  useEffect(() => {
    return () => {
      setShowForm(false);
      setEditingWorker(null);
    };
  }, []);
  
  const [showForm, setShowForm] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Paginate workers
  const paginatedWorkers = useMemo(() => {
    const startIndex = (currentPage - 1) * perPage;
    return workers.slice(startIndex, startIndex + perPage);
  }, [workers, currentPage, perPage]);

  // Reset page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [workers.length]);

  const handleAddWorker = () => {
    setEditingWorker(null);
    setShowForm(true);
  };

  const handleEditWorker = (worker: Worker) => {
    setEditingWorker(worker);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingWorker(null);
  };

  const handleSubmit = async (workerData: Omit<Worker, 'id' | 'createdAt'>) => {
    try {
      if (editingWorker) {
        await updateWorker(editingWorker.id, workerData);
        toast.success('Worker berhasil diperbarui');
      } else {
        await addWorker(workerData);
        toast.success('Worker berhasil ditambahkan');
      }
      handleCloseForm();
    } catch (error) {
      toast.error('Gagal menyimpan worker');
    }
  };

  const handleDeleteWorker = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus worker ini?')) {
      try {
        await deleteWorker(id);
        toast.success('Worker berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus worker');
      }
    }
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Data Worker</h2>
          {isAdmin && (
            <Button onClick={handleAddWorker} className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Worker
            </Button>
          )}
        </div>

        <WorkerTable
          workers={paginatedWorkers}
          isAdmin={isAdmin}
          onEdit={handleEditWorker}
          onDelete={handleDeleteWorker}
        />
        
        <TablePagination
          currentPage={currentPage}
          totalItems={workers.length}
          perPage={perPage}
          onPageChange={setCurrentPage}
          onPerPageChange={handlePerPageChange}
        />
      </div>

      {/* Form Modal - Only render for admin */}
      {isAdmin && (
        <WorkerForm
          open={showForm}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editingWorker}
        />
      )}
    </DashboardLayout>
  );
};

export default DataWorker;
