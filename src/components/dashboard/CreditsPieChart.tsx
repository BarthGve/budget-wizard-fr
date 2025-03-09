import { Label, Pie, PieChart, Tooltip } from "recharts";
import { formatCurrency } from "@/utils/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";

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

// Composant personnalisé pour le tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm shadow-md border border-border rounded-lg p-2 text-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p className="font-semibold text-purple-600">{formatCurrency(payload[0].value)}</p>
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
      fill: COLORS[index % COLORS.length]
    }));

  const chartConfig = {
    value: {
      label: "Montant"
    },
    ...Object.fromEntries(credits.map((credit, index) => [credit.nom_credit, {
      label: credit.nom_credit,
      color: COLORS[index % COLORS.length]
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
    >
      <Card 
        className="bg-gradient-to-br from-background to-purple-50 backdrop-blur-sm shadow-lg border border-purple-100 cursor-pointer h-[320px] flex flex-col"
        onClick={() => navigate("/credits")}
      >
        <CardHeader className="py-3 pb-0"> {/* Padding réduit */}
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2"> {/* Taille du texte réduite */}
              <CreditCard className="h-5 w-5 text-purple-500" /> {/* Icône plus petite */}
              Crédits
            </CardTitle>
          </div>
          <CardDescription className="text-sm">Vue d'ensemble des mensualités</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center pb-2 pt-0"> {/* Centrage vertical et padding optimisés */}
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
                            <tspan x={viewBox.cx} y={viewBox.cy - 5} className="fill-foreground text-2xl font-bold"> {/* Taille du texte augmentée */}
                              {formatCurrency(totalMensualites)}
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 18} className="fill-muted-foreground text-sm"> {/* Position et taille ajustées */}
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

export default CreditsPieChart;

