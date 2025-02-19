
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
      light: "#8B5CF6",
      dark: "#8B5CF6"
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
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 40, bottom: 20 }}>
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
