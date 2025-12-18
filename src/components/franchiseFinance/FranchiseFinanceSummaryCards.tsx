import { Building2, ClipboardList, DollarSign, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FranchiseFinanceSummaryCardsProps {
  totalOrders: number;
  totalRevenue: number;
  totalFeeMentor: number;
  totalKeuntungan: number;
  totalKomisiMitra: number;
  isAdmin: boolean;
}

export function FranchiseFinanceSummaryCards({
  totalOrders,
  totalRevenue,
  totalFeeMentor,
  totalKeuntungan,
  totalKomisiMitra,
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
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      adminOnly: true,
    },
    {
      title: 'Total Fee Mentor',
      value: formatCurrency(totalFeeMentor),
      icon: Users,
      adminOnly: true,
    },
    {
      title: 'Total Pendapatan Franchise',
      value: formatCurrency(totalKomisiMitra),
      icon: Building2,
      adminOnly: true,
    },
    {
      title: 'Total Keuntungan',
      value: formatCurrency(totalKeuntungan),
      icon: TrendingUp,
      adminOnly: true,
    },
  ];

  const visibleCards = allCards.filter((card) => !card.adminOnly || isAdmin);

  return (
    <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {visibleCards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium truncate">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold truncate">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
