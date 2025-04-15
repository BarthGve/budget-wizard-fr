
import React, { useState } from "react";
import { formatCurrency } from "@/utils/format";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { CustomBar } from "./CustomBars";
import { useChartColorPalette } from "../utils/colors";

interface RetailerExpense {
  retailerId: string;
  retailerName: string;
  totalAmount: number;
}

interface MonthlyBarChartProps {
  retailerExpenses: RetailerExpense[];
}

export const MonthlyBarChart = ({ retailerExpenses }: MonthlyBarChartProps) => {
  const { isDarkMode, getBarColor } = useChartColorPalette();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={retailerExpenses.map(item => ({
          name: item.retailerName,
          total: item.totalAmount
        }))}
        layout="vertical"
        margin={{ top: 15, right: 40, left: 20, bottom: 5 }}
        onMouseMove={(e) => {
          if (e.activeTooltipIndex !== undefined) {
            setActiveIndex(e.activeTooltipIndex);
          }
        }}
        onMouseLeave={() => setActiveIndex(null)}
      >
        <XAxis 
          type="number" 
          tickFormatter={(value) => formatCurrency(value)} 
          axisLine={false}
          tickLine={false}
          tick={{ fill: isDarkMode ? '#bec1c4' : '#5c5d5e' }}
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          width={120}
          tickFormatter={(value) => 
            value.length > 15 ? `${value.substring(0, 15)}...` : value
          }
          axisLine={false}
          tickLine={false}
          tick={{ fill: isDarkMode ? '#93C5FD' : '#3B82F6' }}
        />
        <Tooltip 
          formatter={(value) => [
            `${formatCurrency(Number(value))}`, 
            "Montant"
          ]}
          labelFormatter={(label) => `Enseigne: ${label}`}
          contentStyle={{
            backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: isDarkMode ? '1px solid #1e40af' : '1px solid #bfdbfe',
            color: isDarkMode ? '#bfdbfe' : '#1e40af'
          }}
        />
        <Bar 
          dataKey="total" 
          radius={[4, 4, 4, 4] as [number, number, number, number]}
          maxBarSize={30}
          animationDuration={1000}
          animationEasing="ease-out"
        >
          {retailerExpenses.map((_, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={getBarColor(index)}
              className="transition-all duration-200"
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
