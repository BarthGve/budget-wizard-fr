
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/utils/format";
import { CustomTooltip } from "./CustomTooltip";

interface MonthlyBarChartProps {
  retailerExpenses: Array<{
    name: string;
    total: number;
  }>;
  gridColor: string;
  axisColor: string;
  barColor: string;
}

export function MonthlyBarChart({ retailerExpenses, gridColor, axisColor, barColor }: MonthlyBarChartProps) {
  return (
    <BarChart
      data={retailerExpenses}
      layout="vertical"
      margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={gridColor} />
      <XAxis 
        type="number" 
        tickFormatter={(value) => formatCurrency(value)}
        stroke={axisColor}
        fontSize={12}
      />
      <YAxis 
        type="category" 
        dataKey="name" 
        width={100} 
        stroke={axisColor}
        fontSize={12}
        tickLine={false}
      />
      <Tooltip content={<CustomTooltip viewMode="monthly" />} />
      <Bar 
        dataKey="total" 
        fill={barColor} 
        radius={[0, 4, 4, 0]}
      />
    </BarChart>
  );
}
