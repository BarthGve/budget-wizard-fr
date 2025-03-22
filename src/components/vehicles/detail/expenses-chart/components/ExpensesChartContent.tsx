
import { useState } from "react";
import { useExpensesChartData } from "../hooks/useExpensesChartData"; 
import { ExpensesChartLoading } from "./ExpensesChartLoading";
import { ExpensesChartEmpty } from "./ExpensesChartEmpty";
import { CardContent } from "@/components/ui/card";
import { ExpensesBarChartRenderer } from "./ExpensesBarChartRenderer";
import { GradientBackground } from "./GradientBackground";
import { ExpensesChartHeader } from "./ExpensesChartHeader";

interface ExpensesChartContentProps {
  vehicleId: string;
  isVehicleSold?: boolean;
}

export const ExpensesChartContent = ({ vehicleId, isVehicleSold = false }: ExpensesChartContentProps) => {
  const [showMultiYear, setShowMultiYear] = useState<boolean>(false);
  const { expenses, chartData, isLoading, error } = useExpensesChartData(vehicleId, showMultiYear);

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
      <CardContent className="p-4 pt-0">
        <ExpensesChartHeader 
          title={title}
          description={description}
          showMultiYear={showMultiYear}
          onToggleView={handleToggleView}
          isVehicleSold={isVehicleSold}
        />
        
        <div className="relative h-[300px] mt-4">
          <GradientBackground />
          
          {isLoading ? (
            <ExpensesChartLoading />
          ) : !chartData || chartData.length === 0 ? (
            <ExpensesChartEmpty />
          ) : (
            <ExpensesBarChartRenderer data={chartData} showMultiYear={showMultiYear} />
          )}
        </div>
      </CardContent>
    </>
  );
};
