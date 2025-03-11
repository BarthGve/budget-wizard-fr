import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface RetailerStatsCardProps {
  title: string;
  amount: number;
  count: number;
  label: string;
  className?: string;
  previousAmount?: number;
  icon?: React.ReactNode;
}

export function RetailerStatsCard({ 
  title, 
  amount, 
  count, 
  label, 
  className,
  previousAmount,
  icon
}: RetailerStatsCardProps) {
  const hasVariation = previousAmount !== undefined && previousAmount !== 0;
  const percentageChange = hasVariation
    ? ((amount - previousAmount) / previousAmount) * 100
    : 0;
  const isIncrease = percentageChange > 0;

  return (
    <Card className={cn(
      "p-6 overflow-hidden border shadow-md transition-all duration-200",
      className
    )}>
      {/* En-tête avec titre */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {icon && (
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/20">
            {icon}
          </div>
        )}
      </div>
      
      {/* Montant principal */}
      <div className="space-y-2">
        <p className="text-2xl font-bold">{formatCurrency(amount)}</p>
        <p className="text-sm opacity-90">
          {count.toLocaleString('fr-FR')} {label}
        </p>
        
        {/* Indicateur de variation */}
        {hasVariation && (
          <div className="flex items-center gap-1 mt-3 px-2.5 py-1.5 rounded-md bg-white/10 w-fit">
            {isIncrease ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            <span className={cn(
              "text-sm font-medium",
              isIncrease ? "text-red-200" : "text-green-200"
            )}>
              {Math.abs(percentageChange).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
