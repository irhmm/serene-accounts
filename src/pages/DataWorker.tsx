import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LogIn, LogOut, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkerTable } from '@/components/worker/WorkerTable';
import { WorkerForm } from '@/components/worker/WorkerForm';
import { useWorkers } from '@/hooks/useWorkers';
import { useAuth } from '@/hooks/useAuth';
import { Worker } from '@/types/worker';
import { toast } from 'sonner';
import logo from '@/assets/logo.jpg';

const DataWorker = () => {
  const { workers, loading, addWorker, updateWorker, deleteWorker } = useWorkers();
  const { user, isAdmin, signOut } = useAuth();
  
  const [showForm, setShowForm] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);

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

  const handleSignOut = async () => {
    await signOut();
    toast.success('Berhasil logout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Pembimbingmu" className="h-16 w-16 rounded-full object-cover" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Pembimbingmu</h1>
              <p className="text-muted-foreground text-sm">Rekap Jasa Tugasmu</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Navigation */}
            <nav className="flex items-center gap-2">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Transaksi
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="gap-2 bg-muted">
                <Users className="h-4 w-4" />
                Data Worker
              </Button>
            </nav>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
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
            workers={workers}
            isAdmin={isAdmin}
            onEdit={handleEditWorker}
            onDelete={handleDeleteWorker}
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
      </div>
    </div>
  );
};

export default DataWorker;
