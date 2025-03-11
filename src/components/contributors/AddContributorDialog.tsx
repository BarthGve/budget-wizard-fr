
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface RetailerStatsCardProps {
  title: string;
  amount: number;
  count?: number;
  label: string;
  className?: string;
  previousAmount?: number;
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
}

export function RetailerStatsCard({ 
  title, 
  amount, 
  count, 
  label, 
  className,
  previousAmount,
  icon,
  iconBg = "bg-amber-100",
  iconColor = "text-amber-600"
}: RetailerStatsCardProps) {
  const hasVariation = previousAmount !== undefined && previousAmount !== 0;
  const percentageChange = hasVariation
    ? ((amount - previousAmount) / previousAmount) * 100
    : 0;
  const isIncrease = percentageChange > 0;

  return (
    <Card className={cn(
      "p-6 border rounded-xl shadow-sm bg-white",
      className
    )}>
      {/* En-tête avec icône et titre */}
      <div className="flex flex-col gap-1.5 mb-3">
        {icon && (
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full",
            iconBg
          )}>
            <div className={iconColor}>
              {icon}
            </div>
          </div>
        )}
        <h3 className="text-lg font-medium text-blue-600">
          {title}
        </h3>
      </div>
      
      {/* Sous-titre descriptif */}
      <p className="text-gray-500 text-sm mb-2">{label}</p>
      
      {/* Montant principal */}
      <p className="text-3xl font-bold text-blue-700">{formatCurrency(amount)}</p>
      
      {/* Indicateur de variation */}
      {hasVariation && (
        <div className="flex items-center gap-1 mt-2">
          {isIncrease ? (
            <ArrowUpRight className="h-4 w-4 text-red-500" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-green-500" />
          )}
          <span className={cn(
            "text-sm font-medium",
            isIncrease ? "text-red-500" : "text-green-500"
          )}>
            {Math.abs(percentageChange).toFixed(1)}%
          </span>
        </div>
      )}
    </Card>
  );
}

