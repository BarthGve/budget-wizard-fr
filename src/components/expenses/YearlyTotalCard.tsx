
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingDown, TrendingUp, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
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
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-200 h-full relative",
        "border shadow-lg",
        // Light mode
        "bg-white border-tertiary-100",
        // Dark mode
        "dark:bg-gray-800/90 dark:border-tertiary-800/50"
      )}>
        
        
        <CardHeader className="pb-2 pt-6 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className={cn(
                // Light mode
                "text-tertiary-700",
                // Dark mode
                "dark:bg-tertiary-800/40 dark:text-tertiary-300",
                // Common
                "p-2 rounded-lg"
              )}>
                <PieChart className="h-4 w-4" />
              </div>
              <CardTitle className={cn(
                "text-lg font-semibold",
               
           
              )}>
                Total des dépenses
              </CardTitle>
            </div>
          </div>
          
          <CardDescription className={cn(
            "mt-2 text-sm",
            // Light mode
            "text-tertiary-600/80",
            // Dark mode
            "dark:text-tertiary-400/90"
          )}>
            {periodLabel}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-1 pb-6 relative z-10">
          <AnimatePresence mode="wait">
            <motion.p 
              key={`total-${totalAmount}`}
              className={cn(
                "text-2xl font-bold",
              )}
              initial={hasChanged ? { opacity: 0, y: totalAmount > prevAmount ? 20 : -20 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: totalAmount > prevAmount ? -20 : 20 }}
              transition={{ duration: 0.3 }}
            >
              {formatCurrency(totalAmount)}
            </motion.p>
          </AnimatePresence>
          
          {(viewMode === 'yearly' && previousYearTotal > 0) || (viewMode === 'monthly' && percentageChange !== 0) ? (
            <div className={cn(
              "flex items-center mt-3 gap-1.5",
            )}>
              <div className={cn(
                "p-1.5 rounded",
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
                "text-sm font-medium", 
                // Light mode
                isIncrease ? "text-red-600" : "text-green-600",
                // Dark mode
                isIncrease ? "dark:text-red-300" : "dark:text-green-300"
              )}>
                {Math.abs(percentageChange).toFixed(1)}%
              </span>
              
              <span className={cn(
                "text-xs text-gray-500 dark:text-gray-400"
              )}>
                {comparisonLabel}
              </span>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}
