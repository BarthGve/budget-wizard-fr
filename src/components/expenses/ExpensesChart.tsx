
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { subYears, format, parseISO, isWithinInterval, startOfYear, endOfYear, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { formatCurrency } from "@/utils/format";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isUpdating, setIsUpdating] = useState(false);

  // Effet pour l'animation de mise à jour lorsque les dépenses changent
  useEffect(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => setIsUpdating(false), 500);
    return () => clearTimeout(timer);
  }, [expenses]);

  const chartData = useMemo(() => {
    if (viewMode === 'monthly') {
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
          rawDate: month,
        };
      }).reverse();

      return last12Months;
    } else {
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
  }, [expenses, viewMode, today]);

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg p-2 mt-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={`chart-${expenses.length}-${viewMode}`}
          initial={{ opacity: 0.7, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.7, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={isUpdating ? 'animate-pulse' : ''}
        >
          <ChartContainer className="h-[250px] w-full p-0" config={chartConfig} >
            <ResponsiveContainer width="100%" height="100%" >

              <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" opacity={0.1} />
                <XAxis 
                  dataKey="period"
                  axisLine={false}
                  tickLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickMargin={10}
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
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
