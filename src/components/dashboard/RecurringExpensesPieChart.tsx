
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getCategoryColor } from "@/utils/colors";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
}

interface RecurringExpensesPieChartProps {
  recurringExpenses: RecurringExpense[];
  totalExpenses: number;
}

export const RecurringExpensesPieChart = ({ recurringExpenses, totalExpenses }: RecurringExpensesPieChartProps) => {
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

  const chartData = recurringExpenses.map(expense => ({
    name: expense.name,
    value: expense.amount
  }));

  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Répartition des Dépenses</CardTitle>
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
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getCategoryColor(index, profile?.color_palette)} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const percentage = Math.round((data.value / totalExpenses) * 100);
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <p className="font-medium">{data.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {percentage}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {recurringExpenses.map((expense, index) => (
              <div key={expense.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="mr-2 h-3 w-3 rounded-full"
                    style={{ backgroundColor: getCategoryColor(index, profile?.color_palette) }}
                  />
                  <span className="text-sm font-medium">{expense.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {Math.round((expense.amount / totalExpenses) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
