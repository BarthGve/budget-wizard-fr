
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";

interface ContributorStatsChartProps {
  expenseShare: number;
  creditShare: number;
}

export function ContributorStatsChart({ expenseShare, creditShare }: ContributorStatsChartProps) {
  const pieChartData = [
    {
      name: "Charges",
      value: expenseShare || 0,
    },
    {
      name: "Crédits",
      value: creditShare || 0,
    },
  ];

  const COLORS = ["#10B981", "#3B82F6"];

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Répartition Charges/Crédits</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
