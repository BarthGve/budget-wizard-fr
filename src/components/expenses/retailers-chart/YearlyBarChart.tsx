
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/utils/format";
import { CustomTooltip } from "./CustomTooltip";

interface YearlyBarChartProps {
  yearlyData: Array<Record<string, any>>;
  topRetailers: string[];
  gridColor: string;
  axisColor: string;
  getBarColor: (index: number) => string;
}

export function YearlyBarChart({ yearlyData, topRetailers, gridColor, axisColor, getBarColor }: YearlyBarChartProps) {
  return (
    <BarChart
      data={yearlyData}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
      <XAxis 
        dataKey="year"
        stroke={axisColor}
        fontSize={12}
      />
      <YAxis 
        tickFormatter={(value) => formatCurrency(value)}
        stroke={axisColor}
        fontSize={12}
      />
      <Tooltip content={<CustomTooltip viewMode="yearly" />} />
      <Legend />
      {topRetailers.map((retailer, index) => (
        <Bar 
          key={retailer}
          dataKey={retailer} 
          stackId="a" 
          fill={getBarColor(index)}
        />
      ))}
    </BarChart>
  );
}
