
import { VehicleExpensesBarChart } from "./VehicleExpensesBarChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { AddRecurringExpenseDialog } from "../AddRecurringExpenseDialog";
import { BarChart3, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { ExpensesChartContent } from "./components/ExpensesChartContent";

interface VehicleMonthlyExpensesChartProps {
  vehicleId: string;
}

export const VehicleMonthlyExpensesChart = ({
  vehicleId
}: VehicleMonthlyExpensesChartProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <Card className={cn(
      "w-full relative overflow-hidden",
      "border shadow-sm",
      // Light mode
      "bg-white border-gray-200",
      // Dark mode
      "dark:bg-gray-800/90 dark:border-gray-700/50 dark:shadow-gray-900/10"
    )}
    style={{
      boxShadow: isDarkMode
        ? "0 4px 20px -4px rgba(0, 0, 0, 0.2), 0 1px 3px -1px rgba(0, 0, 0, 0.2)"
        : "0 4px 20px -4px rgba(100, 100, 100, 0.15), 0 1px 3px -1px rgba(0, 0, 0, 0.05)"
    }}>
      <div className={cn(
        "absolute inset-0 opacity-5",
        // Light mode
        "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-400 via-gray-300 to-transparent",
        // Dark mode
        "dark:opacity-10 dark:from-gray-500 dark:via-gray-600 dark:to-transparent"
      )} />
      
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
        <div>
          <CardTitle className={cn(
            "text-xl font-semibold flex items-center gap-2",
            // Light mode
            "text-gray-700",
            // Dark mode
            "dark:text-gray-300"
          )}>
            <div className={cn(
              "p-1.5 rounded",
              // Light mode
              "bg-gray-100",
              // Dark mode
              "dark:bg-gray-800/40"
            )}>
              <TrendingUp className={cn(
                "h-5 w-5",
                // Light mode
                "text-gray-600",
                // Dark mode
                "dark:text-gray-400"
              )} />
            </div>
            Évolution des dépenses mensuelles
          </CardTitle>
        </div>
        <div className="flex gap-2">
          <AddRecurringExpenseDialog vehicleId={vehicleId} />
        </div>
      </CardHeader>
      
      {/* Nous utilisons le composant ExpensesChartContent qui contient VehicleExpensesBarChart */}
      <ExpensesChartContent vehicleId={vehicleId} />
    </Card>
  );
};
