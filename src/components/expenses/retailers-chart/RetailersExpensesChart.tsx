
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "@/types/expense";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

import { EmptyState } from "./components/EmptyState";
import { MonthlyBarChart } from "./components/MonthlyBarChart";
import { YearlyBarChart } from "./components/YearlyBarChart";
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

  // Mettre à jour la version des données quand les dépenses ou le mode de visualisation changent
  useEffect(() => {
    setDataVersion(prev => prev + 1);
  }, [expenses, viewMode]);

  // Utiliser notre hook personnalisé pour préparer les données
  const { retailerExpenses, yearlyData, topRetailers, hasData } = useChartData(
    expenses,
    retailers,
    viewMode
  );

  // Si pas de données, afficher un message
  if (!hasData) {
    return <EmptyState viewMode={viewMode} />;
  }

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 relative h-full",
      "border shadow-sm hover:shadow-md",
      // Light mode
      "bg-white border-blue-100",
      // Dark mode
      "dark:bg-gray-800/90 dark:hover:bg-blue-900/20 dark:border-blue-800/50"
    )}>
      {/* Fond radial gradient */}
      <div className={cn(
        "absolute inset-0 opacity-5",
        // Light mode
        "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-blue-300 to-transparent",
        // Dark mode
        "dark:opacity-10 dark:from-blue-400 dark:via-blue-500 dark:to-transparent"
      )} />
      
      <CardHeader className="pb-2 pt-6 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className={cn(
              // Light mode
              "bg-blue-100 text-blue-700",
              // Dark mode
              "dark:bg-blue-800/40 dark:text-blue-300",
              // Common
              "p-2 rounded-lg"
            )}>
              <BarChart3 className="h-4 w-4" />
            </div>
            <CardTitle className={cn(
              "text-lg font-semibold",
              // Light mode
              "text-blue-700",
              // Dark mode
              "dark:text-blue-300"
            )}>
              {viewMode === 'monthly' 
                ? "Dépenses par enseigne (mois en cours)" 
                : "Dépenses annuelles par enseigne"}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-1 pb-6 relative z-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={dataVersion}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-[280px]"
          >
            {viewMode === 'monthly' ? (
              <MonthlyBarChart retailerExpenses={retailerExpenses} />
            ) : (
              <YearlyBarChart yearlyData={yearlyData} topRetailers={topRetailers} />
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
