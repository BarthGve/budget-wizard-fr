
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";

interface AmountsSectionProps {
  savedAmount: number;
  totalAmount: number;
}

export const AmountsSection = ({ savedAmount, totalAmount }: AmountsSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 pb-1">
      <div className={cn(
        "p-2.5 rounded-lg",
        // Light mode
        "bg-quaternary-50 border border-quaternary-100",
        // Dark mode
        "dark:bg-quaternary-900/20 dark:border-quaternary-800/30"
      )}>
        <p className="text-xs text-muted-foreground mb-1">Épargné</p>
        <p className={cn(
          "font-bold",
          "text-quaternary-700 dark:text-quaternary-300"
        )}>
          {formatCurrency(savedAmount,0)}
        </p>
      </div>
      
      <div className={cn(
        "p-2.5 rounded-lg",
        // Light mode
        "bg-gray-50 border border-gray-200",
        // Dark mode
        "dark:bg-gray-800 dark:border-gray-700"
      )}>
        <p className="text-xs text-muted-foreground mb-1">Objectif</p>
        <p className="font-bold">
          {formatCurrency(totalAmount,0)}
        </p>
      </div>
    </div>
  );
};
