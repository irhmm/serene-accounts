import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { OrderTable } from '@/components/order/OrderTable';
import { OrderForm } from '@/components/order/OrderForm';
import { OrderPagination } from '@/components/order/OrderPagination';
import { useMitraOrders } from '@/hooks/useMitraOrders';
import { useWorkers } from '@/hooks/useWorkers';
import { useAuth } from '@/hooks/useAuth';
import { MitraOrder } from '@/types/mitraOrder';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function JadwalOrderMitra() {
  const { orders, loading, totalCount, fetchOrders, addOrder, updateOrder, deleteOrder } = useMitraOrders();
  const { workers } = useWorkers();
  const { isAdmin } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<MitraOrder | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<MitraOrder | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    fetchOrders(currentPage, perPage);
  }, [currentPage, perPage, fetchOrders]);

  const handleAddOrder = () => {
    setEditingOrder(null);
    setShowForm(true);
  };

  const handleEditOrder = (order: MitraOrder) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingOrder(null);
  };

  const handleSubmit = async (orderData: Omit<MitraOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    let success = false;
    if (editingOrder) {
      success = await updateOrder(editingOrder.id, orderData);
    } else {
      success = await addOrder(orderData);
    }

    if (success) {
      handleCloseForm();
      fetchOrders(currentPage, perPage);
    }
  };

  const handleDeleteOrder = async () => {
    if (!deletingOrder) return;
    const success = await deleteOrder(deletingOrder.id);
    if (success) {
      fetchOrders(currentPage, perPage);
    }
    setDeletingOrder(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  if (loading && orders.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Jadwal Order Mitra</h1>
            <p className="text-muted-foreground">Kelola jadwal order dan freelance</p>
          </div>
          {isAdmin && (
            <Button onClick={handleAddOrder} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Order
            </Button>
          )}
        </div>

        <OrderTable
          orders={orders}
          isAdmin={isAdmin}
          onEdit={handleEditOrder}
          onDelete={(order) => setDeletingOrder(order)}
          currentPage={currentPage}
          perPage={perPage}
        />

        <OrderPagination
          currentPage={currentPage}
          totalItems={totalCount}
          perPage={perPage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />

        {isAdmin && (
          <OrderForm
            open={showForm}
            onClose={handleCloseForm}
            onSubmit={handleSubmit}
            initialData={editingOrder}
            workers={workers}
          />
        )}

        <AlertDialog open={!!deletingOrder} onOpenChange={() => setDeletingOrder(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Order</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus order "{deletingOrder?.nomorOrder}"? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteOrder} className="bg-destructive hover:bg-destructive/90">
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
