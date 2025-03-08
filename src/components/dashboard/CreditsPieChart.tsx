
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from "recharts";
import { cn } from "@/lib/utils";

interface CreditsPieChartProps {
  credits: any[];
  totalCredits: number;
}

// Couleurs pour les différents segments
const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57'];

export const CreditsPieChart = ({ credits, totalCredits }: CreditsPieChartProps) => {
  // Préparation des données pour le graphique
  const pieData = credits.map((credit, index) => ({
    name: credit.nom_credit || `Crédit ${index + 1}`,
    value: credit.montant_mensualite || 0,
    color: COLORS[index % COLORS.length],
  }));

  // S'il n'y a pas de données, ajoutons une entrée fictive
  if (pieData.length === 0) {
    pieData.push({
      name: "Aucun crédit",
      value: 100,
      color: "#d3d3d3",
    });
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded-md shadow-sm text-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-gray-600">{`${payload[0].value} € (${(
            (payload[0].value / totalCredits) *
            100
          ).toFixed(0)}%)`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Répartition des crédits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className={cn(
                      entry.name === "Aucun crédit" && "opacity-30"
                    )}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
