
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { ExpensesChart } from "./ExpensesChart";
import { startOfYear, subMonths, startOfMonth, endOfMonth } from "date-fns";

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
  }>;
}

export function RetailerCard({ retailer, expenses }: RetailerCardProps) {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // Calculer le total des dépenses pour l'année en cours
  const currentYearExpenses = expenses.filter(
    expense => new Date(expense.date).getFullYear() === currentYear
  );
  const totalCurrentYear = currentYearExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculer la variation par rapport au mois précédent
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

  return (
    <Card className="p-6">
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
  );
}
