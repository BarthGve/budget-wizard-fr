
import * as React from "react";
import { CreditCard } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import { formatCurrency } from "@/utils/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { useNavigate } from "react-router-dom";

interface Credit {
  id: string;
  nom: string;
  montant_mensualite: number;
}

interface CreditsPieChartProps {
  credits: Credit[];
  totalCredits: number;
}

const COLORS = ['#9b87f5', '#7E69AB', '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#8E9196'];

export const CreditsPieChart = ({
  credits,
  totalCredits
}: CreditsPieChartProps) => {
  const navigate = useNavigate();
  
  // Préparer les données pour le graphique
  const chartData = credits.map((credit, index) => ({
    name: credit.nom,
    value: credit.montant_mensualite,
    fill: COLORS[index % COLORS.length]
  }));

  // Si aucune donnée, ajouter un exemple fictif pour la démo
  if (chartData.length === 0) {
    chartData.push(
      { name: 'Crédit auto', value: 65, fill: COLORS[0] }
    );
  }

  const chartConfig = {
    value: {
      label: "Montant"
    },
    ...Object.fromEntries(chartData.map((item, index) => [item.name, {
      label: item.name,
      color: COLORS[index % COLORS.length]
    }]))
  };

  return (
    <Card 
      className="flex flex-col h-full cursor-pointer"
      onClick={() => navigate("/credits")}
    >
      <CardHeader className="items-center pb-0">
        <CardTitle>Crédits</CardTitle>
        <CardDescription>Vue d'ensemble des mensualités</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer className="mx-auto aspect-square max-h-[200px]" config={chartConfig}>
          <PieChart>
            <ChartTooltip cursor={false} content={({
              active,
              payload
            }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">{payload[0].name}</div>
                      <div className="text-right font-medium">
                        {formatCurrency(payload[0].value as number)}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }} />
            <Pie 
              data={chartData} 
              dataKey="value" 
              nameKey="name" 
              innerRadius={60} 
              outerRadius={80} 
              paddingAngle={5}
            >
              <Label content={({
                viewBox
              }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                        {totalCredits.toFixed(1)} €
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground text-sm">
                        pour le mois
                      </tspan>
                    </text>
                  );
                }
              }} />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
