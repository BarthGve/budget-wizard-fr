import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { startOfYear, endOfYear, subYears, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { useState, useMemo, useCallback, useEffect } from "react";
import { RetailerExpensesDialog } from "./RetailerExpensesDialog";
import { MoveDownRight, MoveUpRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddExpenseDialog } from "./AddExpenseDialog";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
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
  const [isUpdating, setIsUpdating] = useState(false);
  const now = new Date();
  const queryClient = useQueryClient();
  
  const { 
    totalCurrentPeriod, 
    totalPreviousPeriod, 
    percentageChange 
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
        percentageChange: monthPercentageChange 
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
        percentageChange: yearPercentageChange 
      };
    }
  }, [expenses, now, viewMode]);

  useEffect(() => {
    if (!retailer?.id) return;
    
    const channelId = `retailer-expense-${retailer.id}-${Date.now()}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*', // Tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'expenses',
          filter: `retailer_id=eq.${retailer.id}`
        },
        (payload) => {
          console.log(`Dépense modifiée pour ${retailer.name}:`, payload);
          
          setIsUpdating(true);
          setTimeout(() => setIsUpdating(false), 800);
          
          queryClient.invalidateQueries({ 
            queryKey: ["expenses"],
            exact: true
          });
          
          onExpenseUpdated();
        }
      )
      .subscribe((status) => {
        console.log(`Statut du canal pour ${retailer.name}:`, status);
      });
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [retailer.id, queryClient, onExpenseUpdated, retailer.name]);

  const handleExpenseUpdated = useCallback(() => {
    setExpensesDialogOpen(false);
    setAddDialogOpen(false);
    onExpenseUpdated();
  }, [onExpenseUpdated]);

  return (
    <>
      <AnimatePresence>
        <motion.div
          key={`${retailer.id}-${totalCurrentPeriod}`}
          initial={{ opacity: isUpdating ? 0.5 : 1, scale: isUpdating ? 0.98 : 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.5, scale: 0.98 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={`p-6 hover:shadow-md transition-all overflow-hidden ${isUpdating ? 'ring-2 ring-primary/50' : ''}`}>
            <div className="flex items-center justify-between">
              <Link 
                to={`/expenses/retailer/${retailer.id}`} 
                className="text-xl font-semibold hover:text-primary  transition-colors"
              >
                {retailer.name}
              </Link>
              {retailer.logo_url && (
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-10 h-10 p-0 rounded-full"
                          onClick={() => setAddDialogOpen(true)}
                        >
                          <img 
                            src={retailer.logo_url} 
                            alt={retailer.name} 
                            className="w-10 h-10 rounded-full object-contain"
                          />
                          <span className="sr-only">Ajouter une dépense pour {retailer.name}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ajouter une dépense</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="text-2xl font-bold">
                {formatCurrency(totalCurrentPeriod)}
              </div>
              {totalPreviousPeriod > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  {percentageChange > 0 ? (
                    <MoveUpRight className="h-4 w-4 text-red-500" />
                  ) : (
                    <MoveDownRight className="h-4 w-4 text-green-500" />
                  )}
                  <span className={cn("text-sm", 
                    percentageChange > 0 ? "text-red-500" : "text-green-500"
                  )}>
                    {Math.abs(percentageChange).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

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
