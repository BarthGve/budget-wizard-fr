
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { subYears, format, parseISO, isWithinInterval, startOfYear, endOfYear } from "date-fns";
import { fr } from "date-fns/locale";
import { EXPENSE_CATEGORIES } from "./ExpenseFormFields";
import { getCategoryColor } from "@/utils/colors";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Expense {
  id: string;
  date: string;
  category: string;
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
    .reduce((acc: { [key: string]: { [key: string]: number } }, expense) => {
      const year = format(parseISO(expense.date), "yyyy");
      if (!acc[year]) {
        acc[year] = {};
        EXPENSE_CATEGORIES.forEach((cat) => {
          acc[year][cat.value] = 0;
        });
      }
      acc[year][expense.category] += expense.amount;
      return acc;
    }, {});

  const chartData = Object.entries(yearlyExpenses)
    .map(([year, categories]) => ({
      year,
      ...categories,
    }))
    .sort((a, b) => a.year.localeCompare(b.year));

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Évolution des dépenses</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis 
              dataKey="year"
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => 
                new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                  notation: 'compact',
                  maximumFractionDigits: 1
                }).format(value)
              }
            />
            <Tooltip 
              formatter={(value: number) => 
                new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(value)
              }
              labelFormatter={(year) => `Année ${year}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                padding: '0.5rem'
              }}
            />
            <Legend 
              verticalAlign="top"
              height={36}
              formatter={(value) => {
                const category = EXPENSE_CATEGORIES.find(cat => cat.value === value);
                return category ? category.label : value;
              }}
            />
            {EXPENSE_CATEGORIES.map((category, index) => (
              <Bar
                key={category.value}
                dataKey={category.value}
                name={category.label}
                stackId="a"
                fill={getCategoryColor(index, profile?.color_palette)}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
