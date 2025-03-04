
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { subYears, format, parseISO, isWithinInterval, startOfYear, endOfYear, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { formatCurrency } from "@/utils/format";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useMemo } from "react";

interface Expense {
  id: string;
  date: string;
  amount: number;
}

interface ExpensesChartProps {
  expenses: Expense[];
  viewMode: 'monthly' | 'yearly';
}

const chartConfig = {
  expenses: {
    label: "Dépenses",
    theme: {
      light: "#8B5CF6",
      dark: "#8B5CF6"
    }
  }
};

export function ExpensesChart({ expenses, viewMode }: ExpensesChartProps) {
  const today = new Date();
  const startOfCurrentYear = startOfYear(today);

  // Utiliser useMemo pour éviter des recalculs coûteux à chaque rendu
  const chartData = useMemo(() => {
    if (viewMode === 'monthly') {
      // Données des 12 derniers mois
      const last12Months = Array.from({ length: 12 }, (_, i) => {
        const month = subMonths(today, i);
        const monthExpenses = expenses.filter(expense => {
          const expenseDate = parseISO(expense.date);
          return isWithinInterval(expenseDate, {
            start: startOfMonth(month),
            end: endOfMonth(month)
          });
        });
        return {
          period: format(month, 'MMM yyyy', { locale: fr }),
          total: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
          rawDate: month, // Pour le tri
        };
      }).reverse();

      return last12Months;
    } else {
      // Données des 5 dernières années
      const fiveYearsAgo = subYears(today, 5);
      const yearlyExpenses = expenses
        .filter((expense) => {
          const expenseDate = parseISO(expense.date);
          return isWithinInterval(expenseDate, {
            start: startOfYear(fiveYearsAgo),
            end: endOfYear(today),
          });
        })
        .reduce((acc: { [key: string]: number }, expense) => {
          const year = format(parseISO(expense.date), "yyyy");
          acc[year] = (acc[year] || 0) + expense.amount;
          return acc;
        }, {});

      return Object.entries(yearlyExpenses)
        .map(([year, total]) => ({
          period: year,
          total,
          rawDate: new Date(parseInt(year), 0, 1),
        }))
        .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
    }
  }, [expenses, viewMode, today]); // Dépendances correctement spécifiées

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg p-2 mt-2">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height={60}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 10 }}>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" opacity={0.1} />
            <XAxis 
              dataKey="period"
              axisLine={false}
              tickLine={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickMargin={5}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent 
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => viewMode === 'yearly' ? `Année ${label}` : label}
                />
              }
            />
            <Bar 
              dataKey="total" 
              fill="#8B5CF6"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
