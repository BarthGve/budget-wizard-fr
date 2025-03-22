
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PercentageChangeProps {
  isIncrease: boolean;
  percentageChange: number;
  comparisonLabel: string;
  showIndicator: boolean;
}

export function PercentageChange({ 
  isIncrease, 
  percentageChange, 
  comparisonLabel, 
  showIndicator
}: PercentageChangeProps) {
  if (!showIndicator) return null;
  
  return (
    <div className={cn(
      "flex items-center gap-1.5 text-sm",
    )}>
      <div className={cn(
        "p-1 rounded",
        // Light mode - background
        isIncrease ? "bg-red-100" : "bg-green-100",
        // Dark mode - background
        isIncrease ? "dark:bg-red-900/30" : "dark:bg-green-900/30",
      )}>
        {isIncrease ? (
          <TrendingUp className={cn(
            "h-3 w-3",
            "text-red-600 dark:text-red-300"
          )} />
        ) : (
          <TrendingDown className={cn(
            "h-3 w-3",
            "text-green-600 dark:text-green-300"
          )} />
        )}
      </div>
      
      <span className={cn(
        "font-medium", 
        // Light mode
        isIncrease ? "text-red-600" : "text-green-600",
        // Dark mode
        isIncrease ? "dark:text-red-300" : "dark:text-green-300"
      )}>
        {Math.abs(percentageChange).toFixed(1)}%
      </span>
      
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {comparisonLabel}
      </span>
    </div>
  );
}
