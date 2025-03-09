import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label, Pie, PieChart, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { formatCurrency } from "@/utils/format";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Receipt } from "lucide-react";

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

const COLORS = ['#3b82f6', '#2563eb', '#1d4ed8', '#0ea5e9', '#0284c7', '#0369a1', '#38bdf8'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm shadow-md border border-border rounded-lg p-2 text-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p className="font-semibold text-blue-600">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export const RecurringExpensesPieChart = ({
  recurringExpenses,
  totalExpenses
}: RecurringExpensesPieChartProps) => {
  const navigate = useNavigate();
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3 }}
    >
      <Card 
        className="bg-gradient-to-br from-background to-blue-50 backdrop-blur-sm shadow-lg border border-blue-100 cursor-pointer h-[320px] flex flex-col"
        onClick={() => navigate("/recurring-expenses")}
      >
        <CardHeader className="py-3 pb-0"> {/* Réduire le padding vertical */}
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2"> {/* Réduire la taille du titre */}
              <Receipt className="h-5 w-5 text-blue-500" /> {/* Réduire la taille de l'icône */}
              Charges
            </CardTitle>
          </div>
          <CardDescription className="text-sm">Vue d'ensemble par catégorie</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center pb-2 pt-0"> {/* Centrer verticalement */}
          <div className="mx-auto w-full h-[250px]"> {/* Augmenter la hauteur du conteneur */}
            <ChartContainer className="h-full" config={chartConfig}>
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}> {/* Supprimer les marges */}
                <Tooltip content={<CustomTooltip />} />
                
                <Pie 
                  data={chartData} 
                  dataKey="value" 
                  nameKey="name" 
                  innerRadius={75} 
                  outerRadius={100} 
                  paddingAngle={5}
                  isAnimationActive={true}
                  animationBegin={200}
                  animationDuration={800}
                >
                  <Label content={({
                    viewBox
                  }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <g>
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={viewBox.cx} y={viewBox.cy - 5} className="fill-foreground text-2xl font-bold"> {/* Agrandir le texte */}
                              {formatCurrency(totalExpenses)}
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 18} className="fill-muted-foreground text-sm"> {/* Ajuster la position */}
                              par mois
                            </tspan>
                          </text>
                        </g>
                      );
                    }
                  }} />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};


