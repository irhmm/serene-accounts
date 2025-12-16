import { Fragment, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Transaction,
  transactionTypeLabels,
  transactionTypeColors,
  expenseStatusLabels,
  ExpenseStatus,
  TransactionType,
} from "@/types/transaction";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusBadgeVariant = (status: ExpenseStatus) => {
  switch (status) {
    case 'completed':
      return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    case 'pending':
      return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    case 'cancelled':
      return 'bg-muted text-muted-foreground border-border';
    case 'refunded':
      return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
    default:
      return 'bg-secondary text-secondary-foreground border-border';
  }
};

const getTypeBadgeVariant = (type: TransactionType) => {
  return transactionTypeColors[type] || 'bg-secondary text-secondary-foreground border-border';
};

export function TransactionTable({ transactions, onEdit, onDelete, isAdmin = false }: TransactionTableProps) {
  // Group transactions by month/year
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: Transaction[] } = {};
    
    transactions.forEach((t) => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(t);
    });
    
    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, items]) => ({
        key,
        month: parseInt(key.split('-')[1]),
        year: parseInt(key.split('-')[0]),
        transactions: items,
        totalIn: items.reduce((sum, t) => sum + t.amountIn, 0),
        totalOut: items.reduce((sum, t) => sum + t.amountOut, 0),
      }));
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <svg
            className="h-6 w-6 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold">Belum ada transaksi</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Mulai dengan menambahkan transaksi pertama Anda
        </p>
      </div>
    );
  }

  let rowNumber = 0;

  return (
    <TooltipProvider>
      <div className="rounded-lg border bg-card overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[50px] text-center font-semibold">No</TableHead>
                <TableHead className="min-w-[100px] font-semibold">Tanggal</TableHead>
                <TableHead className="min-w-[180px] font-semibold">Detail Transaksi</TableHead>
                <TableHead className="min-w-[120px] font-semibold">Tipe</TableHead>
                <TableHead className="min-w-[130px] font-semibold text-right">Jumlah Masuk (RP)</TableHead>
                <TableHead className="min-w-[130px] font-semibold text-right">Jumlah Keluar (RP)</TableHead>
                <TableHead className="min-w-[120px] font-semibold text-right">Saldo Akhir</TableHead>
                <TableHead className="min-w-[120px] font-semibold">Kategori</TableHead>
                <TableHead className="min-w-[100px] font-semibold">Status</TableHead>
                <TableHead className="min-w-[150px] font-semibold">Catatan</TableHead>
                {isAdmin && <TableHead className="w-[60px]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedTransactions.map((group) => (
                <Fragment key={group.key}>
                  {/* Month Separator Header */}
                  <TableRow className="bg-muted/30 hover:bg-muted/30 border-y border-muted">
                    <TableCell colSpan={isAdmin ? 11 : 10} className="py-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-foreground text-sm">
                          {format(new Date(group.year, group.month - 1), "MMMM yyyy", { locale: id })}
                        </span>
                        <div className="flex gap-4 text-xs">
                          <span className="text-emerald-600 font-medium">
                            Masuk: {formatCurrency(group.totalIn)}
                          </span>
                          <span className="text-rose-600 font-medium">
                            Keluar: {formatCurrency(group.totalOut)}
                          </span>
                          <span className={cn(
                            "font-semibold",
                            group.totalIn - group.totalOut >= 0 ? "text-emerald-600" : "text-rose-600"
                          )}>
                            Saldo: {formatCurrency(group.totalIn - group.totalOut)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* Transactions in this month */}
                  {group.transactions.map((transaction, index) => {
                    rowNumber++;
                    const balance = transaction.amountIn - transaction.amountOut;
                    
                    return (
                      <TableRow 
                        key={transaction.id} 
                        className="hover:bg-muted/30 transition-colors animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell className="text-center text-muted-foreground font-medium">
                          {rowNumber}
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap">
                          {format(new Date(transaction.date), "dd MMM yyyy", { locale: id })}
                        </TableCell>
                        <TableCell className="max-w-[180px]">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="truncate block cursor-help">
                                {transaction.detail}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-[300px]">
                              <p className="whitespace-pre-wrap">{transaction.detail}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={cn("font-medium text-xs", getTypeBadgeVariant(transaction.type))}
                          >
                            {transactionTypeLabels[transaction.type]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium text-emerald-600 whitespace-nowrap">
                          {transaction.amountIn > 0 ? formatCurrency(transaction.amountIn) : '-'}
                        </TableCell>
                        <TableCell className="text-right font-medium text-rose-600 whitespace-nowrap">
                          {transaction.amountOut > 0 ? formatCurrency(transaction.amountOut) : '-'}
                        </TableCell>
                        <TableCell className={cn(
                          "text-right font-semibold whitespace-nowrap",
                          balance >= 0 ? "text-emerald-600" : "text-rose-600"
                        )}>
                          {formatCurrency(balance)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-medium text-xs">
                            {transaction.freelanceCategory || '-'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={cn("font-medium text-xs", getStatusBadgeVariant(transaction.expenseStatus))}
                          >
                            {expenseStatusLabels[transaction.expenseStatus]}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[150px]">
                          {transaction.notes ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="truncate block text-muted-foreground cursor-help">
                                  {transaction.notes}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="max-w-[300px]">
                                <p className="whitespace-pre-wrap">{transaction.notes}</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        {isAdmin && (
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-popover">
                                <DropdownMenuItem onClick={() => onEdit(transaction)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => onDelete(transaction.id)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Hapus
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
}
