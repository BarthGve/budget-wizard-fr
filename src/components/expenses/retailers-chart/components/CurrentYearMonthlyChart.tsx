
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CustomTooltip } from "./CustomTooltip";
import { useChartColorPalette } from "../utils/colors";
import { formatCurrency } from "@/utils/format";

interface CurrentYearMonthlyChartProps {
  monthlyData: any[];
  topRetailers: string[];
}

export const CurrentYearMonthlyChart = ({ monthlyData, topRetailers }: CurrentYearMonthlyChartProps) => {
  const { axisColor, getBarColor } = useChartColorPalette();
  const currentYear = new Date().getFullYear();

  // Calcul du montant total pour chaque mois (pour le tooltip)
  const dataWithTotals = monthlyData.map(monthData => {
    const total = topRetailers.reduce((sum, retailer) => {
      return sum + (monthData[retailer] || 0);
    }, 0);
    return { ...monthData, totalAmount: total };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={dataWithTotals}
        margin={{ top: 20, right: 30, left: 40, bottom: 30 }}
        barGap={2}
        barCategoryGap="10%"
      >
        <XAxis 
          dataKey="month"
          axisLine={false}
          tickLine={false}
          stroke={axisColor}
          fontSize={12}
          tickMargin={10}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: axisColor, fontSize: 11 }}
          tickFormatter={(value) => formatCurrency(value, 0)}
          width={60}
        />
        
        <Tooltip 
          content={<CustomTooltip viewMode="monthly-in-year" />} 
          cursor={{ fill: 'rgba(180, 180, 180, 0.1)' }}
        />
        
        {topRetailers.map((retailer, index) => (
          <Bar 
            key={retailer}
            dataKey={retailer}
            stackId="a"
            fill={getBarColor(index)}
            radius={[0, 0, 0, 0]}
            maxBarSize={60}
            animationDuration={1000}
            animationEasing="ease-out"
            isAnimationActive={true}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
