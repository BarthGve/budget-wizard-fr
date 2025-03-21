
import { useState, useEffect } from "react";
import { useExpensesChartData } from "./hooks/useExpensesChartData";
import { ExpensesChartLoading } from "./components/ExpensesChartLoading";
import { ExpensesChartEmpty } from "./components/ExpensesChartEmpty";
import { ExpensesBarChartRenderer } from "./components/ExpensesBarChartRenderer";

interface VehicleExpensesBarChartProps {
  vehicleId: string;
}

export const VehicleExpensesBarChart = ({ vehicleId }: VehicleExpensesBarChartProps) => {
  const [dataVersion, setDataVersion] = useState(0);
  const { expenses, isLoading, chartData, currentYear } = useExpensesChartData(vehicleId);

  // Mettre à jour la version des données quand les dépenses changent
  useEffect(() => {
    if (expenses) {
      setDataVersion(prev => prev + 1);
    }
  }, [expenses]);

  if (isLoading) {
    return <ExpensesChartLoading />;
  }

  if (!expenses || expenses.length === 0) {
    return <ExpensesChartEmpty />;
  }

  return (
    <ExpensesBarChartRenderer 
      chartData={chartData} 
      currentYear={currentYear} 
      dataVersion={dataVersion} 
    />
  );
};
