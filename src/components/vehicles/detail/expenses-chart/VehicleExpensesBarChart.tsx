
import { useState, useEffect } from "react";
import { useExpensesChartData } from "./hooks/useExpensesChartData";
import { ExpensesChartLoading } from "./components/ExpensesChartLoading";
import { ExpensesChartEmpty } from "./components/ExpensesChartEmpty";
import { ExpensesBarChartRenderer } from "./components/ExpensesBarChartRenderer";

interface VehicleExpensesBarChartProps {
  vehicleId: string;
  isVehicleSold?: boolean;
}

export const VehicleExpensesBarChart = ({ vehicleId, isVehicleSold = false }: VehicleExpensesBarChartProps) => {
  const [dataVersion, setDataVersion] = useState(0);
  const [showMultiYear, setShowMultiYear] = useState(false);
  
  // Utilisez le hook avec le paramètre showMultiYear
  const { expenses, isLoading, chartData, currentYear, chartTitle, chartDescription } = useExpensesChartData(vehicleId, showMultiYear);

  // Mettre à jour la version des données quand les dépenses changent ou quand le mode change
  useEffect(() => {
    if (expenses) {
      setDataVersion(prev => prev + 1);
    }
  }, [expenses, showMultiYear]);

  if (isLoading) {
    return <ExpensesChartLoading />;
  }

  if (!expenses || expenses.length === 0) {
    return <ExpensesChartEmpty />;
  }

  // Fonction pour basculer entre les vues (5 ans ou année en cours)
  const handleToggleView = () => {
    if (!isVehicleSold) {
      setShowMultiYear(prev => !prev);
    }
  };

  return (
    <ExpensesBarChartRenderer 
      chartData={chartData} 
      currentYear={currentYear} 
      dataVersion={dataVersion}
      showMultiYear={showMultiYear}
      onToggleView={handleToggleView}
      chartTitle={chartTitle}
      chartDescription={chartDescription}
    />
  );
};
