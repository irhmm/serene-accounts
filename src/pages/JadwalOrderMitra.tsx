import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { OrderTable } from '@/components/order/OrderTable';
import { OrderForm } from '@/components/order/OrderForm';
import { OrderPagination } from '@/components/order/OrderPagination';
import { OrderSummaryCards } from '@/components/order/OrderSummaryCards';
import { OrderSearchFilter } from '@/components/order/OrderSearchFilter';
import { useMitraOrders } from '@/hooks/useMitraOrders';
import { useWorkers } from '@/hooks/useWorkers';
import { useAuth } from '@/hooks/useAuth';
import { MitraOrder } from '@/types/mitraOrder';
import { SortOrder } from '@/components/ui/date-sort-toggle';
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

export default function JadwalOrderMitra() {
  const { orders, loading, totalCount, fetchOrders, addOrder, updateOrder, deleteOrder } = useMitraOrders();
  const { workers } = useWorkers();
  const { user, isAdmin, isFranchise, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<MitraOrder | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<MitraOrder | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [dateSortOrder, setDateSortOrder] = useState<SortOrder>('desc');

  // No auth check - this page is publicly accessible (read-only for non-admin)

  useEffect(() => {
    fetchOrders(currentPage, perPage);
  }, [currentPage, perPage, fetchOrders]);

  // Calculate available years from orders
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    orders.forEach((order) => {
      if (order.tanggalStart) {
        const year = new Date(order.tanggalStart).getFullYear();
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [orders]);

  // Filter orders based on search and filters
  const filteredOrders = useMemo(() => {
    const filtered = orders.filter((order) => {
      const matchesSearch = searchTerm === '' || 
        order.nomorOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.namaPjFreelance.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.detailOrder.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.statusPengerjaan === statusFilter;
      const matchesPayment = paymentFilter === 'all' || order.statusPembayaran === paymentFilter;

      // Month & Year filtering based on tanggalStart
      let matchesMonth = true;
      let matchesYear = true;
      if (order.tanggalStart) {
        const orderDate = new Date(order.tanggalStart);
        matchesMonth = monthFilter === 'all' || (orderDate.getMonth() + 1) === parseInt(monthFilter);
        matchesYear = yearFilter === 'all' || orderDate.getFullYear() === parseInt(yearFilter);
      }

      return matchesSearch && matchesStatus && matchesPayment && matchesMonth && matchesYear;
    });

    // Sort by tanggalStart
    return filtered.sort((a, b) => {
      const dateA = new Date(a.tanggalStart).getTime();
      const dateB = new Date(b.tanggalStart).getTime();
      return dateSortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter, monthFilter, yearFilter, dateSortOrder]);

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
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Jadwal Order Mitra</h1>
            <p className="text-sm md:text-base text-muted-foreground">Kelola jadwal order dan freelance</p>
          </div>
          {isAdmin && (
            <Button onClick={handleAddOrder} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Order
            </Button>
          )}
        </div>

        {/* Summary Cards - isolated from table scroll */}
        <div className="overflow-hidden">
          <OrderSummaryCards orders={orders} totalCount={totalCount} isAdmin={isAdmin} />
        </div>

        {/* Search & Filter - isolated from table scroll */}
        <div className="overflow-hidden">
          <OrderSearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            paymentFilter={paymentFilter}
            onPaymentFilterChange={setPaymentFilter}
            monthFilter={monthFilter}
            onMonthFilterChange={setMonthFilter}
            yearFilter={yearFilter}
            onYearFilterChange={setYearFilter}
            availableYears={availableYears}
          />
        </div>

        {/* Table - only this section scrolls horizontally */}
        <div className="w-full min-w-0">
          <OrderTable
            orders={filteredOrders}
            isAdmin={isAdmin}
            onEdit={handleEditOrder}
            onDelete={(order) => setDeletingOrder(order)}
            currentPage={currentPage}
            perPage={perPage}
            sortOrder={dateSortOrder}
            onSortChange={setDateSortOrder}
          />
        </div>

        {/* Pagination */}
        <OrderPagination
          currentPage={currentPage}
          totalItems={totalCount}
          perPage={perPage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />

        {/* Form Dialog */}
        {isAdmin && (
          <OrderForm
            open={showForm}
            onClose={handleCloseForm}
            onSubmit={handleSubmit}
            initialData={editingOrder}
            workers={workers}
          />
        )}

        {/* Delete Confirmation */}
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
