
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CustomTooltip } from "./CustomTooltip";
import { renderCustomizedStackBar } from "./CustomBars";
import { useChartColorPalette } from "../utils/colors";
import { formatCurrency } from "@/utils/format";

interface YearlyBarChartProps {
  yearlyData: any[];
  topRetailers: string[];
}

export const YearlyBarChart = ({ yearlyData, topRetailers }: YearlyBarChartProps) => {
  const { axisColor, getBarColor } = useChartColorPalette();

  // Calcul du montant total pour chaque année (pour le tooltip)
  const dataWithTotals = yearlyData.map(yearData => {
    const total = topRetailers.reduce((sum, retailer) => {
      return sum + (yearData[retailer] || 0);
    }, 0);
    return { ...yearData, totalAmount: total };
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
          dataKey="year"
          axisLine={false}
          tickLine={false}
          tick={{ fill: axisColor, fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: axisColor, fontSize: 11 }}
          tickFormatter={(value) => formatCurrency(value, 0)}
          width={60}
        />
        
        <Tooltip 
          content={<CustomTooltip viewMode="yearly" />} 
          cursor={{ 
            fill: 'rgba(180, 180, 180, 0.1)'
          }} 
        />
        
        <Legend 
          wrapperStyle={{ 
            paddingTop: 15,
            fontSize: 12,
            opacity: 0.9
          }}
          iconSize={10}
          iconType="circle"
        />
        
        {topRetailers.map((retailer, index) => (
          <Bar 
            key={retailer}
            dataKey={retailer}
            stackId="a"
            fill={getBarColor(index)}
            shape={renderCustomizedStackBar(topRetailers)}
            maxBarSize={80}
            animationDuration={1000}
            animationEasing="ease-out"
            isAnimationActive={true}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
