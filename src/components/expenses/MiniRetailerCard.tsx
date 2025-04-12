import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { Store, PlusCircle, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { AddExpenseDialog } from "./AddExpenseDialog";

interface MiniRetailerCardProps {
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
}

export function MiniRetailerCard({
  retailer,
  expenses,
  onExpenseUpdated,
  viewMode,
}: MiniRetailerCardProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const now = new Date();
  const isPeriodMonthly = viewMode === "monthly";
  
  const totalAmount = expenses.reduce((sum, expense) => {
    const expenseDate = new Date(expense.date);
    const isCurrentPeriod = isPeriodMonthly 
      ? expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear()
      : expenseDate.getFullYear() === now.getFullYear();
    
    return isCurrentPeriod ? sum + expense.amount : sum;
  }, 0);

  const previousPeriodAmount = expenses.reduce((sum, expense) => {
    const expenseDate = new Date(expense.date);
    const isPreviousPeriod = isPeriodMonthly
      ? expenseDate.getMonth() === now.getMonth() - 1 && expenseDate.getFullYear() === now.getFullYear()
      : expenseDate.getFullYear() === now.getFullYear() - 1;
    
    return isPreviousPeriod ? sum + expense.amount : sum;
  }, 0);

  const percentageChange = previousPeriodAmount === 0
    ? 100
    : ((totalAmount - previousPeriodAmount) / previousPeriodAmount) * 100;
    
  const isIncrease = percentageChange > 0;

  return (
    <>
      <Card 
        className={cn(
          "overflow-hidden h-20 transition-all duration-200",
          "border shadow-sm hover:shadow-md",
          "bg-white dark:bg-gray-800/90"
        )}
      >
        <div className="h-full flex items-center p-3">
          <div className="flex-shrink-0 mr-3">
            {retailer.logo_url ? (
              <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-100 dark:border-gray-700">
                <img 
                  src={retailer.logo_url} 
                  alt={retailer.name} 
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <Store className="h-5 w-5" />
              </div>
            )}
          </div>
          
          <div className="flex-grow min-w-0">
            <Link 
              to={`/expenses/retailer/${retailer.id}`}
              className="text-sm font-medium text-tertiary hover:text-tertiary" // Remplacement par tertiary
            >
              {retailer.name}
            </Link>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-tertiary"> {/* Remplacement par tertiary */}
                {formatCurrency(totalAmount)}
              </span>
              
              {previousPeriodAmount > 0 && (
                <div className="flex items-center ml-2">
                  <div className={cn(
                    "p-0.5 rounded",
                    isIncrease ? "bg-red-100 dark:bg-red-900/30" : "bg-green-100 dark:bg-green-900/30"
                  )}>
                    {isIncrease ? (
                      <TrendingUp className="h-2.5 w-2.5 text-red-600 dark:text-red-300" />
                    ) : (
                      <TrendingDown className="h-2.5 w-2.5 text-green-600 dark:text-green-300" />
                    )}
                  </div>
                  <span className={cn(
                    "text-xs ml-1",
                    isIncrease ? "text-red-600 dark:text-red-300" : "text-green-600 dark:text-green-300"
                  )}>
                    {Math.abs(percentageChange).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex-shrink-0 rounded-full h-7 w-7 p-0 ml-2",
              "bg-tertiary text-tertiary hover:bg-tertiary/80", // Remplacement par tertiary
              "dark:bg-tertiary/30 dark:text-tertiary dark:hover:bg-tertiary/50" // Remplacement pour dark mode
            )}
            onClick={() => setAddDialogOpen(true)}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only">Ajouter une dépense pour {retailer.name}</span>
          </Button>
        </div>
      </Card>
      
      <AddExpenseDialog
        onExpenseAdded={onExpenseUpdated}
        preSelectedRetailer={retailer}
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />
    </>
  );
}