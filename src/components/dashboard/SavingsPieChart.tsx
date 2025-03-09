import * as React from "react";
import { Label, Pie, PieChart, Tooltip } from "recharts";
import { formatCurrency } from "@/utils/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PiggyBank } from "lucide-react";

interface MonthlySaving {
  id: string;
  name: string;
  amount: number;
}

interface SavingsPieChartProps {
  monthlySavings: MonthlySaving[];
  totalSavings: number;
}

// Palette de couleurs verte pour l'épargne
const COLORS = ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#10b981', '#34d399'];

// Composant personnalisé pour le tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm shadow-md border border-border rounded-lg p-2 text-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p className="font-semibold text-green-600">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export const SavingsPieChart = ({
  monthlySavings,
  totalSavings
}: SavingsPieChartProps) => {
  const navigate = useNavigate();
  const chartData = monthlySavings.map((saving, index) => ({
    name: saving.name,
    value: saving.amount,
    fill: COLORS[index % COLORS.length]
  }));

  const chartConfig = {
    value: {
      label: "Montant"
    },
    ...Object.fromEntries(monthlySavings.map((saving, index) => [saving.name, {
      label: saving.name,
      color: COLORS[index % COLORS.length]
    }]))
  };

  // Format custom pour afficher la structure de l'épargne
  const formatSavingSummary = () => {
    if (monthlySavings.length === 0) return "Aucune épargne programmée";
    if (monthlySavings.length === 1) return `1 compte: ${monthlySavings[0].name}`;
    return `${monthlySavings.length} comptes d'épargne actifs`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3 }}
    >
      <Card 
        className="bg-gradient-to-br from-background to-green-50 backdrop-blur-sm shadow-lg border border-green-100 cursor-pointer h-[320px] flex flex-col"
        onClick={() => navigate("/savings")}
      >
        <CardHeader className="py-3 pb-0"> {/* Padding réduit */}
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2"> {/* Taille de texte réduite */}
              <PiggyBank className="h-5 w-5 text-green-500" /> {/* Icône plus petite */}
              Épargne
            </CardTitle>
          </div>
          <CardDescription className="text-sm">Vue d'ensemble par versement</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center pb-2 pt-0"> {/* Centrage vertical optimisé */}
          <div className="mx-auto w-full h-[250px]"> {/* Hauteur du graphique augmentée */}
            <ChartContainer className="h-full" config={chartConfig}>
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}> {/* Marges supprimées */}
                <Tooltip content={<CustomTooltip />} />
                
                <Pie 
                  data={chartData} 
                  dataKey="value" 
                  nameKey="name" 
                  innerRadius={75} /* Rayon intérieur augmenté */
                  outerRadius={100} /* Rayon extérieur augmenté */
                  paddingAngle={5}
                  isAnimationActive={true}
                  animationBegin={200}
                  animationDuration={800}
                >
                  <Label content={({
                    viewBox
                  }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <g>
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={viewBox.cx} y={viewBox.cy - 5} className="fill-foreground text-2xl font-bold"> {/* Texte plus grand */}
                              {formatCurrency(totalSavings)}
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 18} className="fill-muted-foreground text-sm"> {/* Position ajustée */}
                              par mois
                            </tspan>
                          </text>
                        </g>
                      );
                    }
                  }} />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

