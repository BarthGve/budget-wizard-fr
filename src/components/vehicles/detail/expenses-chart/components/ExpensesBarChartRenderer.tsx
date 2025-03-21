
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatCurrency } from "@/utils/format";
import { chartConfig } from "../config/chartConfig";
import { ExpensesChartHeader } from "./ExpensesChartHeader";

interface ExpensesBarChartRendererProps {
  chartData: any[];
  currentYear: number;
  dataVersion: number;
  showMultiYear: boolean;
  onToggleView: () => void;
  chartTitle: string;
  chartDescription: string;
}

export const ExpensesBarChartRenderer = ({ 
  chartData, 
  currentYear, 
  dataVersion,
  showMultiYear,
  onToggleView,
  chartTitle,
  chartDescription
}: ExpensesBarChartRendererProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Configuration des couleurs en fonction du thème
  const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
  const axisColor = isDarkMode ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground))";
  const backgroundColor = "transparent";

  // Fonction pour récupérer la couleur selon la catégorie et le thème
  const getCategoryColor = (category: string) => {
    const categoryData = chartConfig[category as keyof typeof chartConfig];
    if (categoryData) {
      return isDarkMode ? categoryData.theme.dark : categoryData.theme.light;
    }
    return isDarkMode ? "#A1A5AA" : "#8E9196"; // Couleur par défaut
  };

  return (
    <motion.div
      key={dataVersion}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-3">
        <ExpensesChartHeader 
          title={chartTitle}
          description={chartDescription}
          showMultiYear={showMultiYear}
          onToggleView={onToggleView}
        />
      </div>
      
      <ChartContainer 
        className="h-[350px] w-full p-0"
        config={chartConfig}
        style={{ background: backgroundColor }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
            style={{ background: backgroundColor }}
          >
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              stroke={axisColor}
              fontSize={12}
              tickMargin={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              stroke={axisColor}
              fontSize={12}
              tickFormatter={(value) => formatCurrency(value, 0)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent 
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => {
                    if (showMultiYear) {
                      return `Année ${label}`;
                    } else {
                      return `${label} ${currentYear}`;
                    }
                  }}
                />
              }
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              formatter={(value) => {
                // Correction: On s'assure que la fonction accepte uniquement un argument
                const categoryConfig = chartConfig[value as keyof typeof chartConfig];
                return categoryConfig ? categoryConfig.label : value;
              }} 
            />
            <Bar 
              dataKey="carburant" 
              stackId="a" 
              radius={[0, 0, 0, 0]}
              maxBarSize={60}
              fill={getCategoryColor("carburant")}
            />
            <Bar 
              dataKey="entretien" 
              stackId="a" 
              radius={[0, 0, 0, 0]}
              maxBarSize={60}
              fill={getCategoryColor("entretien")}
            />
            <Bar 
              dataKey="assurance" 
              stackId="a" 
              radius={[0, 0, 0, 0]}
              maxBarSize={60}
              fill={getCategoryColor("assurance")}
            />
            <Bar 
              dataKey="reparation" 
              stackId="a" 
              radius={[0, 0, 0, 0]}
              maxBarSize={60}
              fill={getCategoryColor("reparation")}
            />
            <Bar 
              dataKey="autre" 
              stackId="a" 
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
              fill={getCategoryColor("autre")}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </motion.div>
  );
};
