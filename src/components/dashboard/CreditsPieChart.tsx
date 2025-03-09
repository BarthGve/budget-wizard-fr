
import { Label, Pie, PieChart } from "recharts";
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
        className="bg-gradient-to-br from-background to-purple-50 backdrop-blur-sm shadow-lg border border-purple-100 cursor-pointer h-[370px] flex flex-col"
        onClick={() => navigate("/credits")}
      >
        <CardHeader className="py-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-purple-500" />
              Crédits
            </CardTitle>
          </div>
          <CardDescription>Vue d'ensemble des mensualités</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between pb-4">
          <div className="mx-auto w-full h-[220px]">
            <ChartContainer className="h-full" config={chartConfig}>
              <PieChart>
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
                        <g>
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={viewBox.cx} y={viewBox.cy - 5} className="fill-foreground text-xl font-bold">
                              {formatCurrency(totalMensualites)}
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 15} className="fill-muted-foreground text-xs">
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
          
          <div className="mt-auto space-y-2">
            
            
            {/* Message récapitulatif */}
            <div className="text-xs text-muted-foreground text-center pt-1">
              {formatCreditSummary()}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreditsPieChart;

