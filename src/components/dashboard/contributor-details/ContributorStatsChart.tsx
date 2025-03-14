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
  
  // Définition des couleurs plus vives et cohérentes avec l'image
  const expenseColor = "#FFCA28"; // Jaune doré plus vif
  const creditColor = "#FFA726"; // Orange plus foncé

  // Assurer que les valeurs sont non-négatives
  const safeExpenseShare = Math.max(0, expenseShare);
  const safeCreditShare = Math.max(0, creditShare);
  
  const data = [
    { 
      name: "Charges", 
      value: safeExpenseShare,
      fullValue: expenseAmount,
      color: expenseColor
    },
    { 
      name: "Crédits", 
      value: safeCreditShare,
      fullValue: creditAmount,
      color: creditColor
    }
  ];

  // Render custom legend that matches the screenshot
  const renderLegend = (props: any) => {
    return (
      <div className="flex justify-center mt-6 gap-8">
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div className="inline-block w-3 h-3 rounded-full mr-2" 
                 style={{ backgroundColor: entry.color }} />
            <span className={cn(
              "text-sm font-medium",
              "text-amber-800 dark:text-amber-300"
            )}>
              {`${entry.name} (${formatValue(entry.fullValue || entry.value)})`}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Si les deux valeurs sont 0, afficher un graphique vide avec un message
  const isEmpty = safeExpenseShare === 0 && safeCreditShare === 0;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {isEmpty ? (
        <div className="text-center text-amber-600/70 dark:text-amber-400/70 text-sm">
          Aucune contribution ce mois-ci
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={40}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
              stroke={isDarkTheme ? "#1A1E2A" : "#FFFFFF"} // Bordure plus contrastée
              strokeWidth={4} // Bordure plus épaisse pour meilleure séparation
              cornerRadius={6} // Ajout de radius aux segments comme demandé
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
