import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { startOfYear, endOfYear, subYears, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { useState, useMemo, useCallback, useEffect } from "react";
import { RetailerExpensesDialog } from "./RetailerExpensesDialog";
import { PlusCircle, TrendingDown, TrendingUp, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddExpenseDialog } from "./AddExpenseDialog";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

interface RetailerCardProps {
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
  viewMode: 'monthly' | 'yearly';
}

export function RetailerCard({ retailer, expenses, onExpenseUpdated, viewMode }: RetailerCardProps) {
  const [expensesDialogOpen, setExpensesDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [prevTotal, setPrevTotal] = useState(0);
  const now = new Date();
  
  const { 
    totalCurrentPeriod, 
    totalPreviousPeriod, 
    percentageChange,
    periodLabel 
  } = useMemo(() => {
    // Calculs pour le mode mensuel
    if (viewMode === 'monthly') {
      const currentMonthStart = startOfMonth(now);
      const currentMonthEnd = endOfMonth(now);
      
      const currentMonthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= currentMonthStart && expenseDate <= currentMonthEnd;
      });
      
      const totalCurrentMonth = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      const previousMonthStart = startOfMonth(subMonths(now, 1));
      const previousMonthEnd = endOfMonth(subMonths(now, 1));
      
      const previousMonthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= previousMonthStart && expenseDate <= previousMonthEnd;
      });
      
      const totalPreviousMonth = previousMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      const monthPercentageChange = totalPreviousMonth === 0 
        ? 100 
        : ((totalCurrentMonth - totalPreviousMonth) / totalPreviousMonth) * 100;
        
      return { 
        totalCurrentPeriod: totalCurrentMonth, 
        totalPreviousPeriod: totalPreviousMonth, 
        percentageChange: monthPercentageChange,
        periodLabel: "Mois en cours"
      };
    } 
    // Calculs pour le mode annuel
    else {
      const currentYearStart = startOfYear(now);
      const currentYearEnd = endOfYear(now);
      
      const currentYearExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= currentYearStart && expenseDate <= currentYearEnd;
      });
      
      const totalCurrentYear = currentYearExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      const lastYearStart = startOfYear(subYears(now, 1));
      const lastYearEnd = endOfYear(subYears(now, 1));
      
      const lastYearExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= lastYearStart && expenseDate <= lastYearEnd;
      });
      
      const totalLastYear = lastYearExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      const yearPercentageChange = totalLastYear === 0 
        ? 100 
        : ((totalCurrentYear - totalLastYear) / totalLastYear) * 100;
        
      return { 
        totalCurrentPeriod: totalCurrentYear, 
        totalPreviousPeriod: totalLastYear, 
        percentageChange: yearPercentageChange,
        periodLabel: "Année en cours"
      };
    }
  }, [expenses, now, viewMode]);

  // Effet pour détecter les changements de montant total
  useEffect(() => {
    setPrevTotal(totalCurrentPeriod);
  }, [totalCurrentPeriod]);

  const handleExpenseUpdated = useCallback(() => {
    setExpensesDialogOpen(false);
    setAddDialogOpen(false);
    onExpenseUpdated();
  }, [onExpenseUpdated]);

  // Déterminer si le montant a augmenté ou diminué pour l'animation
  const hasIncreased = totalCurrentPeriod > prevTotal;
  const hasChanged = totalCurrentPeriod !== prevTotal && prevTotal !== 0;
  const isIncrease = percentageChange > 0;
  const comparisonLabel = viewMode === 'monthly' ? "vs mois précédent" : "vs année précédente";

  return (
    <>
      <Card 
        className={cn(
          "overflow-hidden transition-all duration-200 h-full relative",
          "border shadow-sm hover:shadow-md hover:translate-y-[-5px]",
          "bg-white border-gray-100",
          "dark:bg-gray-800/90 dark:hover:bg-gray-800/70 dark:border-gray-700/50"
        )}
      >
        {/* Fond radial gradient ultra-subtil */}
        <div className={cn(
          "absolute inset-0",
          "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.01]",
          "dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.015]"
        )} />
        
        <div className="p-5 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {retailer.logo_url ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={cn(
                        "rounded-full overflow-hidden border",
                        "border-gray-100 dark:border-gray-700",
                        "w-10 h-10 flex items-center justify-center"
                      )}>
                        <img 
                          src={retailer.logo_url} 
                          alt={retailer.name} 
                          className="w-9 h-9 object-contain rounded-full"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{retailer.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <div className={cn(
                  "p-2 rounded-full",
                  "bg-gray-100 text-gray-700",
                  "dark:bg-gray-800 dark:text-gray-300"
                )}>
                  <Store className="h-4 w-4" />
                </div>
              )}
              
              <Link 
                to={`/expenses/retailer/${retailer.id}`}
                className={cn(
                  "text-lg font-medium transition-colors",
                  // Teinte bleue pour le nom de l'enseigne
                  "text-blue-900 hover:text-blue-600",
                  // Dark mode
                  "dark:text-blue-300 dark:hover:text-blue-400"
                )}
              >
                {retailer.name}
              </Link>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-full h-8 w-8 p-0",
                "bg-gray-100 text-gray-700 hover:bg-gray-200",
                "dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              )}
              onClick={() => setAddDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only">Ajouter une dépense pour {retailer.name}</span>
            </Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
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
                      "text-2xl font-bold",
                      // Teinte bleue pour le montant
                      "text-blue-800 dark:text-blue-200"
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
