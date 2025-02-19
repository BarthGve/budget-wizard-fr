
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label, Pie, PieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatCurrency } from "@/utils/format";

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

const COLORS = ['#9b87f5', '#7E69AB', '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#8E9196'];

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

  const chartData = categoryTotals.map((category, index) => ({
    name: category.category,
    value: category.amount,
    fill: COLORS[index % COLORS.length]
  }));

  const chartConfig = {
    value: {
      label: "Montant"
    },
    ...Object.fromEntries(categoryTotals.map((category, index) => [category.category, {
      label: category.category,
      color: COLORS[index % COLORS.length]
    }]))
  };

  return (
    <Card className="flex flex-col h-full">
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
                        {formatCurrency(totalExpenses)}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground text-sm">
                        par mois
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
