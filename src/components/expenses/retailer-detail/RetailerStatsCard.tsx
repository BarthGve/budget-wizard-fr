import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign, 
  BarChart3
} from "lucide-react";

interface RetailerStatsCardProps {
  title: string;
  amount: number;
  count: number;
  label: string;
  className?: string;
  previousAmount?: number;  // Montant précédent pour calculer la variation
  colorScheme?: "blue" | "purple" | "green" | "orange" | "red";
  icon?: React.ReactNode;
}

export function RetailerStatsCard({ 
  title, 
  amount, 
  count, 
  label, 
  className,
  previousAmount,
  colorScheme = "blue",
  icon
}: RetailerStatsCardProps) {
  const hasVariation = previousAmount !== undefined && previousAmount !== 0;
  const percentageChange = hasVariation
    ? ((amount - previousAmount) / previousAmount) * 100
    : 0;
  const isIncrease = percentageChange > 0;
  const isNoChange = percentageChange === 0;

  // Configuration des schémas de couleur
  const colorSchemes = {
    blue: {
      background: "bg-gradient-to-br from-blue-600 to-blue-700",
      backgroundHover: "hover:from-blue-700 hover:to-blue-800",
      iconBackground: "bg-blue-500/30",
      badgeBackground: isIncrease ? "bg-red-500/20" : "bg-green-500/20",
      badgeText: isIncrease ? "text-red-200" : "text-green-200",
      iconColor: "text-blue-200",
      accentText: "text-blue-50",
      mainText: "text-white",
      secondaryText: "text-blue-100",
      darkMode: "dark:from-blue-800 dark:to-blue-900",
      borderColor: "border-blue-400/20",
      shadow: "shadow-blue-900/20"
    },
    purple: {
      background: "bg-gradient-to-br from-purple-600 to-purple-700",
      backgroundHover: "hover:from-purple-700 hover:to-purple-800",
      iconBackground: "bg-purple-500/30",
      badgeBackground: isIncrease ? "bg-red-500/20" : "bg-green-500/20",
      badgeText: isIncrease ? "text-red-200" : "text-green-200",
      iconColor: "text-purple-200",
      accentText: "text-purple-50",
      mainText: "text-white",
      secondaryText: "text-purple-100",
      darkMode: "dark:from-purple-800 dark:to-purple-900",
      borderColor: "border-purple-400/20",
      shadow: "shadow-purple-900/20"
    },
    green: {
      background: "bg-gradient-to-br from-emerald-600 to-emerald-700",
      backgroundHover: "hover:from-emerald-700 hover:to-emerald-800",
      iconBackground: "bg-emerald-500/30",
      badgeBackground: isIncrease ? "bg-red-500/20" : "bg-green-500/20",
      badgeText: isIncrease ? "text-red-200" : "text-green-200",
      iconColor: "text-emerald-200",
      accentText: "text-emerald-50",
      mainText: "text-white",
      secondaryText: "text-emerald-100",
      darkMode: "dark:from-emerald-800 dark:to-emerald-900",
      borderColor: "border-emerald-400/20",
      shadow: "shadow-emerald-900/20"
    },
    orange: {
      background: "bg-gradient-to-br from-orange-500 to-orange-600",
      backgroundHover: "hover:from-orange-600 hover:to-orange-700",
      iconBackground: "bg-orange-500/30",
      badgeBackground: isIncrease ? "bg-red-500/20" : "bg-green-500/20",
      badgeText: isIncrease ? "text-red-200" : "text-green-200",
      iconColor: "text-orange-200",
      accentText: "text-orange-50",
      mainText: "text-white",
      secondaryText: "text-orange-100",
      darkMode: "dark:from-orange-700 dark:to-orange-800",
      borderColor: "border-orange-400/20",
      shadow: "shadow-orange-900/20"
    },
    red: {
      background: "bg-gradient-to-br from-red-600 to-red-700",
      backgroundHover: "hover:from-red-700 hover:to-red-800",
      iconBackground: "bg-red-500/30",
      badgeBackground: isIncrease ? "bg-red-500/20" : "bg-green-500/20",
      badgeText: isIncrease ? "text-red-200" : "text-green-200",
      iconColor: "text-red-200",
      accentText: "text-red-50",
      mainText: "text-white",
      secondaryText: "text-red-100",
      darkMode: "dark:from-red-800 dark:to-red-900",
      borderColor: "border-red-400/20",
      shadow: "shadow-red-900/20"
    }
  };

  const colors = colorSchemes[colorScheme];

  // Formatage du pourcentage
  const formatPercentage = (value: number) => {
    if (Math.abs(value) < 0.1) return "0.1";
    return Math.abs(value).toFixed(1);
  };

  // Détermination de l'icône à afficher
  const displayIcon = icon || <DollarSign className={cn("h-5 w-5", colors.iconColor)} />;
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all",
      "border shadow-lg",
      colors.background,
      colors.backgroundHover,
      colors.darkMode,
      colors.borderColor,
      colors.shadow,
      className
    )}>
      <div className="p-6">
        {/* En-tête avec titre et icône */}
        <div className="flex items-center justify-between mb-4">
          <h3 className={cn("text-lg font-medium", colors.mainText)}>
            {title}
          </h3>
          <div className={cn(
            "flex items-center justify-center w-9 h-9 rounded-lg",
            colors.iconBackground
          )}>
            {displayIcon}
          </div>
        </div>
        
        {/* Montant principal */}
        <div className="space-y-4">
          <div>
            <p className={cn("text-3xl font-bold", colors.mainText)}>
              {formatCurrency(amount)}
            </p>
            <p className={cn("mt-1 text-sm font-medium", colors.secondaryText)}>
              {count.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} {label}
            </p>
          </div>
          
          {/* Section de variation */}
          {hasVariation && (
            <div className={cn(
              "flex items-center gap-2 mt-4 px-3 py-2 rounded-md",
              colors.badgeBackground
            )}>
              {isIncrease ? (
                <div className="flex items-center">
                  <TrendingUp className="h-3.5 w-3.5 mr-1" />
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              ) : isNoChange ? (
                <BarChart3 className="h-3.5 w-3.5" />
              ) : (
                <div className="flex items-center">
                  <TrendingDown className="h-3.5 w-3.5 mr-1" />
                  <ArrowDownRight className="h-3.5 w-3.5" />
                </div>
              )}
              
              <span className={cn("text-xs font-medium", colors.badgeText)}>
                {isNoChange ? (
                  "Pas de changement"
                ) : (
                  <>
                    {isIncrease ? "+" : "-"}{formatPercentage(percentageChange)}% par rapport à la période précédente
                  </>
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
