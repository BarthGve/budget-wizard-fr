import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MoveUpRight, MoveDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";
import { startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, subYears } from "date-fns";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

interface YearlyTotalCardProps {
  currentYearTotal: number;
  previousYearTotal: number;
  expenses: Array<{
    id: string;
    date: string;
    amount: number;
  }>;
  viewMode: 'monthly' | 'yearly';
}

export function YearlyTotalCard({ currentYearTotal, previousYearTotal, expenses, viewMode }: YearlyTotalCardProps) {
  const [prevAmount, setPrevAmount] = useState(0);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  const { totalAmount, percentageChange, periodLabel } = useMemo(() => {
    const now = new Date();
    
    if (viewMode === 'monthly') {
      // Calcul pour le mois en cours
      const currentMonthStart = startOfMonth(now);
      const currentMonthEnd = endOfMonth(now);
      
      const currentMonthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= currentMonthStart && expenseDate <= currentMonthEnd;
      });
      
      const monthTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      // Calcul pour le mois précédent
      const previousMonthStart = startOfMonth(subMonths(now, 1));
      const previousMonthEnd = endOfMonth(subMonths(now, 1));
      
      const previousMonthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= previousMonthStart && expenseDate <= previousMonthEnd;
      });
      
      const previousMonthTotal = previousMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      // Calcul du pourcentage de changement
      const monthPercentage = previousMonthTotal === 0 
        ? 100 
        : ((monthTotal - previousMonthTotal) / previousMonthTotal) * 100;
        
      return {
        totalAmount: monthTotal,
        percentageChange: monthPercentage,
        periodLabel: "Mois en cours"
      };
    } else {
      // Pour la vue annuelle, utilisez les totaux déjà calculés
      const yearPercentage = previousYearTotal === 0 
        ? 100 
        : ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100;
        
      return {
        totalAmount: currentYearTotal,
        percentageChange: yearPercentage,
        periodLabel: "Année en cours"
      };
    }
  }, [expenses, viewMode, currentYearTotal, previousYearTotal]);

  // Effet pour détecter les changements de montant total
  useEffect(() => {
    setPrevAmount(totalAmount);
  }, [totalAmount]);

  const isIncrease = percentageChange > 0;
  const comparisonLabel = viewMode === 'monthly' ? "par rapport au mois précédent" : "par rapport à l'année précédente";
  const hasChanged = totalAmount !== prevAmount && prevAmount !== 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-xl",
        // Light mode
        "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-md",
        // Dark mode
        "dark:bg-gradient-to-br dark:from-blue-900/30 dark:to-blue-800/20 dark:border-blue-800/50 dark:shadow-blue-900/20"
      )}>
        <CardHeader className={cn("py-4 relative overflow-hidden")}>
          <div className={cn(
            "absolute inset-0 opacity-10 mix-blend-multiply",
            // Light mode
            "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-blue-300 to-transparent",
            // Dark mode
            "dark:bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] dark:from-blue-400 dark:via-blue-500 dark:to-transparent dark:opacity-5"
          )} />
          
          <div className="flex flex-row items-center justify-between">
            <CardTitle className={cn(
              "text-xl",
              // Light mode
              "text-blue-700",
              // Dark mode
              "dark:text-blue-300"
            )}>
              Total des dépenses
            </CardTitle>
          </div>
          <CardDescription className={cn(
            "font-medium", 
            // Light mode
            "text-blue-600/80",
            // Dark mode
            "dark:text-blue-400/90"
          )}>
            {periodLabel}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-5">
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={totalAmount}
                className={cn(
                  "flex items-baseline",
                  hasChanged ? "overflow-hidden" : ""
                )}
                initial={false}
              >
                <motion.p 
                  key={`total-${totalAmount}`}
                  className={cn(
                    "text-3xl font-bold tracking-tight",
                    // Light mode
                    "text-blue-700",
                    // Dark mode
                    "dark:text-blue-300"
                  )}
                  initial={hasChanged ? { opacity: 0, y: totalAmount > prevAmount ? 20 : -20 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: totalAmount > prevAmount ? -20 : 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {formatCurrency(totalAmount)}
                </motion.p>
              </motion.div>
            </AnimatePresence>
            
            {(viewMode === 'yearly' && previousYearTotal > 0) || (viewMode === 'monthly' && percentageChange !== 0) ? (
              <div className={cn(
                "p-2.5 rounded-md flex items-center gap-2",
                // Light mode - background
                isIncrease ? "bg-red-50" : "bg-green-50",
                // Dark mode - background
                isIncrease ? "dark:bg-red-950/30" : "dark:bg-green-950/30",
                // Border
                isIncrease ? "border border-red-100 dark:border-red-900/40" : "border border-green-100 dark:border-green-900/40"
              )}>
                {isIncrease ? (
                  <MoveUpRight className={cn(
                    "h-4 w-4",
                    // Light mode
                    "text-red-500",
                    // Dark mode
                    "dark:text-red-400"
                  )} />
                ) : (
                  <MoveDownRight className={cn(
                    "h-4 w-4",
                    // Light mode
                    "text-green-500",
                    // Dark mode
                    "dark:text-green-400"
                  )} />
                )}
                <div className="flex flex-col">
                  <span className={cn(
                    "text-sm font-semibold", 
                    // Light mode
                    isIncrease ? "text-red-700" : "text-green-700",
                    // Dark mode
                    isIncrease ? "dark:text-red-300" : "dark:text-green-300"
                  )}>
                    {Math.abs(percentageChange).toFixed(1)}%
                  </span>
                  <span className={cn(
                    "text-xs",
                    // Light mode
                    isIncrease ? "text-red-600/80" : "text-green-600/80",
                    // Dark mode
                    isIncrease ? "dark:text-red-400/90" : "dark:text-green-400/90"
                  )}>
                    {comparisonLabel}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
