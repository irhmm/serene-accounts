import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Calendar, TrendingUp, TrendingDown, Wallet, Loader2 } from "lucide-react";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Ags", "Sep", "Okt", "Nov", "Des"
];

interface MonthlyData {
  month: string;
  pemasukan: number;
  pengeluaran: number;
}

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};

const formatTooltipValue = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function LaporanKeuangan() {
  const { transactions, loading } = useTransactions();
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [yearFilter, setYearFilter] = useState<number | "all">(currentYear);

  // Get available years from transactions - MUST be before any early returns
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    transactions.forEach((t) => {
      const year = new Date(t.date).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);

  // Calculate monthly income and expense data - MUST be before any early returns
  const monthlyData = useMemo(() => {
    const data: MonthlyData[] = monthNames.map((month) => ({
      month,
      pemasukan: 0,
      pengeluaran: 0,
    }));

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const year = date.getFullYear();
      const monthIndex = date.getMonth();

      // Filter by year if selected
      if (yearFilter !== "all" && year !== yearFilter) return;

      // Add income and expenses
      data[monthIndex].pemasukan += t.amountIn;
      data[monthIndex].pengeluaran += t.amountOut;
    });

    return data;
  }, [transactions, yearFilter]);

  // Calculate totals - MUST be before any early returns
  const totals = useMemo(() => {
    const pemasukan = monthlyData.reduce((sum, d) => sum + d.pemasukan, 0);
    const pengeluaran = monthlyData.reduce((sum, d) => sum + d.pengeluaran, 0);
    const saldo = pemasukan - pengeluaran;
    return { pemasukan, pengeluaran, saldo };
  }, [monthlyData]);

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error("Anda tidak memiliki akses ke halaman ini");
      navigate("/orders");
    }
  }, [isAdmin, authLoading, navigate]);

  // Early returns AFTER all hooks
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container px-3 py-4 md:px-6 md:py-6 space-y-4 md:space-y-6">
        {/* Header with Year Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Laporan Keuangan</h1>
            <p className="text-muted-foreground text-sm">
              Grafik pemasukan dan pengeluaran bulanan
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select
              value={yearFilter.toString()}
              onValueChange={(value) =>
                setYearFilter(value === "all" ? "all" : parseInt(value))
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tahun</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pemasukan {yearFilter !== "all" ? yearFilter : ""}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                {formatTooltipValue(totals.pemasukan)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pengeluaran {yearFilter !== "all" ? yearFilter : ""}
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">
                {formatTooltipValue(totals.pengeluaran)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saldo {yearFilter !== "all" ? yearFilter : ""}
              </CardTitle>
              <Wallet className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${totals.saldo >= 0 ? "text-primary" : "text-destructive"}`}>
                {formatTooltipValue(totals.saldo)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart Card */}
        <Card>
          <CardHeader>
            <CardTitle>Pemasukan & Pengeluaran Per Bulan</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Memuat data...</p>
              </div>
            ) : (
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                      tickLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <YAxis
                      tickFormatter={formatCurrency}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                      tickLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        formatTooltipValue(value),
                        name === "pemasukan" ? "Pemasukan" : "Pengeluaran",
                      ]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                    />
                    <Legend
                      formatter={(value) => (value === "pemasukan" ? "Pemasukan" : "Pengeluaran")}
                    />
                    <Line
                      type="monotone"
                      dataKey="pemasukan"
                      name="pemasukan"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{
                        fill: "hsl(var(--primary))",
                        stroke: "hsl(var(--background))",
                        strokeWidth: 2,
                        r: 5,
                      }}
                      activeDot={{
                        fill: "hsl(var(--primary))",
                        stroke: "hsl(var(--background))",
                        strokeWidth: 2,
                        r: 7,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="pengeluaran"
                      name="pengeluaran"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={3}
                      dot={{
                        fill: "hsl(var(--destructive))",
                        stroke: "hsl(var(--background))",
                        strokeWidth: 2,
                        r: 5,
                      }}
                      activeDot={{
                        fill: "hsl(var(--destructive))",
                        stroke: "hsl(var(--background))",
                        strokeWidth: 2,
                        r: 7,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
