import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
}
interface RecurringExpensesPieChartProps {
  recurringExpenses: RecurringExpense[];
  totalExpenses: number;
}
interface CategoryTotal {
  category: string;
  amount: number;
}
export const RecurringExpensesPieChart = ({
  recurringExpenses,
  totalExpenses
}: RecurringExpensesPieChartProps) => {
  const categoryTotals = recurringExpenses.reduce<CategoryTotal[]>((acc, expense) => {
    const existingCategory = acc.find(cat => cat.category === expense.category);
    if (existingCategory) {
      existingCategory.amount += expense.amount;
    } else {
      acc.push({
        category: expense.category,
        amount: expense.amount
      });
    }
    return acc;
  }, []);
  const chartData = categoryTotals.map(category => ({
    name: category.category,
    value: category.amount
  }));
  const COLORS = ['rgb(34, 197, 94)', 'rgb(99, 102, 241)', 'rgb(249, 115, 22)', 'rgb(236, 72, 153)', 'rgb(234, 179, 8)'];
  return <Card className="col-span-full md:col-span-1 bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Prévisions des dépenses</CardTitle>
          <CardDescription>Vue d'ensemble par catégorie</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/recurring-expenses">
            <BarChart className="mr-2 h-4 w-4" />
            Gérer les charges
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          <div className="w-[200px]">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value: number) => new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              }).format(value)} contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                padding: '0.5rem'
              }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {categoryTotals.map((category, index) => <div key={category.category} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full" style={{
                backgroundColor: COLORS[index % COLORS.length]
              }} />
                  <span className="text-sm font-medium">{category.category}</span>
                </div>
                <span className="text-sm text-slate-600">
                  {(category.amount / totalExpenses * 100).toFixed(1)}%
                </span>
              </div>)}
          </div>
        </div>
      </CardContent>
    </Card>;
};