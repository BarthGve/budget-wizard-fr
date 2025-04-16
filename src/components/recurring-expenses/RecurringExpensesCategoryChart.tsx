
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart as BarChartIcon, ChevronLeft, ChevronRight, InfoIcon } from "lucide-react";
import { RecurringExpense } from "./types";
import { formatCurrency } from "@/utils/format";
import { itemVariants } from "./animations/AnimationVariants";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useChartColors } from "@/hooks/useChartColors";

interface RecurringExpensesCategoryChartProps {
  expenses: RecurringExpense[];
  selectedPeriod: "monthly" | "quarterly" | "yearly" | null;
}

export const RecurringExpensesCategoryChart = ({ expenses, selectedPeriod }: RecurringExpensesCategoryChartProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  // Utiliser le hook useChartColors pour obtenir les couleurs tertiary
  const tertiaryColors = useChartColors("tertiary", 5);
  
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

  // Extraire les dépenses liées aux véhicules
  const vehicleExpenses = useMemo(() => {
    return filteredExpenses.filter(expense => expense.vehicle_id !== null);
  }, [filteredExpenses]);

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

  // Calculer le total des dépenses liées aux véhicules
  const totalVehicleExpenses = useMemo(() => 
    vehicleExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    [vehicleExpenses]
  );

  // Pourcentage des dépenses liées aux véhicules par rapport au total
  const vehicleExpensesPercentage = useMemo(() => 
    totalAmount > 0 ? (totalVehicleExpenses / totalAmount) * 100 : 0,
    [totalAmount, totalVehicleExpenses]
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

  // Générer des couleurs pour les barres en utilisant les couleurs tertiary
  const getBarColor = (index: number) => {
    // Utiliser les couleurs de tertiary au lieu des couleurs codées en dur
    const baseColors = {
      light: {
        active: tertiaryColors.base, // Couleur de base pour l'élément actif
        inactive: tertiaryColors.lighter[0] // Première variante plus claire pour les éléments inactifs
      },
      dark: {
        active: tertiaryColors.base, // Couleur de base pour l'élément actif
        inactive: tertiaryColors.lighter[0] // Première variante plus claire pour les éléments inactifs
      }
    };
    
    const colors = isDarkMode ? baseColors.dark : baseColors.light;
    return index === activeIndex ? colors.active : colors.inactive;
  };

  // Formater les pourcentages
  const formatPercentage = (value: number) => {
    return `${((value / totalAmount) * 100).toFixed(1)}%`;
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className={cn(
        "w-full relative overflow-hidden",
        "border shadow-lg",
        // Light mode
        "bg-white border-tertiary-100",
        // Dark mode
        "dark:bg-gray-800/90 dark:border-tertiary-800/50 dark:shadow-tertiary-900/10",
      "mb-6"
      )}>
   
        
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
          <div>
            <CardTitle className={cn(
              "text-xl font-semibold flex items-center gap-2",
         
            )}>
              <div className={cn(
                "p-1.5 rounded",
                // Light mode
                "bg-tertiary-100",
                // Dark mode
                "dark:bg-tertiary-800/40"
              )}>
                <BarChartIcon className={cn(
                  "h-5 w-5",
                  // Light mode
                  "text-tertiary-600",
                  // Dark mode
                  "dark:text-tertiary-400"
                )} />
              </div>
              Dépenses par catégorie
            </CardTitle>
            <CardDescription className={cn(
              "mt-1 text-sm",
              // Light mode
              "text-tertiary-600/80",
              // Dark mode
              "dark:text-tertiary-400/90"
            )}>
              Répartition des charges {selectedPeriod ? periodicityLabels[selectedPeriod].toLowerCase() : chartPeriodicity === "monthly" ? "mensuelles" : chartPeriodicity === "quarterly" ? "trimestrielles" : "annuelles"}
              
              {vehicleExpenses.length > 0 && (
                <span className="ml-2 inline-flex items-center">
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center cursor-help">
                          <InfoIcon className="h-4 w-4 text-tertiary-500 dark:text-tertiary-400" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          {vehicleExpenses.length} charge(s) récurrente(s) liée(s) à des véhicules 
                          représentant {vehicleExpensesPercentage.toFixed(1)}% du total des charges
                          ({formatCurrency(totalVehicleExpenses)})
                        </p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </span>
              )}
            </CardDescription>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handlePeriodicityChange}
            disabled={!!selectedPeriod}
            className={cn(
              "flex items-center gap-1 transition-colors font-medium",
              // Light mode
              "border-tertiary-200 hover:bg-tertiary-50 text-tertiary-700",
              // Dark mode
              "dark:border-tertiary-800 dark:hover:bg-tertiary-900/30 dark:text-tertiary-300"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            {buttonText}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="px-2 pb-6 relative z-10">
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
                        tick={{ fill: isDarkMode ? `hsl(var(--tertiary-300))` : `hsl(var(--tertiary-600))` }}
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
                        tick={{ fill: isDarkMode ? `hsl(var(--tertiary-300))` : `hsl(var(--tertiary-600))` }}
                      />
                      <Tooltip 
                        formatter={(value) => [
                          `${formatCurrency(Number(value))} (${formatPercentage(Number(value))})`, 
                          "Montant"
                        ]}
                        labelFormatter={(label) => `Catégorie: ${label}`}
                        contentStyle={{
                          backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          border: isDarkMode ? `1px solid hsl(var(--tertiary-700))` : `1px solid hsl(var(--tertiary-200))`,
                          color: isDarkMode ? `hsl(var(--tertiary-300))` : `hsl(var(--tertiary-700))`
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
                  <div className={cn(
                    "h-full flex items-center justify-center",
                    // Light mode
                    "text-tertiary-500/70",
                    // Dark mode
                    "dark:text-tertiary-400/70"
                  )}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-center"
                    >
                      <div className="mb-2">
                        <BarChartIcon className="h-12 w-12 mx-auto opacity-30" />
                      </div>
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
