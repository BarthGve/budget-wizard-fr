import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MoveUpRight, MoveDownRight, CalendarRange } from "lucide-react";
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
  
  const { totalAmount, percentageChange, periodLabel, comparisonValue } = useMemo(() => {
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
        periodLabel: "Mois en cours",
        comparisonValue: previousMonthTotal
      };
    } else {
      // Pour la vue annuelle, utilisez les totaux déjà calculés
      const yearPercentage = previousYearTotal === 0 
        ? 100 
        : ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100;
        
      return {
        totalAmount: currentYearTotal,
        percentageChange: yearPercentage,
        periodLabel: "Année en cours",
        comparisonValue: previousYearTotal
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
  
  // Palettes de couleurs adaptatives
  const cardStyle = useMemo(() => {
    // Palettes pour le mode clair
    const lightPalette = {
      gradientFrom: "from-violet-500",
      gradientVia: "via-purple-500",
      gradientTo: "to-indigo-600",
      textAccent: "text-purple-50",
      textDescription: "text-white/80",
      iconBackground: "bg-white/20",
      increaseColor: "text-red-300",
      decreaseColor: "text-emerald-300",
    };
    
    // Palettes pour le mode sombre
    const darkPalette = {
      gradientFrom: "from-violet-900",
      gradientVia: "via-purple-800",
      gradientTo: "to-indigo-900",
      textAccent: "text-purple-100",
      textDescription: "text-white/70",
      iconBackground: "bg-white/10",
      increaseColor: "text-red-300",
      decreaseColor: "text-emerald-300",
    };
    
    return isDarkMode ? darkPalette : lightPalette;
  }, [isDarkMode]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3 }}
    >
      <Card className={cn(
        "overflow-hidden shadow-lg transition-all duration-300 border-0",
        "bg-gradient-to-br",
        cardStyle.gradientFrom,
        cardStyle.gradientVia,
        cardStyle.gradientTo,
        isDarkMode ? "shadow-purple-900/30" : "shadow-purple-500/30",
        "hover:shadow-xl"
      )}>
        <CardHeader className="py-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className={cn("text-2xl flex items-center gap-2", cardStyle.textAccent)}>
              <div className={cn("p-2 rounded-full", cardStyle.iconBackground)}>
                <CalendarRange className="h-5 w-5 text-white" />
              </div>
              <span>Total des dépenses</span>
            </CardTitle>
          </div>
          <CardDescription className={cardStyle.textDescription}>
            {periodLabel}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-5">
          <div className="flex flex-col gap-4">
            <AnimatePresence mode="wait">
              <motion.p 
                key={totalAmount}
                className={cn("text-3xl font-bold", cardStyle.textAccent)}
                initial={hasChanged ? { opacity: 0, y: totalAmount > prevAmount ? 20 : -20 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: totalAmount > prevAmount ? -20 : 20 }}
                transition={{ duration: 0.3 }}
              >
                {formatCurrency(totalAmount)}
              </motion.p>
            </AnimatePresence>
            
            {comparisonValue > 0 && (
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                  isIncrease ? "bg-red-500/20" : "bg-emerald-500/20"
                )}>
                  {isIncrease ? (
                    <MoveUpRight className={cn("h-4 w-4", cardStyle.increaseColor)} />
                  ) : (
                    <MoveDownRight className={cn("h-4 w-4", cardStyle.decreaseColor)} />
                  )}
                  <span className={cn("font-medium text-sm", 
                    isIncrease ? cardStyle.increaseColor : cardStyle.decreaseColor
                  )}>
                    {Math.abs(percentageChange).toFixed(1)}%
                  </span>
                </div>
                <span className="text-white/70 text-sm">
                  {comparisonLabel}
                </span>
              </motion.div>
            )}
            
            {/* Version précédente du montant */}
            {comparisonValue > 0 && (
              <div className="mt-1 text-white/50 text-sm">
                Période précédente : {formatCurrency(comparisonValue)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
