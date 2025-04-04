
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { formatCurrency } from "@/utils/format";

interface ExpenseDistributionChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export const ExpenseDistributionChart: React.FC<ExpenseDistributionChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  // Fonction personnalisée pour le tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-3 border shadow-lg bg-background text-foreground">
          <div className="font-medium text-sm">{payload[0].name}</div>
          <div className="text-sm">
            <span className="font-medium">{formatCurrency(payload[0].value)}</span>
            <span className="text-xs text-muted-foreground ml-1">
              ({((payload[0].payload.value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)
            </span>
          </div>
        </Card>
      );
    }
    return null;
  };
  
  // Légende personnalisée
  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {payload.map((entry: any, index: number) => {
          const percentage = ((entry.payload.value / totalValue) * 100).toFixed(1);
          return (
            <div key={`legend-${index}`} className="flex items-center gap-2 text-xs">
              <div style={{ backgroundColor: entry.color }} className="w-3 h-3 rounded-full"></div>
              <span>{entry.value}</span>
              <span className="text-muted-foreground">({percentage}%)</span>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                stroke={isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.8)"} 
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            content={renderCustomLegend}
            verticalAlign="bottom"
            align="center"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
