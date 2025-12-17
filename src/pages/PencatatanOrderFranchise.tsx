import { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { FranchiseOrderTable } from '@/components/franchiseOrder/FranchiseOrderTable';
import { FranchiseOrderForm } from '@/components/franchiseOrder/FranchiseOrderForm';
import { FranchiseOrderPagination } from '@/components/franchiseOrder/FranchiseOrderPagination';
import { FranchiseOrderSummaryCards } from '@/components/franchiseOrder/FranchiseOrderSummaryCards';
import { FranchiseOrderSearchFilter } from '@/components/franchiseOrder/FranchiseOrderSearchFilter';
import { useFranchiseOrders } from '@/hooks/useFranchiseOrders';
import { useFranchises } from '@/hooks/useFranchises';
import { useWorkers } from '@/hooks/useWorkers';
import { useAuth } from '@/hooks/useAuth';
import { FranchiseOrder } from '@/types/franchiseOrder';
import { toast } from 'sonner';
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

export default function PencatatanOrderFranchise() {
  const { orders, loading, totalCount, fetchOrders, addOrder, updateOrder, deleteOrder } = useFranchiseOrders();
  const { franchises } = useFranchises();
  const { workers } = useWorkers();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<FranchiseOrder | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<FranchiseOrder | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [kelengkapanFilter, setKelengkapanFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Anda tidak memiliki akses ke halaman ini');
      navigate('/orders');
      return;
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    fetchOrders(currentPage, perPage);
  }, [currentPage, perPage, fetchOrders]);

  // Calculate available years from orders
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    orders.forEach((order) => {
      if (order.tanggalMasuk) {
        const year = new Date(order.tanggalMasuk).getFullYear();
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [orders]);

  // Filter orders based on search and filters
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = searchTerm === '' || 
        order.nomorOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.pjFranchisee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.pjMentor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.detailOrder.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.statusPengerjaan === statusFilter;
      const matchesKelengkapan = kelengkapanFilter === 'all' || order.statusKelengkapan === kelengkapanFilter;

      // Month & Year filtering based on tanggalMasuk
      let matchesMonth = true;
      let matchesYear = true;
      if (order.tanggalMasuk) {
        const orderDate = new Date(order.tanggalMasuk);
        matchesMonth = monthFilter === 'all' || (orderDate.getMonth() + 1) === parseInt(monthFilter);
        matchesYear = yearFilter === 'all' || orderDate.getFullYear() === parseInt(yearFilter);
      }

      return matchesSearch && matchesStatus && matchesKelengkapan && matchesMonth && matchesYear;
    });
  }, [orders, searchTerm, statusFilter, kelengkapanFilter, monthFilter, yearFilter]);

  const handleAddOrder = () => {
    setEditingOrder(null);
    setShowForm(true);
  };

  const handleEditOrder = (order: FranchiseOrder) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingOrder(null);
  };

  const handleSubmit = async (orderData: Omit<FranchiseOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
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

  if (!isAdmin) {
    return null;
  }

  if (loading && orders.length === 0) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container px-3 py-4 md:px-6 md:py-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Pencatatan Order Franchise</h1>
            <p className="text-sm md:text-base text-muted-foreground">Kelola order dari franchise</p>
          </div>
          {isAdmin && (
            <Button onClick={handleAddOrder} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Order
            </Button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="overflow-hidden">
          <FranchiseOrderSummaryCards orders={orders} totalCount={totalCount} isAdmin={isAdmin} />
        </div>

        {/* Search & Filter */}
        <div className="overflow-hidden">
          <FranchiseOrderSearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            kelengkapanFilter={kelengkapanFilter}
            onKelengkapanFilterChange={setKelengkapanFilter}
            monthFilter={monthFilter}
            onMonthFilterChange={setMonthFilter}
            yearFilter={yearFilter}
            onYearFilterChange={setYearFilter}
            availableYears={availableYears}
          />
        </div>

        {/* Table */}
        <div className="w-full min-w-0">
          <FranchiseOrderTable
            orders={filteredOrders}
            isAdmin={isAdmin}
            onEdit={handleEditOrder}
            onDelete={(order) => setDeletingOrder(order)}
            currentPage={currentPage}
            perPage={perPage}
          />
        </div>

        {/* Pagination */}
        <FranchiseOrderPagination
          currentPage={currentPage}
          totalItems={totalCount}
          perPage={perPage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />

        {/* Form Dialog */}
        {isAdmin && (
          <FranchiseOrderForm
            open={showForm}
            onClose={handleCloseForm}
            onSubmit={handleSubmit}
            initialData={editingOrder}
            franchises={franchises}
            workers={workers}
          />
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingOrder} onOpenChange={() => setDeletingOrder(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Order Franchise</AlertDialogTitle>
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
