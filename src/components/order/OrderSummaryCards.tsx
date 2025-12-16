import { ClipboardList, Clock, Wallet, Users } from 'lucide-react';
import { MitraOrder } from '@/types/mitraOrder';

interface OrderSummaryCardsProps {
  orders: MitraOrder[];
  totalCount: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    notation: 'compact',
  }).format(amount);
};

export function OrderSummaryCards({ orders, totalCount }: OrderSummaryCardsProps) {
  const ordersInProgress = orders.filter((o) => o.status === 'proses').length;
  const totalPendapatan = orders.reduce((sum, o) => sum + o.totalPembayaran, 0);
  const totalFeeMitra = orders.reduce((sum, o) => sum + o.feeFreelance, 0);

  const stats = [
    {
      label: 'Total Orders',
      value: totalCount.toString(),
      icon: ClipboardList,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Proses',
      value: ordersInProgress.toString(),
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      label: 'Pendapatan',
      value: formatCurrency(totalPendapatan),
      icon: Wallet,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      label: 'Fee Mitra',
      value: formatCurrency(totalFeeMitra),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border shadow-sm"
        >
          <div className={`h-6 w-6 rounded-full ${stat.bgColor} flex items-center justify-center`}>
            <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
          </div>
          <span className="text-xs text-muted-foreground">{stat.label}:</span>
          <span className="text-sm font-semibold text-foreground">{stat.value}</span>
        </div>
      ))}
    </div>
  );
}
