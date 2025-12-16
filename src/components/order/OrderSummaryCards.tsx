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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden">
      {cards.map((card) => (
        <Card key={card.title} className="bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-xl font-bold text-foreground">{card.value}</p>
              </div>
              <div className={`h-11 w-11 rounded-full ${card.bgColor} flex items-center justify-center`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
