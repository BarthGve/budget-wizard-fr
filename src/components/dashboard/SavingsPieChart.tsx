
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PiggyBank } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getCategoryColor } from "@/utils/colors";

interface MonthlySaving {
  id: string;
  name: string;
  amount: number;
}

interface SavingsPieChartProps {
  monthlySavings: MonthlySaving[];
  totalSavings: number;
}

export const SavingsPieChart = ({ monthlySavings, totalSavings }: SavingsPieChartProps) => {
  const chartData = monthlySavings.map(saving => ({
    name: saving.name,
    value: saving.amount
  }));

  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Répartition de l'Épargne</CardTitle>
          <CardDescription>Vue d'ensemble par catégorie</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/savings">
            <PiggyBank className="mr-2 h-4 w-4" />
            Gérer l'épargne
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
                    <Cell key={`cell-${index}`} fill={getCategoryColor(index)} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <p className="font-medium">{data.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {data.value} € ({Math.round((data.value / totalSavings) * 100)}%)
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
            {monthlySavings.map((saving, index) => (
              <div key={saving.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="mr-2 h-3 w-3 rounded-full"
                    style={{ backgroundColor: getCategoryColor(index) }}
                  />
                  <span className="text-sm font-medium">{saving.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {Math.round(saving.amount)} €
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
