
import { useState } from "react";
import { useExpensesChartData } from "../hooks/useExpensesChartData"; 
import { ExpensesChartLoading } from "./ExpensesChartLoading";
import { ExpensesChartEmpty } from "./ExpensesChartEmpty";
import { CardContent } from "@/components/ui/card";
import { ExpensesBarChartRenderer } from "./ExpensesBarChartRenderer";
import { GradientBackground } from "./GradientBackground";
import { ExpensesChartHeader } from "./ExpensesChartHeader";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ExpensesChartContentProps {
  vehicleId: string;
  isVehicleSold?: boolean;
}

export const ExpensesChartContent = ({ vehicleId, isVehicleSold = false }: ExpensesChartContentProps) => {
  const [showMultiYear, setShowMultiYear] = useState<boolean>(false);
  const { expenses, chartData, isLoading, currentYear, chartTitle, chartDescription } = useExpensesChartData(vehicleId, showMultiYear);

  // Fonction pour basculer entre les vues (5 ans ou année en cours)
  const handleToggleView = () => {
    if (!isVehicleSold) {
      setShowMultiYear(!showMultiYear);
    }
  };

  // Déterminer le titre et la description en fonction de la vue
  const title = showMultiYear ? "Dépenses des 5 dernières années" : "Dépenses mensuelles de l'année";
  const description = showMultiYear ? 
    "Évolution annuelle des dépenses sur les 5 dernières années" : 
    "Évolution mensuelle des dépenses pour l'année en cours";

  return (
    <>
      <CardContent className={cn(
        "p-6 pt-4 relative",
        "border-t border-gray-100 dark:border-gray-800/50"
      )}>
        <ExpensesChartHeader 
          title={title}
          description={description}
          showMultiYear={showMultiYear}
          onToggleView={handleToggleView}
          isVehicleSold={isVehicleSold}
        />
        
        <div className="relative min-h-[350px] mt-6">
          <GradientBackground />
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ExpensesChartLoading />
              </motion.div>
            ) : !chartData || chartData.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ExpensesChartEmpty />
              </motion.div>
            ) : (
              <motion.div
                key="chart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2"
              >
                <ExpensesBarChartRenderer 
                  chartData={chartData}
                  currentYear={currentYear}
                  dataVersion={showMultiYear ? 1 : 0}
                  showMultiYear={showMultiYear}
                  onToggleView={handleToggleView}
                  chartTitle={chartTitle}
                  chartDescription={chartDescription}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </>
  );
};
