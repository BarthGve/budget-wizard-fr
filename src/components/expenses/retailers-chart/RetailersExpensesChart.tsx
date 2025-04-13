
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "@/types/expense";
import { BarChart3, CalendarRange, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { EmptyState } from "./components/EmptyState";
import { MonthlyBarChart } from "./components/MonthlyBarChart";
import { YearlyBarChart } from "./components/YearlyBarChart";
import { CurrentYearMonthlyChart } from "./components/CurrentYearMonthlyChart";
import { useChartData } from "./hooks/useChartData";

interface RetailersExpensesChartProps {
  expenses: Expense[];
  retailers: Array<{
    id: string;
    name: string;
  }>;
  viewMode: 'monthly' | 'yearly';
}

export function RetailersExpensesChart({ expenses, retailers, viewMode }: RetailersExpensesChartProps) {
  const [dataVersion, setDataVersion] = useState(0);
  const [yearlyViewMode, setYearlyViewMode] = useState<'yearly-totals' | 'monthly-in-year'>('yearly-totals');

  // Mettre à jour la version des données quand les dépenses ou le mode de visualisation changent
  useEffect(() => {
    setDataVersion(prev => prev + 1);
  }, [expenses, viewMode, yearlyViewMode]);

  // Utiliser notre hook personnalisé pour préparer les données
  const { retailerExpenses, yearlyData, topRetailers, hasData } = useChartData(
    expenses,
    retailers,
    viewMode,
    yearlyViewMode
  );

  // Si pas de données, afficher un message
  if (!hasData) {
    return <EmptyState viewMode={viewMode} />;
  }

  const currentYear = new Date().getFullYear();

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 relative h-full",
      "border shadow-lg",
      // Light mode
      "bg-white border-tertiary-100",
      // Dark mode
      "dark:bg-gray-800/90 dark:border-tertiary-800/50"
    )}>
      {/* Fond radial gradient */}
      <div className={cn(
        "absolute inset-0 opacity-5",
        // Light mode
        "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-tertiary-400 via-tertiary-300 to-transparent",
        // Dark mode
        "dark:opacity-10 dark:from-tertiary-400 dark:via-tertiary-500 dark:to-transparent"
      )} />
      
      <CardHeader className="pb-2 pt-6 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className={cn(
              // Light mode
              "bg-tertiary-100 text-tertiary-700",
              // Dark mode
              "dark:bg-tertiary-800/40 dark:text-tertiary-300",
              // Common
              "p-2 rounded-lg"
            )}>
              <BarChart3 className="h-4 w-4" />
            </div>
            <CardTitle className={cn(
              "text-lg font-semibold",
            )}>
              {viewMode === 'monthly' 
                ? "Dépenses par enseigne (mois en cours)" 
                : yearlyViewMode === 'yearly-totals'
                  ? "Dépenses annuelles par enseigne"
                  : `Dépenses mensuelles par enseigne (${currentYear})`}
            </CardTitle>
          </div>
          
          {/* Switch pour alterner entre les deux modes de vue annuelle (seulement affiché en mode annuel) */}
          {viewMode === 'yearly' && (
            <div className="flex items-center p-1 bg-tertiary-50 rounded-full border border-tertiary-100 dark:bg-tertiary-900/20 dark:border-tertiary-800/60">
              <div className="flex items-center space-x-2 px-3">
                <CalendarRange className={cn(
                  "h-4 w-4",
                  yearlyViewMode === 'yearly-totals' 
                    ? "text-tertiary-600 dark:text-tertiary-300" 
                    : "text-gray-400 dark:text-gray-500"
                )} />
                <Label 
                  htmlFor="yearly-view-mode" 
                  className={cn(
                    yearlyViewMode === 'yearly-totals' 
                      ? "text-tertiary-600 font-medium dark:text-tertiary-300" 
                      : "text-gray-400 dark:text-gray-500"
                  )}
                >
                  Par année
                </Label>
              </div>
              
              <Switch
                id="yearly-view-mode"
                checked={yearlyViewMode === 'monthly-in-year'}
                onCheckedChange={(checked) => setYearlyViewMode(checked ? 'monthly-in-year' : 'yearly-totals')}
                className="data-[state=checked]:bg-tertiary-600 dark:data-[state=checked]:bg-tertiary-500"
              />
              
              <div className="flex items-center space-x-2 px-3">
                <Label 
                  htmlFor="yearly-view-mode" 
                  className={cn(
                    yearlyViewMode === 'monthly-in-year' 
                      ? "text-tertiary-600 font-medium dark:text-tertiary-300" 
                      : "text-gray-400 dark:text-gray-500"
                  )}
                >
                  Par mois
                </Label>
                <Calendar className={cn(
                  "h-4 w-4",
                  yearlyViewMode === 'monthly-in-year' 
                    ? "text-tertiary-600 dark:text-tertiary-300" 
                    : "text-gray-400 dark:text-gray-500"
                )} />
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-1 pb-6 relative z-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${yearlyViewMode}-${dataVersion}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-[280px]"
          >
            {viewMode === 'monthly' ? (
              <MonthlyBarChart retailerExpenses={retailerExpenses} />
            ) : yearlyViewMode === 'yearly-totals' ? (
              <YearlyBarChart yearlyData={yearlyData} topRetailers={topRetailers} />
            ) : (
              <CurrentYearMonthlyChart monthlyData={yearlyData} topRetailers={topRetailers} />
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
