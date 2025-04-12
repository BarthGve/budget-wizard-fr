
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { formatCurrency, formatVolume } from "@/utils/format";

interface FuelConsumptionChartProps {
  data: Array<{
    date: string;
    month: string;
    price: number;
    volume: number;
    mileage?: number;
  }>;
}

export const FuelConsumptionChart: React.FC<FuelConsumptionChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  // Configuration des couleurs
  const colors = {
    price: isDarkMode ? "#F97316" : "#e67e22",
    gridLine: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    text: isDarkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)",
  };
  
  // Fonction personnalisée pour le tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <Card className="p-3 border shadow-lg bg-background text-foreground">
          <div className="font-medium text-sm mb-2">{label}</div>
          <div className="space-y-1 text-sm">
            <div className="flex gap-2 items-center">
              <div style={{ backgroundColor: colors.price }} className="w-2 h-2 rounded-full"></div>
              <div>Prix: <span className="font-medium">{formatCurrency(data.price)}/L</span></div>
            </div>
            <div className="pt-1 text-xs text-muted-foreground">
              {data.mileage && <div>Kilométrage: {data.mileage} km</div>}
              <div>Volume: {formatVolume(data.volume)}</div>
            </div>
          </div>
        </Card>
      );
    }
    return null;
  };
  
  return (
    <div className="w-full">
      <div className="text-sm text-muted-foreground mb-2 text-center">
        Évolution du prix du carburant sur les 12 derniers mois
      </div>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={colors.gridLine} />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: colors.text }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: colors.text }}
              label={{ 
                value: '€/L', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: colors.text, fontSize: 12 }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="price" 
              name="Prix (€/L)"
              stroke={colors.price} 
              activeDot={{ r: 6 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {data.length === 0 && (
        <div className="text-center text-muted-foreground mt-4">
          Aucune donnée de carburant disponible sur les 12 derniers mois
        </div>
      )}
    </div>
  );
};
