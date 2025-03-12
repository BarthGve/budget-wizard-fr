import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ContributorStatsChartProps {
  expenseShare: number;
  creditShare: number;
  expenseAmount?: number;
  creditAmount?: number;
}

export function ContributorStatsChart({ 
  expenseShare, 
  creditShare,
  expenseAmount = 0,
  creditAmount = 0
}: ContributorStatsChartProps) {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  
  // Formater les valeurs pour avoir 2 décimales et ajouter le symbole €
  const formatValue = (value: number) => `${value.toFixed(2)} €`;
  
  const data = [
    { 
      name: "Charges", 
      value: expenseShare,
      fullValue: expenseAmount,
      color: "#fbbf24" // Ambre-400
    },
    { 
      name: "Crédits", 
      value: creditShare,
      fullValue: creditAmount,
      color: "#f59e0b" // Ambre-500
    }
  ];
  
  // Couleurs plus vives pour mieux correspondre à l'image
  const COLORS = ["#fbbf24", "#f59e0b"];
  
  // Ne pas afficher le tooltip pour simplifier comme dans l'image
  const CustomTooltip = ({ active, payload }: any) => null;

  // Render custom legend that matches the screenshot
  const renderLegend = (props: any) => {
    return (
      <div className="flex justify-center mt-3 gap-8">
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div className={cn(
              "inline-block w-3 h-3 rounded-full mr-2",
              "bg-amber-400 dark:bg-amber-400"
            )} style={{ backgroundColor: entry.color }} />
            <span className={cn(
              "text-sm font-medium",
              "text-amber-800 dark:text-amber-300"
            )}>
              {`${entry.name} (${formatValue(entry.value)})`}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Si les deux valeurs sont 0, afficher un graphique vide avec un message
  const isEmpty = expenseShare === 0 && creditShare === 0;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {isEmpty ? (
        <div className="text-center text-amber-600/70 dark:text-amber-400/70 text-sm">
          Aucune contribution ce mois-ci
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={35}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
              stroke={isDarkTheme ? "rgba(30, 30, 30, 0.2)" : "rgba(255, 255, 255, 0.8)"}
              strokeWidth={1}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                />
              ))}
            </Pie>
            <Legend content={renderLegend} verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
