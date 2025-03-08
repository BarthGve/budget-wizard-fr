
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MoveUpRight, MoveDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";
import { startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, subYears } from "date-fns";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <Card className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="py-[16px]">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl text-white">Total des dépenses</CardTitle>
        </div>
        <CardDescription className="text-white opacity-80">
          {periodLabel}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <AnimatePresence mode="wait">
            <motion.p 
              key={totalAmount}
              className="text-2xl font-bold text-white"
              initial={hasChanged ? { opacity: 0, y: totalAmount > prevAmount ? 20 : -20 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: totalAmount > prevAmount ? -20 : 20 }}
              transition={{ duration: 0.3 }}
            >
              {formatCurrency(totalAmount)}
            </motion.p>
          </AnimatePresence>
          
          {(viewMode === 'yearly' && previousYearTotal > 0) || (viewMode === 'monthly' && percentageChange !== 0) ? (
            <div className="flex items-center gap-1">
              {isIncrease ? (
                <MoveUpRight className="h-4 w-4 text-red-400" />
              ) : (
                <MoveDownRight className="h-4 w-4 text-green-400" />
              )}
              <span className={cn("font-medium", 
                isIncrease ? "text-red-400" : "text-green-400"
              )}>
                {Math.abs(percentageChange).toFixed(1)}% {comparisonLabel}
              </span>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
