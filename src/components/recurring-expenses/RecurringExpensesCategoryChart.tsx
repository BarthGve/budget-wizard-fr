
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
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

  // Mettre à jour la version des données lorsque les dépenses changent pour déclencher l'animation
  useEffect(() => {
    setDataVersion(prev => prev + 1);
  }, [expenses, selectedPeriod]);

  // Filtrer les dépenses en fonction de la période sélectionnée
  const filteredExpenses = useMemo(() => {
    if (selectedPeriod) {
      return expenses.filter(expense => expense.periodicity === selectedPeriod);
    }
    return expenses;
  }, [expenses, selectedPeriod]);

  // Calculer les données par catégorie pour le graphique
  const chartData = useMemo(() => {
    // Regrouper les dépenses par catégorie
    const categoryMap = new Map<string, number>();
    
    filteredExpenses.forEach(expense => {
      const amount = expense.amount;
      // Ajuster le montant selon la périodicité affichée
      let adjustedAmount = amount;
      
      if (chartPeriodicity === "monthly") {
        if (expense.periodicity === "quarterly") {
          adjustedAmount = amount / 3;
        } else if (expense.periodicity === "yearly") {
          adjustedAmount = amount / 12;
        }
      } else if (chartPeriodicity === "quarterly") {
        if (expense.periodicity === "monthly") {
          adjustedAmount = amount * 3;
        } else if (expense.periodicity === "yearly") {
          adjustedAmount = amount / 4;
        }
      } else if (chartPeriodicity === "yearly") {
        if (expense.periodicity === "monthly") {
          adjustedAmount = amount * 12;
        } else if (expense.periodicity === "quarterly") {
          adjustedAmount = amount * 4;
        }
      }
      
      const currentAmount = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, currentAmount + adjustedAmount);
    });
    
    // Convertir en tableau pour Recharts et trier par montant (décroissant)
    return Array.from(categoryMap.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }, [filteredExpenses, chartPeriodicity]);

  // Gérer le changement de périodicité du graphique
  const handlePeriodicityChange = () => {
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

  return (
    <motion.div variants={itemVariants}>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-md font-medium flex items-center gap-2">
            <BarChartIcon className="h-5 w-5" />
            Dépenses par catégorie
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePeriodicityChange}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {periodicityLabels[chartPeriodicity]}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="px-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={`chart-${dataVersion}-${chartPeriodicity}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="h-[250px] w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                      <YAxis 
                        type="category" 
                        dataKey="category" 
                        width={120}
                        tickFormatter={(value) => 
                          value.length > 15 ? `${value.substring(0, 15)}...` : value
                        }
                      />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(Number(value)), "Montant"]}
                        labelFormatter={(label) => `Catégorie: ${label}`}
                      />
                      <Bar 
                        dataKey="total" 
                        fill="#8B5CF6"
                        radius={[0, 4, 4, 0]}
                        maxBarSize={30}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Aucune donnée disponible
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
