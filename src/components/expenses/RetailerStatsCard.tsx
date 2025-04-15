
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
  icon?: React.ReactNode;
  colorScheme?: "blue" | "purple" | "amber";
}

export function RetailerStatsCard({ 
  title, 
  amount, 
  count, 
  label, 
  className,
  previousAmount,
  icon,
  colorScheme = "blue"
}: RetailerStatsCardProps) {
  const hasVariation = previousAmount !== undefined && previousAmount !== 0;
  const percentageChange = hasVariation
    ? ((amount - previousAmount) / previousAmount) * 100
    : 0;
  const isIncrease = percentageChange > 0;

  // Styles basés sur le colorScheme
  const getColorStyles = () => {
    switch(colorScheme) {
      case "purple":
        return {
          iconBg: "bg-primary-100 dark:bg-primary-900/30",
          iconText: "text-primary-600 dark:text-primary-300",
          title: "text-primary-700 dark:text-primary-300",
          increaseText: "text-red-500 dark:text-red-300",
          decreaseText: "text-green-500 dark:text-green-300",
          primaryText: "text-primary-700 dark:text-primary-200",
          secondaryText: "text-secondary-600/80 dark:text-secondary-300/80"
        };
      case "amber":
        return {
          iconBg: "bg-quinary-100 dark:bg-quinary-900/30", 
          iconText: "text-quinary-600 dark:text-quinary-300",
          title: "text-quinary-700 dark:text-quinary-300",
          increaseText: "text-red-500 dark:text-red-300",
          decreaseText: "text-green-500 dark:text-green-300",
          primaryText: "text-quinary-700 dark:text-quinary-200",
          secondaryText: "text-secondary-600/80 dark:text-secondary-300/80"
        };
      default: // blue
        return {
          iconBg: "bg-tertiary-100 dark:bg-tertiary-900/30",
          iconText: "text-tertiary-600 dark:text-tertiary-300",
          title: "text-tertiary-700 dark:text-tertiary-300",
          increaseText: "text-red-500 dark:text-red-300",
          decreaseText: "text-green-500 dark:text-green-300", 
          primaryText: "text-tertiary-700 dark:text-tertiary-200",
          secondaryText: "text-secondary-600/80 dark:text-secondary-300/80"
        };
    }
  };

  const colors = getColorStyles();

  return (
    <Card className={cn(
      "border overflow-hidden transition-all duration-200",
      // Light mode base
      "bg-white shadow-lg",
      // Dark mode base 
      "dark:bg-gray-800/90  dark:border-gray-700/50",
      className
    )}>
      <div className="p-5">
        {/* En-tête avec titre et icône */}
        <div className="flex items-center justify-between">
          <h3 className={cn("text-lg font-medium", colors.title)}>{title}</h3>
          {icon && (
            <div className={cn("p-2 rounded-lg", colors.iconBg)}>
              <div className={colors.iconText}>
                {icon}
              </div>
            </div>
          )}
        </div>
        
        {/* Montant principal et indicateur de variation sur la même ligne */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center gap-2">
            <p className={cn("text-2xl font-bold", colors.primaryText)}>
              {formatCurrency(amount)}
            </p>
            
            {/* Indicateur de variation */}
            {hasVariation && (
              <div className="flex items-center gap-1">
                {isIncrease ? (
                  <div className="flex items-center">
                    <div className="p-1 rounded-full bg-red-100/80 dark:bg-red-900/30">
                      <MoveUpRight className="h-3 w-3 text-red-500 dark:text-red-300" />
                    </div>
                    <span className={cn("text-sm ml-1", colors.increaseText)}>
                      +{Math.abs(percentageChange).toFixed(1)}%
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="p-1 rounded-full bg-green-100/80 dark:bg-green-900/30">
                      <MoveDownRight className="h-3 w-3 text-green-500 dark:text-green-300" />
                    </div>
                    <span className={cn("text-sm ml-1", colors.decreaseText)}>
                      -{Math.abs(percentageChange).toFixed(1)}%
                    </span>
                  </div>
                )}
                
                {/* Légende de comparaison à côté de l'indicateur de variation */}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({title.includes("mois") ? "vs mois précédent" : "vs année précédente"})
                </span>
              </div>
            )}
          </div>
          
          {/* Nombre et libellé sur sa propre ligne */}
          <p className={cn("text-sm", colors.secondaryText)}>
            {count.toLocaleString('fr-FR')} {label}
          </p>
        </div>
      </div>
    </Card>
  );
}
