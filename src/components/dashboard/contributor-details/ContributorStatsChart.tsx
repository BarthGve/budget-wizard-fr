import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Label } from "recharts";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ContributorStatsChartProps {
  expenseShare: number;
  creditShare: number;
  expenseAmount: number;
  creditAmount: number;
  contributorPercentage: number;
}

export function ContributorStatsChart({ 
  expenseShare, 
  creditShare,
  expenseAmount,
  creditAmount,
  contributorPercentage
}: ContributorStatsChartProps) {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  
  // Calculer le montant des contributions du contributeur
  const expenseContribution = (expenseAmount * contributorPercentage) / 100;
  const creditContribution = (creditAmount * contributorPercentage) / 100;
  
  // Formater les valeurs pour avoir 2 décimales et ajouter le symbole €
  const formatValue = (value: number) => `${value.toFixed(2)} €`;
  
  const data = [
    { name: "Charges", value: expenseContribution, total: expenseAmount },
    { name: "Crédits", value: creditContribution, total: creditAmount }
  ];
  
  // Couleurs pour le mode clair et sombre - adaptées pour correspondre à l'image
  const COLORS = ["#fbbf24", "#f59e0b"]; // Amber-400 et Amber-500
  
  // Styles personnalisés pour le tooltip
  const CustomTooltip = ({ active, payload }: any) => {
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
  
  // Style personnalisé pour la légende qui ressemble à l'image
  const renderCustomizedLegend = () => {
    return (
      <div className="flex justify-center gap-8 mt-3">
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className={cn(
                "text-sm font-medium",
                "text-amber-700 dark:text-amber-300"
              )}>
                {entry.name} ({formatValue(entry.value)})
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%" // Position centrée légèrement plus haut
            innerRadius={60}
            outerRadius={90}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            labelLine={false}
            stroke={isDarkTheme ? "rgba(30, 30, 30, 0.4)" : "rgba(255, 255, 255, 0.8)"}
            strokeWidth={1}
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
            {/* Étiquette au centre du graphique qui affiche le total */}
            <Label
              position="center"
              content={({ viewBox }) => {
                const { cx, cy } = viewBox as { cx: number; cy: number };
                const total = data.reduce((sum, entry) => sum + entry.value, 0);
                return (
                  <g>
                    <text
                      x={cx}
                      y={cy - 5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={isDarkTheme ? "fill-amber-300" : "fill-amber-700"}
                      style={{ fontSize: '14px' }}
                    >
                      Total
                    </text>
                    <text
                      x={cx}
                      y={cy + 15}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={isDarkTheme ? "fill-amber-300" : "fill-amber-700"}
                      style={{ fontSize: '16px', fontWeight: 'bold' }}
                    >
                      {formatValue(total)}
                    </text>
                  </g>
                );
              }}
            />
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {renderCustomizedLegend()}
    </div>
  );
}
