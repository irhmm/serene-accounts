import { useState, useMemo, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useFranchiseFinances } from '@/hooks/useFranchiseFinances';
import { useFranchises } from '@/hooks/useFranchises';
import { useWorkers } from '@/hooks/useWorkers';
import { FranchiseFinance, FranchiseFinanceFormData } from '@/types/franchiseFinance';
import { FranchiseFinanceTable } from '@/components/franchiseFinance/FranchiseFinanceTable';
import { FranchiseFinanceForm } from '@/components/franchiseFinance/FranchiseFinanceForm';
import { FranchiseFinanceSummaryCards } from '@/components/franchiseFinance/FranchiseFinanceSummaryCards';
import { FranchiseFinanceSearchFilter } from '@/components/franchiseFinance/FranchiseFinanceSearchFilter';
import { FranchiseFinancePagination } from '@/components/franchiseFinance/FranchiseFinancePagination';
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

export default function KeuanganFranchise() {
  const { isAdmin } = useAuth();
  const { finances, loading, addFinance, updateFinance, deleteFinance, calculateFields } = useFranchiseFinances();
  const { franchises } = useFranchises();
  const { workers } = useWorkers();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFinance, setEditingFinance] = useState<FranchiseFinance | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsFormOpen(false);
      setEditingFinance(null);
      setDeleteId(null);
    };
  }, []);

  // Get available years from data
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    finances.forEach((finance) => {
      years.add(finance.tanggalClosingOrder.getFullYear().toString());
    });
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  }, [finances]);

  // Filter finances
  const filteredFinances = useMemo(() => {
    return finances.filter((finance) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        finance.nomorOrder.toLowerCase().includes(searchLower) ||
        finance.detailOrder.toLowerCase().includes(searchLower) ||
        (finance.franchiseName?.toLowerCase().includes(searchLower) ?? false) ||
        (finance.pjMentorName?.toLowerCase().includes(searchLower) ?? false);

      // Status filter
      const matchesStatus = statusFilter === 'all' || finance.statusPembayaran === statusFilter;

      // Month filter
      const orderMonth = (finance.tanggalClosingOrder.getMonth() + 1).toString().padStart(2, '0');
      const matchesMonth = monthFilter === 'all' || orderMonth === monthFilter;

      // Year filter
      const orderYear = finance.tanggalClosingOrder.getFullYear().toString();
      const matchesYear = yearFilter === 'all' || orderYear === yearFilter;

      return matchesSearch && matchesStatus && matchesMonth && matchesYear;
    });
  }, [finances, searchTerm, statusFilter, monthFilter, yearFilter]);

  // Calculate totals from filtered data
  const totals = useMemo(() => {
    return filteredFinances.reduce(
      (acc, finance) => ({
        totalOrders: acc.totalOrders + 1,
        totalRevenue: acc.totalRevenue + finance.totalPaymentCust,
        totalFeeMentor: acc.totalFeeMentor + finance.feeMentor,
        totalKeuntungan: acc.totalKeuntungan + finance.keuntunganBersih,
      }),
      { totalOrders: 0, totalRevenue: 0, totalFeeMentor: 0, totalKeuntungan: 0 }
    );
  }, [filteredFinances]);

  // Pagination
  const totalPages = Math.ceil(filteredFinances.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFinances = filteredFinances.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, monthFilter, yearFilter, itemsPerPage]);

  const handleEdit = (finance: FranchiseFinance) => {
    setEditingFinance(finance);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteFinance(deleteId);
      setDeleteId(null);
    }
  };

  const handleSubmit = async (data: FranchiseFinanceFormData) => {
    if (editingFinance) {
      return await updateFinance(editingFinance.id, data);
    }
    return await addFinance(data);
  };

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setEditingFinance(null);
    }
  };

  if (loading && finances.length === 0) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Keuangan Franchise</h1>
            <p className="text-muted-foreground">Kelola data keuangan franchise</p>
          </div>

          {isAdmin && (
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Data
            </Button>
          )}
        </div>

        <FranchiseFinanceSummaryCards
          totalOrders={totals.totalOrders}
          totalRevenue={totals.totalRevenue}
          totalFeeMentor={totals.totalFeeMentor}
          totalKeuntungan={totals.totalKeuntungan}
          isAdmin={isAdmin}
        />

        <FranchiseFinanceSearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          monthFilter={monthFilter}
          onMonthFilterChange={setMonthFilter}
          yearFilter={yearFilter}
          onYearFilterChange={setYearFilter}
          availableYears={availableYears}
        />

        <Card>
          <CardHeader>
            <CardTitle>Daftar Keuangan Franchise</CardTitle>
          </CardHeader>
          <CardContent>
            <FranchiseFinanceTable
              finances={paginatedFinances}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteId(id)}
              isAdmin={isAdmin}
              startIndex={startIndex}
            />

            <div className="mt-4">
              <FranchiseFinancePagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          </CardContent>
        </Card>

        {isAdmin && (
          <>
            <FranchiseFinanceForm
              open={isFormOpen}
              onOpenChange={handleFormClose}
              onSubmit={handleSubmit}
              editingFinance={editingFinance}
              franchises={franchises}
              workers={workers}
              calculateFields={calculateFields}
            />

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Data Keuangan</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin menghapus data keuangan ini? Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
