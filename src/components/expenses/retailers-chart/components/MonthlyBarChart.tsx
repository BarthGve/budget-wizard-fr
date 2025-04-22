
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
          tick={{  fill: isDarkMode ? 'hsl(var(--gray-300))' : 'hsl(var(--gray-700))',
            fontWeight: 500 // Police plus épaisse pour meilleure lisibilité 
              }} 
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
          tick={{ 
            fill: isDarkMode ? 'hsl(var(--gray-300))' : 'hsl(var(--gray-700))',
            fontWeight: 500 // Police plus épaisse pour meilleure lisibilité
          }}
        />
        <Tooltip 
          formatter={(value) => [
            `${formatCurrency(Number(value))}`, 
            "Montant"
          ]}
          labelFormatter={(label) => `Enseigne: ${label}`}
          contentStyle={{
            backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.97)' : 'rgba(255, 255, 255, 0.97)', // Opacité augmentée
            borderRadius: '8px',
            boxShadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)', // Ombre plus prononcée en mode sombre
            border: isDarkMode ? '1px solid hsl(var(--tertiary-600))' : '1px solid hsl(var(--tertiary-300))',
            color: isDarkMode ? 'hsl(var(--tertiary-100))' : 'hsl(var(--tertiary-800))',
            padding: '10px', // Padding augmenté
            fontWeight: 500 // Police plus lisible
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
              stroke={isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'} // Bordure légère pour mieux distinguer les barres
              strokeWidth={1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
