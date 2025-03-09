import { Label, Pie, PieChart, Tooltip } from "recharts";
import { formatCurrency } from "@/utils/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

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

// Palette de couleurs plus harmonieuse avec le thème violet primaire
const COLORS = ['#9b87f5', '#a78bfa', '#8B5CF6', '#7C3AED', '#6D28D9', '#5b21b6', '#4c1d95'];

// Couleurs pour dark mode - légèrement plus lumineuses pour meilleure visibilité
const DARK_COLORS = ['#b39dff', '#b69eff', '#9d78ff', '#8b52ff', '#7d3fef', '#6d32d9', '#5d29b6'];

// Composant personnalisé pour le tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm shadow-md border border-border rounded-lg p-2 text-sm dark:bg-gray-800/95 dark:border-gray-700">
        <p className="font-medium dark:text-white">{payload[0].name}</p>
        <p className="font-semibold text-purple-600 dark:text-purple-300">{formatCurrency(payload[0].value)}</p>
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
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const chartColors = isDarkMode ? DARK_COLORS : COLORS;

  const chartData = credits
    .filter(credit => {
      const today = new Date();
      const lastPaymentDate = new Date(credit.date_derniere_mensualite);
      const isInCurrentMonth = lastPaymentDate.getMonth() === today.getMonth() && 
                             lastPaymentDate.getFullYear() === today.getFullYear();
      return credit.statut === 'actif' || isInCurrentMonth;
    })
    .map((credit, index) => ({
      name: credit.nom_credit,
      value: credit.montant_mensualite,
      fill: chartColors[index % chartColors.length]
    }));

  const chartConfig = {
    value: {
      label: "Montant"
    },
    ...Object.fromEntries(credits.map((credit, index) => [credit.nom_credit, {
      label: credit.nom_credit,
      color: chartColors[index % chartColors.length]
    }]))
  };

  // Format custom pour afficher la structure des crédits
  const formatCreditSummary = () => {
    if (credits.length === 0) return "Aucun crédit actif";
    if (credits.length === 1) return `1 crédit: ${credits[0].nom_credit}`;
    return `${credits.length} crédits actifs`;
  };

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
          "cursor-pointer h-[320px] flex flex-col shadow-sm transition-all duration-300 hover:shadow-lg",
          // Light mode - fond blanc
          "bg-white border border-gray-100",
          // Dark mode - fond adapté
          "dark:bg-gray-900/80 dark:border-purple-900/20 dark:shadow-purple-900/5"
        )}
        onClick={() => navigate("/credits")}
      >
        <CardHeader className="py-3 pb-0">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <div className={cn(
                "p-1.5 rounded-full",
                "bg-purple-100 text-purple-600", // Light mode
                "dark:bg-purple-900/40 dark:text-purple-300" // Dark mode
              )}>
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="dark:text-white">Crédits</span>
            </CardTitle>
          </div>
          <CardDescription className="text-sm dark:text-gray-400">Vue d'ensemble des mensualités</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex items-center justify-center pb-2 pt-0 w-full">
          <div className="w-full max-w-[250px] mx-auto h-[230px] flex items-center justify-center">
            <ChartContainer className="h-full w-full" config={chartConfig}>
              <PieChart width={250} height={230}>
                <Tooltip content={<CustomTooltip />} />
                
                <Pie 
                  data={chartData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" /* Centrage exact horizontal */
                  cy="50%" /* Centrage exact vertical */
                  innerRadius={65} 
                  outerRadius={90}
                  paddingAngle={5}
                  isAnimationActive={true}
                  animationBegin={200}
                  animationDuration={800}
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
                                className="fill-current text-gray-900 dark:text-gray-100 text-xl font-bold"
                              >
                                {formatCurrency(totalMensualites)}
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
