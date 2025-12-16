import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SummaryCard } from "@/components/finance/SummaryCard";
import { TransactionForm } from "@/components/finance/TransactionForm";
import { TransactionTable } from "@/components/finance/TransactionTable";
import { SearchFilter } from "@/components/finance/SearchFilter";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/hooks/useAuth";
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
  LogIn,
  LogOut,
  Loader2
} from "lucide-react";
import logo from "@/assets/logo-white.png";

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
  const { user, isAdmin, signOut } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ExpenseStatus | 'all'>('all');

  // Calculate totals
  const totals = useMemo(() => {
    const totalIn = transactions.reduce((sum, t) => sum + t.amountIn, 0);
    const totalOut = transactions.reduce((sum, t) => sum + t.amountOut, 0);
    const balance = totalIn - totalOut;
    return { totalIn, totalOut, balance };
  }, [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.notes.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || t.expenseStatus === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [transactions, searchQuery, typeFilter, statusFilter]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#7fb19e]">
              <img src={logo} alt="Pembimbingmu Logo" className="h-8 w-8 object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">Pembimbingmu</h1>
              <p className="text-xs text-muted-foreground">Rekap Jasa Tugasmu</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button onClick={() => setIsFormOpen(true)} className="btn-primary-gradient gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Tambah Transaksi</span>
                <span className="sm:hidden">Tambah</span>
              </Button>
            )}
            {user ? (
              <Button variant="outline" onClick={signOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Keluar</span>
              </Button>
            ) : (
              <Button variant="outline" asChild className="gap-2">
                <Link to="/auth">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Masuk Admin</span>
                  <span className="sm:hidden">Masuk</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 space-y-6">
        {/* Summary Cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          </div>
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </section>

        {/* Transaction Table */}
        <section>
          <TransactionTable
            transactions={filteredTransactions}
            onEdit={isAdmin ? handleEditTransaction : () => {}}
            onDelete={isAdmin ? handleDeleteTransaction : () => {}}
            isAdmin={isAdmin}
          />
        </section>
      </main>

      {/* Transaction Form Modal */}
      {isAdmin && (
        <TransactionForm
          open={isFormOpen}
          onOpenChange={handleCloseForm}
          onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
          editTransaction={editingTransaction}
        />
      )}
    </div>
  );
};

export default Index;
