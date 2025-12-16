import { ClipboardList, Clock, Wallet, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
  }).format(amount);
};

export function OrderSummaryCards({ orders, totalCount }: OrderSummaryCardsProps) {
  const ordersInProgress = orders.filter((o) => o.status === 'proses').length;
  const totalPendapatan = orders.reduce((sum, o) => sum + o.totalPembayaran, 0);
  const totalFeeMitra = orders.reduce((sum, o) => sum + o.feeFreelance, 0);

  const cards = [
    {
      title: 'Total Orders',
      value: totalCount.toString(),
      icon: ClipboardList,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Orders Proses',
      value: ordersInProgress.toString(),
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      title: 'Total Pendapatan',
      value: formatCurrency(totalPendapatan),
      icon: Wallet,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Total Fee Mitra',
      value: formatCurrency(totalFeeMitra),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 overflow-hidden">
      {cards.map((card) => (
        <Card key={card.title} className="bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="space-y-0.5 md:space-y-1 min-w-0 flex-1">
                <p className="text-xs md:text-sm text-muted-foreground truncate">{card.title}</p>
                <p className="text-base md:text-xl font-bold text-foreground truncate">{card.value}</p>
              </div>
              <div className={`h-9 w-9 md:h-11 md:w-11 rounded-full ${card.bgColor} flex items-center justify-center flex-shrink-0`}>
                <card.icon className={`h-4 w-4 md:h-5 md:w-5 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
