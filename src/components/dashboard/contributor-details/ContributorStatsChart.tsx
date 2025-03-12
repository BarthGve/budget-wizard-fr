import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ContributorStatsChartProps {
  expenseShare: number;
  creditShare: number;
}

export function ContributorStatsChart({ 
  expenseShare, 
  creditShare 
}: ContributorStatsChartProps) {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  
  // Formater les valeurs pour avoir 2 décimales et ajouter le symbole €
  const formatValue = (value: number) => `${value.toFixed(2)} €`;
  
  const data = [
    { name: "Charges", value: expenseShare },
    { name: "Crédits", value: creditShare }
  ];
  
  // Couleurs pour le mode clair et sombre
  const COLORS = isDarkTheme 
    ? ["rgba(251, 191, 36, 0.8)", "rgba(245, 158, 11, 0.8)"] 
    : ["rgba(251, 191, 36, 0.9)", "rgba(245, 158, 11, 0.9)"];
  
  // Styles personnalisés pour le tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={cn(
          "p-2 rounded-md shadow-md",
          "bg-white dark:bg-gray-800",
          "border border-amber-100 dark:border-amber-800/50",
          "text-amber-800 dark:text-amber-300",
          "text-sm font-medium"
        )}>
          <p>{`${payload[0].name}: ${formatValue(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };
  
  // Style personnalisé pour la légende
  const renderLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <ul className="flex justify-center gap-6 mt-3">
        {
          payload.map((entry: any, index: number) => (
            <li key={`item-${index}`} className="flex items-center">
              <div 
                className="w-3 h-3 mr-2 rounded-sm"
                style={{ background: COLORS[index % COLORS.length] }}
              />
              <span className={cn(
                "text-sm",
                "text-amber-700 dark:text-amber-400"
              )}>
                {entry.value} ({formatValue(entry.payload.value)})
              </span>
            </li>
          ))
        }
      </ul>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          labelLine={false}
          stroke={isDarkTheme ? "rgba(30, 30, 30, 0.4)" : "rgba(255, 255, 255, 0.8)"}
          strokeWidth={2}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
              style={{
                filter: `drop-shadow(0 4px 3px rgb(251 191 36 / 0.07))`
              }}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
  );
}
