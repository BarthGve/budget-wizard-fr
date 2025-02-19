
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { subYears, format, parseISO, isWithinInterval, startOfYear, endOfYear } from "date-fns";
import { fr } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

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
      light: "hsl(var(--primary))",
      dark: "hsl(var(--primary))"
    }
  }
};

export function ExpensesChart({ expenses }: ExpensesChartProps) {
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

  const chartData = Object.entries(yearlyExpenses)
    .map(([year, total]) => ({
      year,
      total,
    }))
    .sort((a, b) => a.year.localeCompare(b.year));

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg p-4 mt-4">
      <ChartContainer config={chartConfig} className="w-full aspect-[4/1]">
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 40, bottom: 30 }}>
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" opacity={0.1} />
          <XAxis 
            dataKey="year" 
            axisLine={false}
            tickLine={false}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickMargin={10}
          />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value)}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Année ${label}`}
              />
            }
          />
          <Bar 
            dataKey="total" 
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
