import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'danger';
  className?: string;
}

export function SummaryCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  variant = 'default',
  className 
}: SummaryCardProps) {
  const iconVariants = {
    default: 'bg-secondary text-foreground',
    success: 'bg-primary/10 text-primary',
    danger: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className={cn(
      "rounded-lg border bg-card p-5 card-shadow transition-all duration-200 hover:card-shadow-lg",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1 md:space-y-2 min-w-0 flex-1">
          <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">{title}</p>
          <p className="text-lg md:text-2xl font-bold tracking-tight truncate">{value}</p>
          {trend && (
            <p className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-primary" : "text-destructive"
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}% dari bulan lalu
            </p>
          )}
        </div>
        <div className={cn(
          "rounded-lg p-3",
          iconVariants[variant]
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
