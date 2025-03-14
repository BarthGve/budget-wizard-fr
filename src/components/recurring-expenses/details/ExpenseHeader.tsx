
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DialogTitle } from "@/components/ui/dialog";
import { RecurringExpense, periodicityLabels } from "../types";

interface ExpenseHeaderProps {
  expense: RecurringExpense;
}

export const ExpenseHeader = ({ expense }: ExpenseHeaderProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div className={cn(
      "relative overflow-hidden py-6 px-6",
      // Light mode
      "bg-gradient-to-br from-blue-50 to-white",
      // Dark mode
      "dark:bg-gradient-to-br dark:from-blue-900/20 dark:to-gray-800/90"
    )}>
      {/* Cercle décoratif en arrière-plan */}
      <div className={cn(
        "absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20",
        // Light mode
        "bg-gradient-to-br from-blue-400 to-blue-600",
        // Dark mode
        "dark:from-blue-500 dark:to-blue-700 dark:opacity-10"
      )} />

      <div className="flex items-center gap-4 relative z-10">
        {expense.logo_url ? (
          <div className={cn(
            "w-14 h-14 rounded-lg p-2 flex items-center justify-center overflow-hidden",
            // Light mode
            "bg-white shadow-sm border border-gray-200",
            // Dark mode
            "dark:bg-gray-800 dark:border-gray-700"
          )}>
            <img
              src={expense.logo_url}
              alt={expense.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          </div>
        ) : (
          <div className={cn(
            "w-14 h-14 rounded-lg flex items-center justify-center",
            // Light mode
            "bg-blue-100 text-blue-600",
            // Dark mode
            "dark:bg-blue-800/40 dark:text-blue-400"
          )}>
            <CreditCard size={24} />
          </div>
        )}
        
        <div>
          <DialogTitle className={cn(
            "text-xl font-bold pb-1",
            // Light mode
            "text-gray-800",
            // Dark mode
            "dark:text-gray-100"
          )}>
            {expense.name}
          </DialogTitle>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn(
              "h-6 font-medium border px-2 py-0",
              // Light mode
              "bg-blue-50 border-blue-200 text-blue-700",
              // Dark mode
              "dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300"
            )}>
              {expense.amount.toLocaleString('fr-FR')} €/
              {expense.periodicity === "monthly" ? "mois" : 
                expense.periodicity === "quarterly" ? "trim." : "an"}
            </Badge>
            
            <Badge variant="outline" className={cn(
              "h-6 font-medium border px-2 py-0",
              // Light mode
              "bg-gray-50 border-gray-200 text-gray-700",
              // Dark mode
              "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            )}>
              {expense.category}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
