
import { Label, Pie, PieChart, Tooltip } from "recharts";
import { formatCurrency } from "@/utils/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChartColors } from "@/hooks/useChartColors";

interface Credit {
  nom_credit: string;
  montant_mensualite: number;
  date_derniere_mensualite: string;
  statut: string;
}

interface CreditsPieChartProps {
  credits: Credit[];
  totalMensualites: number;
}

// Composant personnalisé pour le tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm shadow-md border border-border rounded-lg p-2 text-sm dark:bg-gray-800/95 dark:border-gray-700">
        <p className="font-medium dark:text-white">{payload[0].name}</p>
        <p className="font-semibold text-senary dark:text-senary">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export const CreditsPieChart = ({
  credits,
  totalMensualites
}: CreditsPieChartProps) => {
  const navigate = useNavigate();
  // Utiliser notre hook personnalisé pour obtenir les couleurs basées sur senary
  const chartColors = useChartColors("senary").all;

  // Filtrer pour ne garder que les crédits actifs
  const activeCredits = credits.filter(credit => credit.statut === 'actif');

  const chartData = activeCredits.map((credit, index) => ({
    name: credit.nom_credit,
    value: credit.montant_mensualite,
    fill: chartColors[index % chartColors.length]
  }));

  // Calculer le total des mensualités des crédits actifs uniquement
  const activeTotalMensualites = activeCredits.reduce((total, credit) => total + credit.montant_mensualite, 0);

  const chartConfig = {
    value: {
      label: "Montant"
    },
    ...Object.fromEntries(activeCredits.map((credit, index) => [credit.nom_credit, {
      label: credit.nom_credit,
      color: chartColors[index % chartColors.length]
    }]))
  };

  // Ne pas afficher le graphique s'il n'y a pas de crédits actifs
  if (activeCredits.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3 }}
      className="w-full"
    >
      <Card 
        className={cn(
          "cursor-pointer h-[320px] flex flex-col transition-all duration-300",
          // Light mode
          "bg-white border border-senary/20 shadow-lg hover:shadow-xl",
          // Dark mode
          "dark:bg-gray-900/90 dark:border-senary/30 dark:shadow-senary/30 dark:hover:shadow-senary/50"
        )}
        onClick={() => navigate("/credits")}
      >
        <CardHeader className="py-3 pb-0">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className={cn(
                "p-1.5 rounded-full",
                "bg-senary/20 text-senary", // Light mode
                "dark:bg-senary/30 dark:text-senary" // Dark mode
              )}>
                <CreditCard className="h-4 w-4" />
              </div>
              <span>Crédits Actifs</span>
            </CardTitle>
          </div>
          <CardDescription className="text-sm dark:text-gray-400">Mensualités des crédits en cours</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex items-center justify-center p-0 w-full">
          <div className="w-full max-w-[250px] mx-auto h-[230px] flex items-center justify-center">
            <ChartContainer className="h-full w-full" config={chartConfig}>
              <PieChart width={250} height={230}>
                <Tooltip content={<CustomTooltip />} />
                
                <Pie 
                  data={chartData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={65} 
                  outerRadius={90}
                  paddingAngle={4}
                  isAnimationActive={true}
                  animationBegin={200}
                  animationDuration={800}
                  cornerRadius={6}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <g>
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                              <tspan 
                                x={viewBox.cx} 
                                y={viewBox.cy - 5} 
                                className="fill-current text-senary dark:text-senary text-xl font-bold"
                              >
                                {formatCurrency(activeTotalMensualites, 0)}
                              </tspan>
                              <tspan 
                                x={viewBox.cx} 
                                y={(viewBox.cy || 0) + 18} 
                                 className="fill-current text-gray-500 dark:text-gray-400 text-sm"
                              >
                                par mois
                              </tspan>
                            </text>
                          </g>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreditsPieChart;
