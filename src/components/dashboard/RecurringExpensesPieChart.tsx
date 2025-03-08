
import * as React from "react";
import { ShoppingBasket } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import { formatCurrency } from "@/utils/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { useNavigate } from "react-router-dom";

interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category?: string;
}

interface RecurringExpensesPieChartProps {
  recurringExpenses: RecurringExpense[];
  totalExpenses: number;
}

const COLORS = ['#9b87f5', '#7E69AB', '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#8E9196'];

export const RecurringExpensesPieChart = ({
  recurringExpenses,
  totalExpenses
}: RecurringExpensesPieChartProps) => {
  const navigate = useNavigate();
  
  // Grouper les dépenses par catégorie
  const expensesByCategory = recurringExpenses.reduce((acc, expense) => {
    const category = expense.category || 'Autre';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(expensesByCategory).map(([name, value], index) => ({
    name,
    value,
    fill: COLORS[index % COLORS.length]
  }));

  // Si aucune donnée, ajouter un exemple fictif pour la démo
  if (chartData.length === 0) {
    chartData.push(
      { name: 'Logement', value: 450, fill: COLORS[0] },
      { name: 'Services', value: 280, fill: COLORS[1] },
      { name: 'Transport', value: 120, fill: COLORS[2] },
      { name: 'Santé', value: 100, fill: COLORS[3] }
    );
  }

  const chartConfig = {
    value: {
      label: "Montant"
    },
    ...Object.fromEntries(chartData.map((item, index) => [item.name, {
      label: item.name,
      color: COLORS[index % COLORS.length]
    }]))
  };

  return (
    <Card 
      className="flex flex-col h-full cursor-pointer"
      onClick={() => navigate("/recurring-expenses")}
    >
      <CardHeader className="items-center pb-0">
        <CardTitle>Charges</CardTitle>
        <CardDescription>Vue d'ensemble par catégorie</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer className="mx-auto aspect-square max-h-[200px]" config={chartConfig}>
          <PieChart>
            <ChartTooltip cursor={false} content={({
              active,
              payload
            }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">{payload[0].name}</div>
                      <div className="text-right font-medium">
                        {formatCurrency(payload[0].value as number)}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }} />
            <Pie 
              data={chartData} 
              dataKey="value" 
              nameKey="name" 
              innerRadius={60} 
              outerRadius={80} 
              paddingAngle={5}
            >
              <Label content={({
                viewBox
              }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                        {totalExpenses.toFixed(1)} €
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground text-sm">
                        pour le mois
                      </tspan>
                    </text>
                  );
                }
              }} />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
