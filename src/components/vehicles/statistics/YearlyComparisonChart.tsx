
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { formatCurrency } from "@/utils/format";

interface YearlyComparisonChartProps {
  data: Array<{
    name: string;
    currentYear: number;
    previousYear: number;
  }>;
}

export const YearlyComparisonChart: React.FC<YearlyComparisonChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  // Configuration des couleurs
  const colors = {
    currentYear: isDarkMode ? "#9b87f5" : "#7E69AB",
    previousYear: isDarkMode ? "#6E59A5" : "#5E49A2",
    gridLine: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    text: isDarkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)",
  };
  
  // Année courante
  const currentYear = new Date().getFullYear();
  
  // Fonction personnalisée pour le tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-3 border shadow-lg bg-background text-foreground">
          <div className="font-medium text-sm mb-2">{label}</div>
          <div className="space-y-1 text-sm">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex gap-2 items-center">
                <div style={{ backgroundColor: entry.color }} className="w-2 h-2 rounded-full"></div>
                <div>
                  {entry.name === "currentYear" 
                    ? `${currentYear}: ` 
                    : `${currentYear-1}: `}
                  <span className="font-medium">{formatCurrency(entry.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      );
    }
    return null;
  };
  
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={colors.gridLine} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: colors.text }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: colors.text }}
            tickFormatter={(value) => `${value}€`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            formatter={(value) => value === "currentYear" ? `${currentYear}` : `${currentYear-1}`}
          />
          <Bar 
            dataKey="previousYear" 
            fill={colors.previousYear} 
            name="previousYear"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="currentYear" 
            fill={colors.currentYear} 
            name="currentYear" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
