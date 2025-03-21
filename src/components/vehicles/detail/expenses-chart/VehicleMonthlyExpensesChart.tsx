
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChartBig, CalendarDays, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { VehicleExpensesBarChart } from "./VehicleExpensesBarChart";

interface VehicleMonthlyExpensesChartProps {
  vehicleId: string;
}

export const VehicleMonthlyExpensesChart = ({ vehicleId }: VehicleMonthlyExpensesChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={cn(
        "w-full relative overflow-hidden",
        "border shadow-sm",
        // Light mode
        "bg-white border-gray-100",
        // Dark mode
        "dark:bg-gray-800/90 dark:border-gray-700/50 dark:shadow-gray-900/10"
      )}>
        <div className={cn(
          "absolute inset-0 opacity-5",
          // Light mode
          "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-400 via-gray-300 to-transparent",
          // Dark mode
          "dark:opacity-10 dark:from-gray-400 dark:via-gray-500 dark:to-transparent"
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
                <BarChartBig className={cn(
                  "h-5 w-5",
                  // Light mode
                  "text-gray-600",
                  // Dark mode
                  "dark:text-gray-400"
                )} />
              </div>
              Dépenses mensuelles
            </CardTitle>
            <CardDescription className={cn(
              "mt-1 text-sm",
              // Light mode
              "text-gray-600/80",
              // Dark mode
              "dark:text-gray-400/90"
            )}>
              Répartition des dépenses mensuelles par catégorie pour l'année en cours
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`vehicle-expenses-chart`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <VehicleExpensesBarChart vehicleId={vehicleId} />
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};
