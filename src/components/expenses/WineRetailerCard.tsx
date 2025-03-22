
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { startOfYear, endOfYear, subYears, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Store, PlusCircle, TrendingDown, TrendingUp, Wine, GlassWater } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AddExpenseDialog } from "./AddExpenseDialog";
import { RetailerExpensesDialog } from "./RetailerExpensesDialog";

interface WineRetailerCardProps {
  retailer: {
    id: string;
    name: string;
    logo_url?: string;
  };
  expenses: Array<{
    id: string;
    date: string;
    amount: number;
    comment?: string;
  }>;
  onExpenseUpdated: () => void;
  viewMode: "monthly" | "yearly";
  colorScheme?: "burgundy" | "bordeaux" | "champagne";
}

export function WineRetailerCard({
  retailer,
  expenses,
  onExpenseUpdated,
  viewMode,
  colorScheme = "burgundy",
}: WineRetailerCardProps) {
  const [expensesDialogOpen, setExpensesDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [prevTotal, setPrevTotal] = useState(0);
  const now = new Date();

  const { totalCurrentPeriod, totalPreviousPeriod, percentageChange, periodLabel } = useMemo(() => {
    if (viewMode === "monthly") {
      const currentMonthStart = startOfMonth(now);
      const currentMonthEnd = endOfMonth(now);

      const currentMonthExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= currentMonthStart && expenseDate <= currentMonthEnd;
      });

      const totalCurrentMonth = currentMonthExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      const previousMonthStart = startOfMonth(subMonths(now, 1));
      const previousMonthEnd = endOfMonth(subMonths(now, 1));

      const previousMonthExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= previousMonthStart && expenseDate <= previousMonthEnd;
      });

      const totalPreviousMonth = previousMonthExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      const monthPercentageChange =
        totalPreviousMonth === 0
          ? 100
          : ((totalCurrentMonth - totalPreviousMonth) / totalPreviousMonth) * 100;

      return {
        totalCurrentPeriod: totalCurrentMonth,
        totalPreviousPeriod: totalPreviousMonth,
        percentageChange: monthPercentageChange,
        periodLabel: "Mois en cours",
      };
    } else {
      const currentYearStart = startOfYear(now);
      const currentYearEnd = endOfYear(now);

      const currentYearExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= currentYearStart && expenseDate <= currentYearEnd;
      });

      const totalCurrentYear = currentYearExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      const lastYearStart = startOfYear(subYears(now, 1));
      const lastYearEnd = endOfYear(subYears(now, 1));

      const lastYearExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= lastYearStart && expenseDate <= lastYearEnd;
      });

      const totalLastYear = lastYearExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      const yearPercentageChange =
        totalLastYear === 0
          ? 100
          : ((totalCurrentYear - totalLastYear) / totalLastYear) * 100;

      return {
        totalCurrentPeriod: totalCurrentYear,
        totalPreviousPeriod: totalLastYear,
        percentageChange: yearPercentageChange,
        periodLabel: "Année en cours",
      };
    }
  }, [viewMode, expenses, now]);

  // Effet pour détecter les changements de montant total
  useEffect(() => {
    setPrevTotal(totalCurrentPeriod);
  }, [totalCurrentPeriod]);

  const handleExpenseUpdated = useCallback(() => {
    setExpensesDialogOpen(false);
    setAddDialogOpen(false);
    onExpenseUpdated();
  }, [onExpenseUpdated]);

  // Détermine les couleurs du composant selon le colorScheme fourni
  const getColorStyles = () => {
    switch (colorScheme) {
      case "bordeaux":
        return {
          gradientFrom: "from-red-900/80",
          gradientTo: "to-red-800/50", 
          textColor: "text-red-50",
          accentColor: "bg-red-700",
          borderColor: "border-red-900/30",
          iconBg: "bg-red-800/70",
          iconColor: "text-red-200",
          hoverBg: "hover:bg-red-800/60",
          darkFrom: "dark:from-red-900/40",
          darkTo: "dark:to-red-950/80",
          darkBorder: "dark:border-red-900/20",
          darkText: "dark:text-red-100",
          darkAccent: "dark:bg-red-800/40",
        };
      case "champagne":
        return {
          gradientFrom: "from-amber-100/90",
          gradientTo: "to-amber-200/50",
          textColor: "text-amber-900",
          accentColor: "bg-amber-200",
          borderColor: "border-amber-200/80",
          iconBg: "bg-amber-300/70",
          iconColor: "text-amber-800",
          hoverBg: "hover:bg-amber-100",
          darkFrom: "dark:from-amber-800/30",
          darkTo: "dark:to-amber-900/60",
          darkBorder: "dark:border-amber-700/30",
          darkText: "dark:text-amber-100",
          darkAccent: "dark:bg-amber-700/40",
        };
      default: // burgundy
        return {
          gradientFrom: "from-purple-900/80",
          gradientTo: "to-purple-800/50",
          textColor: "text-purple-50",
          accentColor: "bg-purple-700",
          borderColor: "border-purple-900/30",
          iconBg: "bg-purple-800/70",
          iconColor: "text-purple-200",
          hoverBg: "hover:bg-purple-800/60",
          darkFrom: "dark:from-purple-900/40",
          darkTo: "dark:to-purple-950/80",
          darkBorder: "dark:border-purple-900/20",
          darkText: "dark:text-purple-100",
          darkAccent: "dark:bg-purple-800/40",
        };
    }
  };

  const colors = getColorStyles();

  // Déterminer si le montant a augmenté ou diminué pour l'animation
  const hasIncreased = totalCurrentPeriod > prevTotal;
  const hasChanged = totalCurrentPeriod !== prevTotal && prevTotal !== 0;
  const isIncrease = percentageChange > 0;
  const comparisonLabel = viewMode === 'monthly' ? "vs mois précédent" : "vs année précédente";

  return (
    <>
      <Card 
        className={cn(
          "overflow-hidden transition-all duration-300 h-full relative",
          "border shadow-md hover:shadow-lg hover:translate-y-[-5px]",
          "bg-gradient-to-br", colors.gradientFrom, colors.gradientTo,
          colors.borderColor,
          "dark:bg-gradient-to-br", colors.darkFrom, colors.darkTo,
          colors.darkBorder,
          "rounded-xl"
        )}
      >
        {/* Décoration bouteille de vin (très subtile) */}
        <div className={cn(
          "absolute right-0 top-0 opacity-10 w-32 h-32 -rotate-12 transform translate-x-8 -translate-y-2",
          "dark:opacity-5"
        )}>
          <Wine className="w-full h-full" />
        </div>
        
        <div className="p-5 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {retailer.logo_url ? (
                <div className={cn(
                  "rounded-full overflow-hidden border-2",
                  "w-12 h-12 flex items-center justify-center",
                  colors.borderColor, "bg-white/90",
                  "dark:bg-black/30", colors.darkBorder
                )}>
                  <img 
                    src={retailer.logo_url} 
                    alt={retailer.name} 
                    className="w-10 h-10 object-contain rounded-full"
                  />
                </div>
              ) : (
                <div className={cn(
                  "p-2.5 rounded-full",
                  colors.iconBg, colors.iconColor,
                  "w-12 h-12 flex items-center justify-center"
                )}>
                  <GlassWater className="h-6 w-6" />
                </div>
              )}
              
              <Link 
                to={`/expenses/retailer/${retailer.id}`}
                className={cn(
                  "text-xl font-medium transition-colors",
                  colors.textColor, "hover:underline",
                  colors.darkText
                )}
              >
                {retailer.name}
              </Link>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-full h-9 w-9 p-0",
                colors.accentColor, colors.textColor, colors.hoverBg,
                colors.darkAccent, colors.darkText
              )}
              onClick={() => setAddDialogOpen(true)}
            >
              <PlusCircle className="h-5 w-5" />
              <span className="sr-only">Ajouter une dépense pour {retailer.name}</span>
            </Button>
          </div>
          
          <div className="space-y-3 pt-2">
            <div>
              <div className={cn(
                "text-xs opacity-80",
                colors.textColor,
                colors.darkText
              )}>
                {periodLabel}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={totalCurrentPeriod}
                    initial={hasChanged ? { opacity: 0, y: hasIncreased ? 20 : -20 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: hasIncreased ? -20 : 20 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "text-3xl font-bold",
                      colors.textColor,
                      colors.darkText
                    )}
                  >
                    {formatCurrency(totalCurrentPeriod)}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            
            {totalPreviousPeriod > 0 && (
              <div className={cn(
                "flex items-center gap-1.5 text-sm",
                "bg-black/10 dark:bg-white/10 rounded-full px-3 py-1 w-fit"
              )}>
                <div className={cn(
                  "p-1 rounded-full",
                  isIncrease ? "bg-red-500/20" : "bg-green-500/20",
                )}>
                  {isIncrease ? (
                    <TrendingUp className={cn(
                      "h-3.5 w-3.5",
                      "text-red-200 dark:text-red-300"
                    )} />
                  ) : (
                    <TrendingDown className={cn(
                      "h-3.5 w-3.5",
                      "text-green-200 dark:text-green-300"
                    )} />
                  )}
                </div>
                
                <span className={cn(
                  "font-medium", 
                  isIncrease ? "text-red-200" : "text-green-200",
                )}>
                  {Math.abs(percentageChange).toFixed(1)}%
                </span>
                
                <span className={cn(
                  "text-xs opacity-80",
                  colors.textColor,
                  colors.darkText
                )}>
                  {comparisonLabel}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>

      <RetailerExpensesDialog
        retailer={retailer}
        expenses={expenses}
        open={expensesDialogOpen}
        onOpenChange={setExpensesDialogOpen}
        onExpenseUpdated={handleExpenseUpdated}
      />

      <AddExpenseDialog
        onExpenseAdded={handleExpenseUpdated}
        preSelectedRetailer={retailer}
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />
    </>
  );
}
