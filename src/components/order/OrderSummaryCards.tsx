import { ClipboardList, Clock, Wallet, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface OrderSummaryCardsProps {
  totalOrders: number;
  ordersInProgress: number;
  totalPendapatan: number;
  totalFeeMitra: number;
  isAdmin?: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export function OrderSummaryCards({ 
  totalOrders, 
  ordersInProgress, 
  totalPendapatan, 
  totalFeeMitra, 
  isAdmin = false 
}: OrderSummaryCardsProps) {

  const allCards = [
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      icon: ClipboardList,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      showToAll: true,
    },
    {
      title: 'Orders Proses',
      value: ordersInProgress.toString(),
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      showToAll: true,
    },
    {
      title: 'Total Pendapatan',
      value: formatCurrency(totalPendapatan),
      icon: Wallet,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      showToAll: false,
    },
    {
      title: 'Total Fee Mitra',
      value: formatCurrency(totalFeeMitra),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      showToAll: false,
    },
  ];

  const cards = isAdmin ? allCards : allCards.filter(card => card.showToAll);

  return (
    <div className={`grid grid-cols-2 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-3 md:gap-4 overflow-hidden`}>
      {cards.map((card) => (
        <Card key={card.title} className="bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between gap-2">
            <div className="space-y-0.5 md:space-y-1 min-w-0 flex-1">
                <p className="text-xs md:text-sm text-muted-foreground truncate">{card.title}</p>
                <p className="text-sm md:text-lg font-bold text-foreground truncate">{card.value}</p>
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
