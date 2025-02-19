
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { ExpensesChart } from "./ExpensesChart";
import { startOfYear, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { useState } from "react";
import { RetailerExpensesDialog } from "./RetailerExpensesDialog";

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
}

export function RetailerCard({ retailer, expenses, onExpenseUpdated }: RetailerCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const now = new Date();
  const currentYear = now.getFullYear();
  
  const currentYearExpenses = expenses.filter(
    expense => new Date(expense.date).getFullYear() === currentYear
  );
  const totalCurrentYear = currentYearExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const currentMonth = now.getMonth();
  const lastMonth = subMonths(now, 1);

  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return isWithinMonth(expenseDate, now);
  });

  const lastMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return isWithinMonth(expenseDate, lastMonth);
  });

  const totalCurrentMonth = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalLastMonth = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const percentageChange = totalLastMonth === 0 
    ? 100 
    : ((totalCurrentMonth - totalLastMonth) / totalLastMonth) * 100;

  function isWithinMonth(date: Date, monthDate: Date) {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    return date >= start && date <= end;
  }

  const handleExpenseUpdated = () => {
    setDialogOpen(false); // Fermer la modale avant de rafraîchir les données
    onExpenseUpdated(); // Ensuite rafraîchir les données
  };

  return (
    <>
      <Card 
        className="pb-0 pt-6 px-6 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setDialogOpen(true)}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">{retailer.name}</h3>
          {retailer.logo_url && (
            <img 
              src={retailer.logo_url} 
              alt={retailer.name} 
              className="h-8 w-8 object-contain"
            />
          )}
        </div>
        <div className="mt-4">
          <div className="text-4xl font-bold">
            {formatCurrency(totalCurrentYear)}
          </div>
          <div className="text-sm text-muted-foreground">
            {percentageChange > 0 ? "+" : ""}
            {percentageChange.toFixed(1)}% par rapport au mois dernier
          </div>
        </div>
        <ExpensesChart expenses={expenses} />
      </Card>

      <RetailerExpensesDialog
        retailer={retailer}
        expenses={expenses}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onExpenseUpdated={handleExpenseUpdated}
      />
    </>
  );
}
