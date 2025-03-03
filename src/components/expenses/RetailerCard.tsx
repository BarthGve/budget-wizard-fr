
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { ExpensesChart } from "./ExpensesChart";
import { startOfYear, endOfYear, subYears } from "date-fns";
import { useState, useMemo, useCallback } from "react";
import { RetailerExpensesDialog } from "./RetailerExpensesDialog";
import { MoveDownRight, MoveUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddExpenseDialog } from "./AddExpenseDialog";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const now = new Date();
  
  // Mémorisation des calculs coûteux
  const { currentYearExpenses, totalCurrentYear, totalLastYear, percentageChange } = useMemo(() => {
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

    const percentageChange = totalLastYear === 0 
      ? 100 
      : ((totalCurrentYear - totalLastYear) / totalLastYear) * 100;
      
    return { currentYearExpenses, totalCurrentYear, totalLastYear, percentageChange };
  }, [expenses, now]);

  // Optimisation avec useCallback
  const handleExpenseUpdated = useCallback(() => {
    setExpensesDialogOpen(false);
    setAddDialogOpen(false);
    onExpenseUpdated();
  }, [onExpenseUpdated]);

  const handleRetailerNameClick = () => {
    navigate(`/depenses/enseigne/${retailer.id}`);
  };

  return (
    <>
      <Card className="pb-0 pt-6 px-6">
        <div 
          className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleRetailerNameClick}
        >
          <h3 className="text-xl font-semibold">{retailer.name}</h3>
          {retailer.logo_url && (
            <img 
              src={retailer.logo_url} 
              alt={retailer.name} 
              className="w-10 h-10 rounded-full object-contain"
            />
          )}
        </div>
        <div 
          className="mt-4 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setExpensesDialogOpen(true)}
        >
          <div className="text-2xl font-bold">
            {formatCurrency(totalCurrentYear)}
          </div>
          {totalLastYear > 0 && (
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
        <ExpensesChart expenses={expenses} viewMode={viewMode} />
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
