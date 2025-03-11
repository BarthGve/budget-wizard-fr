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
  color?: string;
}

export function RetailerStatsCard({ 
  title, 
  amount, 
  count, 
  label, 
  className,
  previousAmount,
  icon,
  color = "blue"
}: RetailerStatsCardProps) {
  const hasVariation = previousAmount !== undefined && previousAmount !== 0;
  const percentageChange = hasVariation
    ? ((amount - previousAmount) / previousAmount) * 100
    : 0;
  const isIncrease = percentageChange > 0;

  // Mapping des couleurs pour les icônes et textes colorés
  const colorMap = {
    blue: "text-blue-600",
    purple: "text-purple-600",
    orange: "text-orange-600"
  };
  
  // Couleur du fond d'icône en fonction de la couleur principale
  const bgColorMap = {
    blue: "bg-blue-100",
    purple: "bg-purple-100",
    orange: "bg-orange-100"
  };

  return (
    <Card className={cn(
      "p-6 border rounded-xl shadow-sm bg-white",
      className
    )}>
      {/* En-tête avec icône et titre */}
      <div className="flex flex-col gap-2.5 mb-4">
        {icon && (
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full",
            bgColorMap[color as keyof typeof bgColorMap]
          )}>
            <div className={colorMap[color as keyof typeof colorMap]}>
              {icon}
            </div>
          </div>
        )}
        <h3 className={cn(
          "text-lg font-medium",
          colorMap[color as keyof typeof colorMap]
        )}>
          {title}
        </h3>
      </div>
      
      {/* Sous-titre descriptif */}
      <p className="text-gray-500 text-sm mb-2">{label}</p>
      
      {/* Montant principal */}
      <div className="space-y-2">
        <p className="text-3xl font-bold text-gray-900">{formatCurrency(amount)}</p>
        
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
      </div>
    </Card>
  );
}
