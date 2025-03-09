import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label, Pie, PieChart, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { formatCurrency } from "@/utils/format";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";

interface Credit {
  id: string;
  name: string;
  amount: number;
  category: string;
}

interface CreditsPieChartProps {
  credits: Credit[];
  totalCredits: number;
}

interface CategoryTotal {
  category: string;
  amount: number;
}

// Palette de couleurs violettes pour les crédits
const COLORS = ['#8b5cf6', '#7c3aed', '#6d28d9', '#a78bfa', '#9333ea', '#7e22ce', '#c4b5fd'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm shadow-md border border-border rounded-lg p-2 text-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p className="font-semibold text-violet-600">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export const CreditsPieChart = ({
  credits,
  totalCredits
}: CreditsPieChartProps) => {
  const navigate = useNavigate();
  const categoryTotals = credits.reduce<CategoryTotal[]>((acc, credit) => {
    const existingCategory = acc.find(cat => cat.category === credit.category);
    if (existingCategory) {
      existingCategory.amount += credit.amount;
    } else {
      acc.push({
        category: credit.category,
        amount: credit.amount
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
        className="bg-gradient-to-br from-background to-violet-50 backdrop-blur-sm shadow-lg border border-violet-100 cursor-pointer h-[320px] flex flex-col"
        onClick={() => navigate("/credits")}
      >
        <CardHeader className="py-3 pb-0">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-violet-500" />
              Crédits
            </CardTitle>
          </div>
          <CardDescription className="text-sm">Vue d'ensemble des mensualités</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center pb-2 pt-0">
          <div className="mx-auto w-full h-[250px]">
            <ChartContainer className="h-full" config={chartConfig}>
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
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
                            <tspan x={viewBox.cx} y={viewBox.cy - 5} className="fill-foreground text-2xl font-bold">
                              {formatCurrency(totalCredits)}
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 18} className="fill-muted-foreground text-sm">
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
