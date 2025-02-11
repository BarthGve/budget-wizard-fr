
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { subYears, format, parseISO, isWithinInterval, startOfYear, endOfYear } from "date-fns";
import { fr } from "date-fns/locale";
import { EXPENSE_CATEGORIES } from "./ExpenseFormFields";

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
  const today = new Date();
  const fiveYearsAgo = subYears(today, 5);

  // Filtrer les dépenses des 5 dernières années et les regrouper par année et catégorie
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
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Évolution des dépenses</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              }).format(value)}
              labelFormatter={(year) => `Année ${year}`}
            />
            <Legend />
            {EXPENSE_CATEGORIES.map((category) => (
              <Bar
                key={category.value}
                dataKey={category.value}
                name={category.label}
                stackId="a"
                fill={getCategoryColor(category.value)}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'charges':
      return '#4f46e5';
    case 'impots':
      return '#ef4444';
    case 'travaux':
      return '#f59e0b';
    case 'assurance':
      return '#10b981';
    case 'autres':
      return '#6b7280';
    default:
      return '#94a3b8';
  }
}
