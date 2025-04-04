
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ChartContainer } from "@/components/ui/chart";
import { formatCurrency } from "@/utils/format";
import { chartConfig } from "../config/chartConfig";

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
  const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.07)";
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

  // Fonction pour formater la valeur monétaire dans le tooltip
  const tooltipFormatter = (value: any, name: string) => {
    const categoryConfig = chartConfig[name as keyof typeof chartConfig];
    const label = categoryConfig ? categoryConfig.label : name;
    return [formatCurrency(value), label as string];
  };

  return (
    <motion.div
      key={dataVersion}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      className="rounded-lg overflow-hidden"
    >
      <ChartContainer 
        className="h-[350px] w-full p-0"
        config={chartConfig}
        style={{ background: backgroundColor }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData}
            margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
            style={{ background: backgroundColor }}
          >
            <defs>
              {/* Ajout de dégradés pour chaque catégorie de dépense */}
              {Object.keys(chartConfig).map((category) => (
                <linearGradient 
                  key={`gradient-${category}`} 
                  id={`gradient-${category}`} 
                  x1="0" y1="0" x2="0" y2="1"
                >
                  <stop 
                    offset="5%" 
                    stopColor={getCategoryColor(category)} 
                    stopOpacity={0.9}
                  />
                  <stop 
                    offset="95%" 
                    stopColor={getCategoryColor(category)} 
                    stopOpacity={0.5}
                  />
                </linearGradient>
              ))}
            </defs>
            
            <XAxis 
              dataKey="name" 
              axisLine={{ stroke: gridColor, strokeWidth: 1 }}
              tickLine={false}
              stroke={axisColor}
              fontSize={12}
             
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              stroke={axisColor}
              fontSize={12}
             
            />
            <Tooltip 
              wrapperStyle={{ 
                borderRadius: "8px", 
                boxShadow: isDarkMode 
                  ? "0 4px 16px rgba(0, 0, 0, 0.4)" 
                  : "0 4px 20px rgba(0, 0, 0, 0.1)",
                border: isDarkMode 
                  ? "1px solid rgba(255, 255, 255, 0.1)" 
                  : "1px solid rgba(0, 0, 0, 0.05)"
              }}
              contentStyle={{ 
                backgroundColor: isDarkMode ? "#1A1F2C" : "#FFFFFF",
                color: isDarkMode ? "#E5DEFF" : "#333333",
                border: "none",
                padding: "12px 16px",
                borderRadius: "8px"
              }}
              cursor={{ 
                fill: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)" 
              }}
              formatter={tooltipFormatter}
              labelStyle={{ 
                fontWeight: "bold", 
                marginBottom: "10px",
                color: isDarkMode ? "#9b87f5" : "#7E69AB",
                borderBottom: isDarkMode 
                  ? "1px solid rgba(255, 255, 255, 0.1)" 
                  : "1px solid rgba(0, 0, 0, 0.05)",
                paddingBottom: "6px"
              }}
              labelFormatter={(label) => {
                if (showMultiYear) {
                  return `Année ${label}`;
                } else {
                  return `${label} ${currentYear}`;
                }
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={40} 
              formatter={(value) => {
                const categoryConfig = chartConfig[value as keyof typeof chartConfig];
                return categoryConfig ? categoryConfig.label : value;
              }} 
              wrapperStyle={{
                paddingTop: "10px",
                borderTop: isDarkMode 
                  ? "1px solid rgba(255, 255, 255, 0.1)" 
                  : "1px solid rgba(0, 0, 0, 0.05)"
              }}
            />
            
            {/* Barres des dépenses avec dégradés */}
            <Bar 
              dataKey="carburant" 
              stackId="a" 
              radius={[0, 0, 0, 0]}
              maxBarSize={60}
              fill={`url(#gradient-carburant)`}
              stroke={getCategoryColor("carburant")}
              strokeWidth={1}
            />
            <Bar 
              dataKey="loyer" 
              stackId="a" 
              radius={[0, 0, 0, 0]}
              maxBarSize={60}
              fill={`url(#gradient-loyer)`}
              stroke={getCategoryColor("loyer")}
              strokeWidth={1}
            />
            <Bar 
              dataKey="entretien" 
              stackId="a" 
              radius={[0, 0, 0, 0]}
              maxBarSize={60}
              fill={`url(#gradient-entretien)`}
              stroke={getCategoryColor("entretien")}
              strokeWidth={1}
            />
            <Bar 
              dataKey="assurance" 
              stackId="a" 
              radius={[0, 0, 0, 0]}
              maxBarSize={60}
              fill={`url(#gradient-assurance)`}
              stroke={getCategoryColor("assurance")}
              strokeWidth={1}
            />
            <Bar 
              dataKey="reparation" 
              stackId="a" 
              radius={[0, 0, 0, 0]}
              maxBarSize={60}
              fill={`url(#gradient-reparation)`}
              stroke={getCategoryColor("reparation")}
              strokeWidth={1}
            />
            <Bar 
              dataKey="amende" 
              stackId="a" 
              radius={[0, 0, 0, 0]}
              maxBarSize={60}
              fill={`url(#gradient-amende)`}
              stroke={getCategoryColor("amende")}
              strokeWidth={1}
            />
            <Bar 
              dataKey="peage" 
              stackId="a" 
              radius={[0, 0, 0, 0]}
              maxBarSize={60}
              fill={`url(#gradient-peage)`}
              stroke={getCategoryColor("peage")}
              strokeWidth={1}
            />
            <Bar 
              dataKey="autre" 
              stackId="a" 
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
              fill={`url(#gradient-autre)`}
              stroke={getCategoryColor("autre")}
              strokeWidth={1}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </motion.div>
  );
};
