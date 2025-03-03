
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import { MoveUpRight, MoveDownRight } from "lucide-react";

interface RetailerStatsCardProps {
  title: string;
  amount: number;
  count: number;
  label: string;
  className?: string;
  previousAmount?: number;  // Montant précédent pour calculer la variation
}

export function RetailerStatsCard({ 
  title, 
  amount, 
  count, 
  label, 
  className,
  previousAmount 
}: RetailerStatsCardProps) {
  const hasVariation = previousAmount !== undefined && previousAmount !== 0;
  const percentageChange = hasVariation
    ? ((amount - previousAmount) / previousAmount) * 100
    : 0;
  const isIncrease = percentageChange > 0;

  return (
    <Card className={cn("p-6 text-white", className)}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-2 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold">{formatCurrency(amount)}</p>
          
          {hasVariation && (
            <div className="flex items-center gap-1">
              {isIncrease ? (
                <MoveUpRight className="h-4 w-4 text-red-400" />
              ) : (
                <MoveDownRight className="h-4 w-4 text-green-400" />
              )}
              <span className={cn("text-sm", 
                isIncrease ? "text-red-400" : "text-green-400"
              )}>
                {Math.abs(percentageChange).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        <p className="text-sm opacity-90">
          {count.toFixed(1)} {label}
        </p>
      </div>
    </Card>
  );
}
