import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label, Pie, PieChart, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { formatCurrency } from "@/utils/format";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

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

// Palette de couleurs pour le mode clair (couleur tertiaire)
const COLORS = ['#7F56D9', '#6B21A8', '#4C1D95', '#9B4D96', '#A855F7', '#9333EA', '#6D28D9'];

// Palette de couleurs pour le mode sombre - légèrement plus lumineuse
const DARK_COLORS = ['#D6A0FF', '#9B4D96', '#7F56D9', '#A855F7', '#9333EA', '#6D28D9', '#D4A1FF'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm shadow-md border border-border rounded-lg p-2 text-sm dark:bg-gray-800/95 dark:border-gray-700">
        <p className="font-medium dark:text-white">{payload[0].name}</p>
        <p className="font-semibold text-tertiary dark:text-tertiary">{formatCurrency(payload[0].value)}</p>
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
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const chartColors = isDarkMode ? DARK_COLORS : COLORS;
  
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
    fill: chartColors[index % chartColors.length]
  }));

  const chartConfig = {
    value: {
      label: "Montant"
    },
    ...Object.fromEntries(categoryTotals.map((category, index) => [category.category, {
      label: category.category,
      color: chartColors[index % chartColors.length]
    }]))
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3 }}
      className="w-full"
    >
      <Card 
        className={cn(
          "cursor-pointer h-[320px] flex flex-col transition-all duration-300",
          // Light mode - fond blanc avec effet d'ombre élégant
          "bg-white border border-gray-200/60 shadow-lg hover:shadow-xl",
          // Dark mode - fond adapté avec effet d'ombre
          "dark:bg-gray-900/90 dark:border-tertiary/30 dark:shadow-tertiary/20 dark:hover:shadow-tertiary/30"
        )}
        onClick={() => navigate("/recurring-expenses")}
      >
        <CardHeader className="py-3 pb-0">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className={cn(
                "p-1.5 rounded-full",
                "bg-tertiary/20 text-tertiary", // Light mode
                "dark:bg-tertiary/20 dark:text-tertiary" // Dark mode
              )}>
                <Receipt className="h-4 w-4" />
              </div>
              <span className="dark:text-white">Charges</span>
            </CardTitle>
          </div>
          <CardDescription className="text-sm dark:text-gray-400">Vue d'ensemble par catégorie</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex items-center justify-center p-0 w-full">
          <div className="w-full max-w-[250px] mx-auto h-[230px] flex items-center justify-center">
            <ChartContainer className="h-full w-full" config={chartConfig}>
              <PieChart width={250} height={230}>
                <Tooltip content={<CustomTooltip />} />
                
                <Pie 
                  data={chartData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" /* Centrage exact horizontal */
                  cy="50%" /* Centrage exact vertical */
                  innerRadius={65} 
                  outerRadius={90}
                  paddingAngle={4}
                  isAnimationActive={true}
                  animationBegin={200}
                  animationDuration={800}
                      
                  cornerRadius={6}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <g>
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                              <tspan 
                                x={viewBox.cx} 
                                y={viewBox.cy - 5} 
                                className="fill-current text-tertiary text-xl font-bold"
                              >
                                {formatCurrency(totalExpenses)}
                              </tspan>
                              <tspan 
                                x={viewBox.cx} 
                                y={(viewBox.cy || 0) + 18} 
                                className="fill-current text-gray-500 dark:text-gray-400 text-sm"
                              >
                                par mois
                              </tspan>
                            </text>
                          </g>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};