
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CustomTooltip } from "./CustomTooltip";
import { renderCustomizedStackBar } from "./CustomBars";
import { useChartColorPalette } from "../utils/colors";

interface YearlyBarChartProps {
  yearlyData: any[];
  topRetailers: string[];
}

export const YearlyBarChart = ({ yearlyData, topRetailers }: YearlyBarChartProps) => {
  const { axisColor, getBarColor } = useChartColorPalette();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={yearlyData}
        margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
        barGap={2} // Espace réduit entre les groupes de barres pour plus d'élégance
        barCategoryGap="10%" // Espace entre catégories
      >
        {/* Masquer les axes tout en conservant leurs fonctionnalités */}
        <XAxis 
          dataKey="year"
          axisLine={false}
          tickLine={false}
          tick={{ fill: axisColor, fontSize: 12 }}
          dy={10} // Espacement légèrement augmenté
        />
        <YAxis 
          hide={true} // Masquer complètement l'axe Y
        />
        
        {/* Tooltip amélioré */}
        <Tooltip 
          content={<CustomTooltip viewMode="yearly" />} 
          cursor={{ 
            fill: 'rgba(180, 180, 180, 0.1)' // Curseur très subtil
          }} 
        />
        
        {/* Légende conservée en bas */}
        <Legend 
          wrapperStyle={{ 
            paddingTop: 15,
            fontSize: 12,
            opacity: 0.9
          }}
          iconSize={10} // Taille d'icône réduite pour plus d'élégance
          iconType="circle" // Utilisation de cercles au lieu de rectangles
        />
        
        {/* Barres avec radius uniquement pour la barre du haut */}
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
