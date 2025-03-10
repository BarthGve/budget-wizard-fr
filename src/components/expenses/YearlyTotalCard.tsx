
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingDown, TrendingUp, ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";
import { startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, subYears, format } from "date-fns";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fr } from "date-fns/locale";

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
  
  const { totalAmount, percentageChange, periodLabel, periodDetail } = useMemo(() => {
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
        periodLabel: "Total mensuel",
        periodDetail: format(now, 'MMMM yyyy', { locale: fr })
      };
    } else {
      // Pour la vue annuelle, utilisez les totaux déjà calculés
      const yearPercentage = previousYearTotal === 0 
        ? 100 
        : ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100;
        
      return {
        totalAmount: currentYearTotal,
        percentageChange: yearPercentage,
        periodLabel: "Total annuel",
        periodDetail: format(now, 'yyyy')
      };
    }
  }, [expenses, viewMode, currentYearTotal, previousYearTotal]);

  // Effet pour détecter les changements de montant total
  useEffect(() => {
    setPrevAmount(totalAmount);
  }, [totalAmount]);

  const isIncrease = percentageChange > 0;
  const comparisonLabel = viewMode === 'monthly' ? "vs mois précédent" : "vs année précédente";
  const hasChanged = totalAmount !== prevAmount && prevAmount !== 0;
  
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {/* Fond avec dégradé bleu */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500" />
        
        {/* Effet de grille */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        
        {/* Effet de lumière */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-300 rounded-full opacity-20 blur-3xl"></div>
        
        {/* Contenu */}
        <div className="relative">
          <CardHeader className="py-4 flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-2xl text-white font-bold">{periodLabel}</CardTitle>
              <CardDescription className="text-white/80 font-medium">
                {periodDetail}
              </CardDescription>
            </div>
            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
              <ReceiptText className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          
          <CardContent className="pb-6">
            <div className="flex flex-col gap-3">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={totalAmount}
                  className="flex items-baseline gap-1"
                  initial={hasChanged ? { opacity: 0, y: totalAmount > prevAmount ? 20 : -20 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: totalAmount > prevAmount ? -20 : 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-3xl font-bold text-white">
                    {formatCurrency(totalAmount)}
                  </span>
                </motion.div>
              </AnimatePresence>
              
              {(viewMode === 'yearly' && previousYearTotal > 0) || (viewMode === 'monthly' && percentageChange !== 0) ? (
                <div className="flex items-center gap-2 p-1.5 px-3 bg-white/10 backdrop-blur-sm rounded-full w-fit">
                  {isIncrease ? (
                    <TrendingUp className="h-4 w-4 text-red-300" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-300" />
                  )}
                  <span className={cn("text-sm font-medium", 
                    isIncrease ? "text-red-300" : "text-green-300"
                  )}>
                    {Math.abs(percentageChange).toFixed(1)}% {comparisonLabel}
                  </span>
                </div>
              ) : null}
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
