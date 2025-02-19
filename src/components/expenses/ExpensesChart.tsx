
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { subYears, format, parseISO, isWithinInterval, startOfYear, endOfYear } from "date-fns";
import { fr } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";

interface Expense {
  id: string;
  date: string;
  amount: number;
}

interface ExpensesChartProps {
  expenses: Expense[];
}

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
    <div className="h-[200px] mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <XAxis 
            dataKey="year" 
            angle={-45}
            textAnchor="end"
            height={50}
          />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            labelFormatter={(label) => `Année ${label}`}
          />
          <Bar 
            dataKey="total" 
            fill="#000000" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
