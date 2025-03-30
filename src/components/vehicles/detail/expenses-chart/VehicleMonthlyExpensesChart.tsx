
import { VehicleExpensesBarChart } from "./VehicleExpensesBarChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { AddRecurringExpenseDialog } from "../AddRecurringExpenseDialog";
import { BarChart3, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { ExpensesChartContent } from "./components/ExpensesChartContent";
import { useVehicleDetail } from "@/hooks/useVehicleDetail";
import { useIsMobile } from "@/hooks/use-mobile";

interface VehicleMonthlyExpensesChartProps {
  vehicleId: string;
}

export const VehicleMonthlyExpensesChart = ({
  vehicleId
}: VehicleMonthlyExpensesChartProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const { vehicle } = useVehicleDetail(vehicleId);
  const isMobile = useIsMobile(); // Utiliser le hook pour détecter si on est sur mobile
  
  // Vérifier si le véhicule est vendu
  const isVehicleSold = vehicle?.status === 'vendu';

  // Si on est sur mobile, ne pas afficher le composant du tout
  if (isMobile) {
    return null;
  }

  return (
    <Card className={cn(
      "w-full relative overflow-hidden",
      "border shadow-sm",
      "bg-white border-gray-200 hover:border-gray-300",
      "dark:bg-gray-900 dark:border-gray-800 dark:hover:border-gray-700",
      isVehicleSold && "border-gray-300 dark:border-gray-700"
    )}
    style={{
      boxShadow: isDarkMode
        ? "0 4px 20px -4px rgba(0, 0, 0, 0.2), 0 1px 3px -1px rgba(0, 0, 0, 0.2)"
        : "0 4px 20px -4px rgba(100, 100, 100, 0.15), 0 1px 3px -1px rgba(0, 0, 0, 0.05)"
    }}>
      <div className={cn(
        "absolute inset-0 opacity-5",
        "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-400 via-gray-300 to-transparent",
        "dark:opacity-10 dark:from-gray-500 dark:via-gray-600 dark:to-transparent"
      )} />
      
      <CardHeader className={cn(
        "flex flex-row items-center justify-between pb-2 relative z-10",
        "border-b border-gray-200 dark:border-gray-800",
        "bg-gradient-to-r from-gray-50 to-gray-100/50",
        "dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800/40"
      )}>
        <div>
          <CardTitle className={cn(
            "text-xl font-semibold flex items-center gap-2",
            "text-gray-700 dark:text-gray-300"
          )}>
            <div className={cn(
              "p-1.5 rounded-md",
              "bg-gray-200/80 dark:bg-gray-700/50"
            )}>
              <TrendingUp className={cn(
                "h-5 w-5",
                "text-gray-600 dark:text-gray-400"
              )} />
            </div>
            Évolution des dépenses
          </CardTitle>
        </div>
        <div className="flex gap-2">
          {!isVehicleSold && <AddRecurringExpenseDialog vehicleId={vehicleId} />}
        </div>
      </CardHeader>
      
      <ExpensesChartContent vehicleId={vehicleId} isVehicleSold={isVehicleSold} />
    </Card>
  );
};
