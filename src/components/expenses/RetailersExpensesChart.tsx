
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "@/types/expense";
import { cn } from "@/lib/utils";
import { ChartContainer } from "./retailers-chart/ChartContainer";
import { EmptyChart } from "./retailers-chart/EmptyChart";
import { useRetailersChartData } from "./retailers-chart/useRetailersChartData";
import { useChartStyles } from "./retailers-chart/useChartStyles";

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

  // Récupérer les styles du graphique basés sur le thème
  const { gridColor, axisColor, barColor, getBarColor } = useChartStyles();
  
  // Récupérer les données formatées pour les graphiques
  const { retailerExpenses, yearlyData, topRetailers, formattedRetailerExpenses } = useRetailersChartData(
    expenses,
    retailers,
    viewMode
  );

  // Si pas de données, afficher un message
  if ((viewMode === 'monthly' && retailerExpenses.length === 0) || 
      (viewMode === 'yearly' && yearlyData.length === 0)) {
    return <EmptyChart viewMode={viewMode} />;
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
      </CardHeader>
      <CardContent className="relative z-10">
        <ChartContainer
          viewMode={viewMode}
          dataVersion={dataVersion}
          yearlyData={yearlyData}
          retailerExpenses={formattedRetailerExpenses}
          topRetailers={topRetailers}
          gridColor={gridColor}
          axisColor={axisColor}
          barColor={barColor}
          getBarColor={getBarColor}
        />
      </CardContent>
    </Card>
  );
}
