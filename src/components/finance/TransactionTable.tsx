import { useState } from "react";
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
      return 'bg-primary/10 text-primary border-primary/20';
    case 'pending':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'cancelled':
      return 'bg-muted text-muted-foreground border-border';
    case 'refunded':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    default:
      return 'bg-secondary text-secondary-foreground border-border';
  }
};

const getTypeBadgeVariant = (type: TransactionType) => {
  return transactionTypeColors[type] || 'bg-secondary text-secondary-foreground border-border';
};

export function TransactionTable({ transactions, onEdit, onDelete, isAdmin = false }: TransactionTableProps) {
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

  return (
    <div className="rounded-lg border bg-card overflow-hidden card-shadow">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Tanggal</TableHead>
              <TableHead className="font-semibold">Detail</TableHead>
              <TableHead className="font-semibold">Tipe</TableHead>
              <TableHead className="font-semibold text-right">Masuk DP</TableHead>
              <TableHead className="font-semibold text-right">Keluar DP</TableHead>
              <TableHead className="font-semibold text-right">Saldo</TableHead>
              <TableHead className="font-semibold">Kategori</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Catatan</TableHead>
              {isAdmin && <TableHead className="w-[50px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow 
                key={transaction.id} 
                className="table-row-hover animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell className="font-medium whitespace-nowrap">
                  {format(new Date(transaction.date), "dd MMM yyyy", { locale: id })}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {transaction.detail}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn("font-medium", getTypeBadgeVariant(transaction.type))}
                  >
                    {transactionTypeLabels[transaction.type]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium text-primary whitespace-nowrap">
                  {transaction.amountIn > 0 ? formatCurrency(transaction.amountIn) : '-'}
                </TableCell>
                <TableCell className="text-right font-medium text-destructive whitespace-nowrap">
                  {transaction.amountOut > 0 ? formatCurrency(transaction.amountOut) : '-'}
                </TableCell>
                <TableCell className="text-right font-semibold whitespace-nowrap">
                  {formatCurrency(transaction.balance)}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-medium">
                    {transaction.freelanceCategory || '-'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn("font-medium", getStatusBadgeVariant(transaction.expenseStatus))}
                  >
                    {expenseStatusLabels[transaction.expenseStatus]}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[150px] truncate text-muted-foreground">
                  {transaction.notes || '-'}
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
