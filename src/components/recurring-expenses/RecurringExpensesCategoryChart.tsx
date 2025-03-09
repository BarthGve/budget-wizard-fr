import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart as BarChartIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { RecurringExpense } from "./types";
import { formatCurrency } from "@/utils/format";
import { itemVariants } from "./animations/AnimationVariants";

interface RecurringExpensesCategoryChartProps {
  expenses: RecurringExpense[];
  selectedPeriod: "monthly" | "quarterly" | "yearly" | null;
}

export const RecurringExpensesCategoryChart = ({ expenses, selectedPeriod }: RecurringExpensesCategoryChartProps) => {
  // État local pour le type de périodicité à afficher dans le graphique
  const [chartPeriodicity, setChartPeriodicity] = useState<"monthly" | "quarterly" | "yearly">("monthly");
  // Trackons un ID de données pour l'animation
  const [dataVersion, setDataVersion] = useState(0);
  // Hover state pour l'animation des barres
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Mettre à jour la version des données lorsque les dépenses changent pour déclencher l'animation
  useEffect(() => {
    setDataVersion(prev => prev + 1);
  }, [expenses, selectedPeriod]);

  // Filtrer les dépenses en fonction de la période sélectionnée
  const filteredExpenses = useMemo(() => {
    // Si une périodicité est déjà sélectionnée depuis l'extérieur, utiliser ces dépenses uniquement
    if (selectedPeriod) {
      return expenses.filter(expense => expense.periodicity === selectedPeriod);
    }
    // Sinon filtrer selon la périodicité choisie dans le graphique lui-même
    return expenses.filter(expense => expense.periodicity === chartPeriodicity);
  }, [expenses, selectedPeriod, chartPeriodicity]);

  // Calculer les données par catégorie pour le graphique
  const chartData = useMemo(() => {
    // Regrouper les dépenses par catégorie
    const categoryMap = new Map<string, number>();
    
    filteredExpenses.forEach(expense => {
      const currentAmount = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, currentAmount + expense.amount);
    });
    
    // Convertir en tableau pour Recharts et trier par montant (décroissant)
    return Array.from(categoryMap.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 7); // Limiter aux 7 principales catégories pour une meilleure lisibilité
  }, [filteredExpenses]);

  // Calculer le total pour le pourcentage
  const totalAmount = useMemo(() => 
    chartData.reduce((sum, item) => sum + item.total, 0),
    [chartData]
  );

  // Gérer le changement de périodicité du graphique
  const handlePeriodicityChange = () => {
    // Ne pas permettre de changer la périodicité du graphique si une est déjà sélectionnée
    if (selectedPeriod) return;
    
    if (chartPeriodicity === "monthly") {
      setChartPeriodicity("quarterly");
    } else if (chartPeriodicity === "quarterly") {
      setChartPeriodicity("yearly");
    } else {
      setChartPeriodicity("monthly");
    }
  };

  // Labels de périodicité pour l'affichage
  const periodicityLabels = {
    monthly: "Mensuel",
    quarterly: "Trimestriel",
    yearly: "Annuel"
  };

  // Déterminer le texte du bouton selon si la périodicité est contrainte par une sélection externe
  const buttonText = selectedPeriod 
    ? periodicityLabels[selectedPeriod] 
    : periodicityLabels[chartPeriodicity];

  // Générer des couleurs pour les barres avec un dégradé de violet
  const getBarColor = (index: number) => {
    const baseColor = '#8B5CF6';
    const lightenedColor = '#A78BFA';
    return index === activeIndex ? baseColor : lightenedColor;
  };

  // Formater les pourcentages
  const formatPercentage = (value: number) => {
    return `${((value / totalAmount) * 100).toFixed(1)}%`;
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="w-full backdrop-blur-sm bg-background/95 shadow-lg border border-purple-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-medium flex items-center gap-2">
            <BarChartIcon className="h-8 w-8 text-purple-500" />
            Dépenses par catégorie
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePeriodicityChange}
            disabled={!!selectedPeriod}
            className="flex items-center gap-1 hover:bg-purple-50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {buttonText}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="px-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={`chart-${dataVersion}-${selectedPeriod || chartPeriodicity}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full"
            >
              <div className="h-[280px] w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
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
                      />
                      <YAxis 
                        type="category" 
                        dataKey="category" 
                        width={120}
                        tickFormatter={(value) => 
                          value.length > 15 ? `${value.substring(0, 15)}...` : value
                        }
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        formatter={(value) => [
                          `${formatCurrency(Number(value))} (${formatPercentage(Number(value))})`, 
                          "Montant"
                        ]}
                        labelFormatter={(label) => `Catégorie: ${label}`}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          border: '1px solid #f3f4f6'
                        }}
                      />
                      <Bar 
                        dataKey="total" 
                        radius={[4, 4, 4, 4]}
                        maxBarSize={30}
                        animationDuration={1000}
                        animationEasing="ease-out"
                      >
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={getBarColor(index)}
                            className="transition-all duration-200"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Aucune donnée disponible pour cette période
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};