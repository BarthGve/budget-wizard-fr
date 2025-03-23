
import * as React from "react";
import { Label, Pie, PieChart, Tooltip } from "recharts";
import { formatCurrency } from "@/utils/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface MonthlySaving {
  id: string;
  name: string;
  amount: number;
}

interface SavingsPieChartProps {
  monthlySavings: MonthlySaving[];
  totalSavings: number;
}

// Palette de couleurs verte pour l'épargne - mode clair
const COLORS = ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#10b981', '#34d399'];

// Palette de couleurs verte pour l'épargne - mode sombre (plus lumineuses)
const DARK_COLORS = ['#4ade80', '#22c55e', '#16a34a', '#34d399', '#10b981', '#059669', '#6ee7b7'];

// Composant personnalisé pour le tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm shadow-md border border-border rounded-lg p-2 text-sm dark:bg-gray-800/95 dark:border-gray-700">
        <p className="font-medium dark:text-white">{payload[0].name}</p>
        <p className="font-semibold text-green-600 dark:text-green-300">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export const SavingsPieChart = ({
  monthlySavings,
  totalSavings
}: SavingsPieChartProps) => {
  const navigate = useNavigate();
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const chartColors = isDarkMode ? DARK_COLORS : COLORS;
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const chartData = monthlySavings.map((saving, index) => ({
    name: saving.name,
    value: saving.amount,
    fill: chartColors[index % chartColors.length]
  }));

  const chartConfig = {
    value: {
      label: "Montant"
    },
    ...Object.fromEntries(monthlySavings.map((saving, index) => [saving.name, {
      label: saving.name,
      color: chartColors[index % chartColors.length]
    }]))
  };

  // Dimensions adaptatives pour le graphique
  const chartWidth = isMobile ? 200 : 250;
  const chartHeight = isMobile ? 200 : 230;
  const innerRadius = isMobile ? 55 : 65;
  const outerRadius = isMobile ? 80 : 90;
  const fontSize = isMobile ? "text-lg" : "text-xl";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: isMobile ? 0 : -3 }} // Désactiver l'animation sur mobile
      className="w-full"
    >
      <Card 
        className={cn(
          "cursor-pointer flex flex-col transition-all duration-300 w-full",
          isMobile ? "h-[280px]" : "h-[320px]", // Hauteur adaptée sur mobile
          // Light mode - fond blanc avec effet d'ombre élégant
          "bg-white border border-gray-200/60 shadow-lg hover:shadow-xl",
          // Dark mode - fond adapté avec effet d'ombre verdâtre
          "dark:bg-gray-900/90 dark:border-green-900/30 dark:shadow-green-900/20 dark:hover:shadow-green-800/30"
        )}
        onClick={() => navigate("/savings")}
      >
        <CardHeader className="py-3 pb-0">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className={cn(
                "p-1.5 rounded-full",
                "bg-green-100 text-green-600", // Light mode
                "dark:bg-green-900/40 dark:text-green-300" // Dark mode
              )}>
                <PiggyBank className="h-4 w-4" />
              </div>
              <span className="dark:text-white">Épargne</span>
            </CardTitle>
          </div>
          <CardDescription className="text-sm dark:text-gray-400">Vue d'ensemble par versement</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex items-center justify-center p-0 w-full">
          <div className={cn(
            "mx-auto h-full flex items-center justify-center",
            isMobile ? "max-w-[200px]" : "max-w-[250px]"
          )}>
            <ChartContainer className="h-full w-full" config={chartConfig}>
              <PieChart width={chartWidth} height={chartHeight}>
                <Tooltip content={<CustomTooltip />} />
                
                <Pie 
                  data={chartData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" /* Centrage exact horizontal */
                  cy="50%" /* Centrage exact vertical */
                  innerRadius={innerRadius} 
                  outerRadius={outerRadius}
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
                                className={`fill-current text-gray-900 dark:text-gray-100 font-bold ${fontSize}`}
                              >
                                {formatCurrency(totalSavings)}
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
