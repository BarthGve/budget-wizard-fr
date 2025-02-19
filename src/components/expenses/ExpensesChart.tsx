
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { subYears, format, parseISO, isWithinInterval, startOfYear, endOfYear, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Toggle } from "@/components/ui/toggle";
import { CalendarClock, CalendarDays } from "lucide-react";
import { useState } from "react";

interface Expense {
  id: string;
  date: string;
  amount: number;
}

interface ExpensesChartProps {
  expenses: Expense[];
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

export function ExpensesChart({ expenses }: ExpensesChartProps) {
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const today = new Date();
  const startOfCurrentYear = startOfYear(today);

  const chartData = (() => {
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
  })();

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg p-4 mt-4">
      <div className="flex justify-end mb-4">
        <Toggle
          pressed={viewMode === 'yearly'}
          onPressedChange={(pressed) => setViewMode(pressed ? 'yearly' : 'monthly')}
          aria-label="Basculer entre vue mensuelle et annuelle"
        >
          {viewMode === 'monthly' ? (
            <CalendarDays className="h-4 w-4" />
          ) : (
            <CalendarClock className="h-4 w-4" />
          )}
        </Toggle>
      </div>

      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height={150}>
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
    </div>
  );
}
