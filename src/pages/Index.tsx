import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { SummaryCard } from "@/components/finance/SummaryCard";
import { TransactionForm } from "@/components/finance/TransactionForm";
import { TransactionTable } from "@/components/finance/TransactionTable";
import { SearchFilter } from "@/components/finance/SearchFilter";
import { 
  Transaction, 
  TransactionType, 
  ExpenseStatus 
} from "@/types/transaction";
import { 
  Plus, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank 
} from "lucide-react";
import { toast } from "sonner";

// Sample data
const initialTransactions: Transaction[] = [
  {
    id: '1',
    date: new Date('2024-01-15'),
    detail: 'Project Website E-Commerce',
    type: 'income',
    amountIn: 5000000,
    amountOut: 0,
    balance: 5000000,
    freelanceCategory: 'development',
    expenseStatus: 'completed',
    notes: 'Pembayaran DP 50%',
  },
  {
    id: '2',
    date: new Date('2024-01-18'),
    detail: 'Pembelian Domain & Hosting',
    type: 'expense',
    amountIn: 0,
    amountOut: 850000,
    balance: 4150000,
    freelanceCategory: 'development',
    expenseStatus: 'completed',
    notes: 'Untuk client ABC',
  },
  {
    id: '3',
    date: new Date('2024-01-20'),
    detail: 'Desain Logo Brand XYZ',
    type: 'income',
    amountIn: 2500000,
    amountOut: 0,
    balance: 6650000,
    freelanceCategory: 'design',
    expenseStatus: 'completed',
    notes: 'Full payment',
  },
  {
    id: '4',
    date: new Date('2024-01-22'),
    detail: 'Langganan Software Design',
    type: 'expense',
    amountIn: 0,
    amountOut: 450000,
    balance: 6200000,
    freelanceCategory: 'design',
    expenseStatus: 'pending',
    notes: 'Figma & Adobe',
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
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
  const handleAddTransaction = (data: Omit<Transaction, 'id' | 'balance'>) => {
    const newBalance = totals.balance + data.amountIn - data.amountOut;
    const newTransaction: Transaction = {
      ...data,
      id: Date.now().toString(),
      balance: newBalance,
    };
    setTransactions([...transactions, newTransaction]);
    toast.success("Transaksi berhasil ditambahkan");
  };

  // Edit transaction
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  // Update transaction
  const handleUpdateTransaction = (data: Omit<Transaction, 'id' | 'balance'>) => {
    if (!editingTransaction) return;
    
    const updatedTransactions = transactions.map((t) => {
      if (t.id === editingTransaction.id) {
        return {
          ...t,
          ...data,
        };
      }
      return t;
    });

    // Recalculate balances
    let runningBalance = 0;
    const recalculatedTransactions = updatedTransactions.map((t) => {
      runningBalance += t.amountIn - t.amountOut;
      return { ...t, balance: runningBalance };
    });

    setTransactions(recalculatedTransactions);
    setEditingTransaction(undefined);
    toast.success("Transaksi berhasil diperbarui");
  };

  // Delete transaction
  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    
    // Recalculate balances
    let runningBalance = 0;
    const recalculatedTransactions = updatedTransactions.map((t) => {
      runningBalance += t.amountIn - t.amountOut;
      return { ...t, balance: runningBalance };
    });

    setTransactions(recalculatedTransactions);
    toast.success("Transaksi berhasil dihapus");
  };

  // Close form
  const handleCloseForm = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setEditingTransaction(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">FinanceTrack</h1>
              <p className="text-xs text-muted-foreground">Pendataan Keuangan</p>
            </div>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="btn-primary-gradient gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Tambah Transaksi</span>
            <span className="sm:hidden">Tambah</span>
          </Button>
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
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </section>
      </main>

      {/* Transaction Form Modal */}
      <TransactionForm
        open={isFormOpen}
        onOpenChange={handleCloseForm}
        onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
        editTransaction={editingTransaction}
      />
    </div>
  );
};

export default Index;
