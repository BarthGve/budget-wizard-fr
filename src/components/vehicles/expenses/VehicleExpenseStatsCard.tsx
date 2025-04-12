
import { Card } from "@/components/ui/card";
import { formatCurrency, formatVolume, formatPricePerLiter } from "@/utils/format";
import { cn } from "@/lib/utils";
import { 
  Droplets, 
  DollarSign, 
  TrendingUp,
  MoveUpRight, 
  MoveDownRight 
} from "lucide-react";

interface VehicleExpenseStatsCardProps {
  title: string;
  amount: number;
  description: string;
  icon: React.ReactNode;
  className?: string;
  secondaryValue?: string;
  colorScheme?: "blue" | "purple" | "amber" | "green" | "gray";
  previousAmount?: number;
}

export const VehicleExpenseStatsCard = ({
  title,
  amount,
  description,
  icon,
  className,
  secondaryValue,
  colorScheme = "gray", // Changé la valeur par défaut à "gray"
  previousAmount
}: VehicleExpenseStatsCardProps) => {
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
          card: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10",
          iconBg: "bg-purple-100 dark:bg-purple-800/40",
          iconText: "text-purple-600 dark:text-purple-300",
          title: "text-purple-900 dark:text-purple-300",
          amount: "text-purple-800 dark:text-purple-200",
          description: "text-purple-600/80 dark:text-purple-400/90"
        };
      case "amber":
        return {
          card: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10",
          iconBg: "bg-amber-100 dark:bg-amber-800/40",
          iconText: "text-amber-600 dark:text-amber-300",
          title: "text-amber-900 dark:text-amber-300",
          amount: "text-amber-800 dark:text-amber-200",
          description: "text-amber-600/80 dark:text-amber-400/90"
        };
      case "green":
        return {
          card: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10",
          iconBg: "bg-green-100 dark:bg-green-800/40",
          iconText: "text-green-600 dark:text-green-300",
          title: "text-green-900 dark:text-green-300",
          amount: "text-green-800 dark:text-green-200",
          description: "text-green-600/80 dark:text-green-400/90"
        };
      case "blue":
        return {
          card: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10",
          iconBg: "bg-blue-100 dark:bg-blue-800/40",
          iconText: "text-blue-600 dark:text-blue-300",
          title: "text-blue-900 dark:text-blue-300",
          amount: "text-blue-800 dark:text-blue-200",
          description: "text-blue-600/80 dark:text-blue-400/90"
        };
      default: // gray
        return {
          card: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-700/20",
          iconBg: "bg-gray-100 dark:bg-gray-700/40",
          iconText: "text-gray-600 dark:text-gray-300",
          title: "text-gray-900 dark:text-gray-300",
          amount: "text-gray-800 dark:text-gray-200",
          description: "text-gray-600/80 dark:text-gray-400/90"
        };
    }
  };

  const colors = getColorStyles();

  return (
    <Card className={cn(
      "border shadow-sm overflow-hidden",
      colors.card,
      className
    )}>
      <div className="p-5">
        {/* En-tête avec titre et icône */}
        <div className="flex justify-between items-center">
          <h3 className={cn("text-lg font-medium", colors.title)}>{title}</h3>
          <div className={cn("p-2 rounded-lg", colors.iconBg)}>
            <div className={colors.iconText}>
              {icon}
            </div>
          </div>
        </div>
        
        {/* Montant principal */}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <p className={cn("text-2xl font-bold", colors.amount)}>
              {formatCurrency(amount)}
            </p>
            
            {/* Indicateur de variation */}
            {hasVariation && (
              <div className="flex items-center">
                {isIncrease ? (
                  <div className="flex items-center">
                    <div className="p-1 rounded-full bg-red-100/80 dark:bg-red-900/30">
                      <MoveUpRight className="h-3 w-3 text-red-500 dark:text-red-300" />
                    </div>
                    <span className="text-sm ml-1 text-red-500 dark:text-red-300">
                      +{Math.abs(percentageChange).toFixed(1)}%
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="p-1 rounded-full bg-green-100/80 dark:bg-green-900/30">
                      <MoveDownRight className="h-3 w-3 text-green-500 dark:text-green-300" />
                    </div>
                    <span className="text-sm ml-1 text-green-500 dark:text-green-300">
                      -{Math.abs(percentageChange).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Description */}
          <p className={cn("text-sm mt-1", colors.description)}>
            {description}
          </p>
          
          {/* Valeur secondaire optionnelle */}
          {secondaryValue && (
            <p className={cn("text-sm mt-2 font-medium", colors.amount)}>
              {secondaryValue}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
