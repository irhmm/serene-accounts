import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SummaryCard } from "@/components/finance/SummaryCard";
import { TransactionForm } from "@/components/finance/TransactionForm";
import { TransactionTable } from "@/components/finance/TransactionTable";
import { SearchFilter } from "@/components/finance/SearchFilter";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import { 
  Transaction, 
  TransactionType, 
  ExpenseStatus 
} from "@/types/transaction";
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank,
  Wallet,
  Loader2
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const Index = () => {
  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error("Anda tidak memiliki akses ke halaman ini");
      navigate("/orders");
    }
  }, [isAdmin, authLoading, navigate]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ExpenseStatus | 'all'>('all');
  const [monthFilter, setMonthFilter] = useState<number | 'all'>('all');
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Get available years from transactions
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    transactions.forEach((t) => {
      const year = new Date(t.date).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.notes.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || t.expenseStatus === statusFilter;
      
      // Month and year filter
      const transactionDate = new Date(t.date);
      const matchesMonth = monthFilter === 'all' || (transactionDate.getMonth() + 1) === monthFilter;
      const matchesYear = yearFilter === 'all' || transactionDate.getFullYear() === yearFilter;
      
      return matchesSearch && matchesType && matchesStatus && matchesMonth && matchesYear;
    });
  }, [transactions, searchQuery, typeFilter, statusFilter, monthFilter, yearFilter]);

  // Calculate totals based on filtered transactions (per bulan/filter aktif)
  const totals = useMemo(() => {
    const totalIn = filteredTransactions.reduce((sum, t) => sum + t.amountIn, 0);
    const totalOut = filteredTransactions.reduce((sum, t) => sum + t.amountOut, 0);
    const balance = totalIn - totalOut;
    return { totalIn, totalOut, balance };
  }, [filteredTransactions]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  // Reset page when filters change
  const handleFilterChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => {
    return (value: T) => {
      setter(value);
      setCurrentPage(1);
    };
  };

  // Add transaction
  const handleAddTransaction = async (data: Omit<Transaction, 'id' | 'balance'>) => {
    await addTransaction(data);
  };

  // Edit transaction
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  // Update transaction
  const handleUpdateTransaction = async (data: Omit<Transaction, 'id' | 'balance'>) => {
    if (!editingTransaction) return;
    await updateTransaction(editingTransaction.id, data);
    setEditingTransaction(undefined);
  };

  // Delete transaction
  const handleDeleteTransaction = async (id: string) => {
    await deleteTransaction(id);
  };

  // Close form
  const handleCloseForm = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setEditingTransaction(undefined);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const startItem = filteredTransactions.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredTransactions.length);

  return (
    <DashboardLayout>
      <div className="container px-3 py-4 md:px-6 md:py-6 space-y-4 md:space-y-6">
        {/* Summary Cards */}
        <section className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Pemasukan"
            value={formatCurrency(totals.totalIn)}
            icon={TrendingUp}
            variant="success"
            trend={{ value: 12.5, isPositive: true }}
          />
          <SummaryCard
            title="Total Pengeluaran"
            value={formatCurrency(totals.totalOut)}
            icon={TrendingDown}
            variant="danger"
            trend={{ value: 3.2, isPositive: false }}
          />
          <SummaryCard
            title="Saldo Akhir"
            value={formatCurrency(totals.balance)}
            icon={PiggyBank}
            variant="default"
          />
          <SummaryCard
            title="Total Transaksi"
            value={transactions.length.toString()}
            icon={Wallet}
            variant="default"
          />
        </section>

        {/* Filters */}
        <section className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Daftar Transaksi</h2>
              <p className="text-sm text-muted-foreground">
                {filteredTransactions.length} dari {transactions.length} transaksi
              </p>
            </div>
            {isAdmin && (
              <Button onClick={() => setIsFormOpen(true)} className="btn-primary-gradient gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Tambah Transaksi</span>
                <span className="sm:hidden">Tambah</span>
              </Button>
            )}
          </div>
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={handleFilterChange(setSearchQuery)}
            typeFilter={typeFilter}
            onTypeFilterChange={handleFilterChange(setTypeFilter)}
            statusFilter={statusFilter}
            onStatusFilterChange={handleFilterChange(setStatusFilter)}
            monthFilter={monthFilter}
            onMonthFilterChange={handleFilterChange(setMonthFilter)}
            yearFilter={yearFilter}
            onYearFilterChange={handleFilterChange(setYearFilter)}
            availableYears={availableYears}
          />
        </section>

        {/* Transaction Table */}
        <section>
          <TransactionTable
            transactions={paginatedTransactions}
            onEdit={isAdmin ? handleEditTransaction : () => {}}
            onDelete={isAdmin ? handleDeleteTransaction : () => {}}
            isAdmin={isAdmin}
          />
        </section>

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <section className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Menampilkan {startItem}-{endItem} dari {filteredTransactions.length} transaksi</span>
              <Select 
                value={itemsPerPage.toString()} 
                onValueChange={(v) => {
                  setItemsPerPage(parseInt(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[80px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span>per halaman</span>
            </div>
            
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === 'ellipsis' ? (
                        <span className="px-2">...</span>
                      ) : (
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </section>
        )}
      </div>

      {/* Transaction Form Modal */}
      {isAdmin && (
        <TransactionForm
          open={isFormOpen}
          onOpenChange={handleCloseForm}
          onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
          editTransaction={editingTransaction}
        />
      )}
    </DashboardLayout>
  );
};

export default Index;