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

interface RecurringExpensesCategoryChartProps {
  expenses: RecurringExpense[];
  selectedPeriod: "monthly" | "quarterly" | "yearly" | null;
}

export const RecurringExpensesCategoryChart = ({ expenses, selectedPeriod }: RecurringExpensesCategoryChartProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  const [chartPeriodicity, setChartPeriodicity] = useState<"monthly" | "quarterly" | "yearly">("monthly");
  const [dataVersion, setDataVersion] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    setDataVersion(prev => prev + 1);
  }, [expenses, selectedPeriod]);

  const filteredExpenses = useMemo(() => {
    if (selectedPeriod) {
      return expenses.filter(expense => expense.periodicity === selectedPeriod);
    }
    return expenses.filter(expense => expense.periodicity === chartPeriodicity);
  }, [expenses, selectedPeriod, chartPeriodicity]);

  const vehicleExpenses = useMemo(() => {
    return filteredExpenses.filter(expense => expense.vehicle_id !== null);
  }, [filteredExpenses]);

  const chartData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    filteredExpenses.forEach(expense => {
      const currentAmount = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, currentAmount + expense.amount);
    });
    
    return Array.from(categoryMap.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 7);
  }, [filteredExpenses]);

  const totalAmount = useMemo(() => 
    chartData.reduce((sum, item) => sum + item.total, 0),
    [chartData]
  );

  const totalVehicleExpenses = useMemo(() => 
    vehicleExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    [vehicleExpenses]
  );

  const vehicleExpensesPercentage = useMemo(() => 
    totalAmount > 0 ? (totalVehicleExpenses / totalAmount) * 100 : 0,
    [totalAmount, totalVehicleExpenses]
  );

  const handlePeriodicityChange = () => {
    if (selectedPeriod) return;
    if (chartPeriodicity === "monthly") {
      setChartPeriodicity("quarterly");
    } else if (chartPeriodicity === "quarterly") {
      setChartPeriodicity("yearly");
    } else {
      setChartPeriodicity("monthly");
    }
  };

  const periodicityLabels = {
    monthly: "Mensuel",
    quarterly: "Trimestriel",
    yearly: "Annuel"
  };

  const buttonText = selectedPeriod 
    ? periodicityLabels[selectedPeriod] 
    : periodicityLabels[chartPeriodicity];

  // Remplacement des couleurs bleues par tertiary avec opacités ou dégradés cohérents
  const getBarColor = (index: number) => {
    const baseColors = {
      light: {
        active: '#0284C7', // tertiary-600
        inactive: '#67A6D6' // tertiary-400
      },
      dark: {
        active: '#0369A1', // tertiary-500
        inactive: '#A3C8E1' // tertiary-300
      }
    };
    
    const colors = isDarkMode ? baseColors.dark : baseColors.light;
    return index === activeIndex ? colors.active : colors.inactive;
  };

  const formatPercentage = (value: number) => {
    return `${((value / totalAmount) * 100).toFixed(1)}%`;
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className={cn(
        "w-full relative overflow-hidden",
        "border shadow-lg",
        "bg-white border-tertiary-100",
        "dark:bg-gray-800/90 dark:border-tertiary-800/50 dark:shadow-tertiary-900/10",
      "mb-6"
      )}>
        <div className={cn(
          "absolute inset-0 opacity-5",
          "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-tertiary-400 via-tertiary-300 to-transparent",
          "dark:opacity-10 dark:from-tertiary-400 dark:via-tertiary-500 dark:to-transparent"
        )} />
        
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
          <div>
            <CardTitle className={cn(
              "text-xl font-semibold flex items-center gap-2",
              "text-tertiary-700",
              "dark:text-tertiary-300"
            )}>
              <div className={cn(
                "p-1.5 rounded",
                "bg-tertiary-100",
                "dark:bg-tertiary-800/40"
              )}>
                <BarChartIcon className={cn(
                  "h-5 w-5",
                  "text-tertiary-600",
                  "dark:text-tertiary-400"
                )} />
              </div>
              Dépenses par catégorie
            </CardTitle>
            <CardDescription className={cn(
              "mt-1 text-sm",
              "text-tertiary-600/80",
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
              "border-tertiary-200 hover:bg-tertiary-50 text-tertiary-700",
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
                        tick={{ fill: isDarkMode ? '#A3C8E1' : '#0284C7' }}
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
                        tick={{ fill: isDarkMode ? '#A3C8E1' : '#0284C7' }}
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
                          border: isDarkMode ? '1px solid #1e40af' : '1px solid #bfdbfe',
                          color: isDarkMode ? '#bfdbfe' : '#1e40af'
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
                    "text-tertiary-500/70",
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