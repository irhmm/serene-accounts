import { Building2, ClipboardList, Clock, DollarSign, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FranchiseFinanceSummaryCardsProps {
  totalOrders: number;
  totalRevenue: number;
  totalFeeMentor: number;
  totalKeuntungan: number;
  totalKomisiMitra: number;
  totalBelumDibayar: number;
  isAdmin: boolean;
}

export function FranchiseFinanceSummaryCards({
  totalOrders,
  totalRevenue,
  totalFeeMentor,
  totalKeuntungan,
  totalKomisiMitra,
  totalBelumDibayar,
  isAdmin,
}: FranchiseFinanceSummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const allCards = [
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      icon: ClipboardList,
      adminOnly: false,
      highlight: false,
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      adminOnly: true,
      highlight: false,
    },
    {
      title: 'Total Fee Mentor',
      value: formatCurrency(totalFeeMentor),
      icon: Users,
      adminOnly: true,
      highlight: false,
    },
    {
      title: 'Total Pendapatan Franchise',
      value: formatCurrency(totalKomisiMitra),
      icon: Building2,
      adminOnly: true,
      highlight: false,
    },
    {
      title: 'Total Belum Dibayar',
      value: formatCurrency(totalBelumDibayar),
      icon: Clock,
      adminOnly: true,
      highlight: true,
    },
    {
      title: 'Total Keuntungan',
      value: formatCurrency(totalKeuntungan),
      icon: TrendingUp,
      adminOnly: true,
      highlight: false,
    },
  ];

  const visibleCards = allCards.filter((card) => !card.adminOnly || isAdmin);

  return (
    <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {visibleCards.map((card) => (
        <Card 
          key={card.title}
          className={cn(card.highlight && 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium truncate">{card.title}</CardTitle>
            <card.icon className={cn(
              "h-4 w-4 flex-shrink-0",
              card.highlight ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
            )} />
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-lg md:text-2xl font-bold truncate",
              card.highlight && "text-amber-700 dark:text-amber-300"
            )}>
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
