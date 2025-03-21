
import { useExpensesChartData } from "./hooks/useExpensesChartData";
import { VehicleExpensesBarChart } from "./VehicleExpensesBarChart";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AddRecurringExpenseDialog } from "../AddRecurringExpenseDialog";

interface VehicleMonthlyExpensesChartProps {
  vehicleId: string;
}

export const VehicleMonthlyExpensesChart = ({ vehicleId }: VehicleMonthlyExpensesChartProps) => {
  const [showMultiYear, setShowMultiYear] = useState(false);

  const { 
    chartData, 
    isLoading, 
    chartTitle, 
    chartDescription 
  } = useExpensesChartData(vehicleId, showMultiYear);

  const toggleView = () => {
    setShowMultiYear(!showMultiYear);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{chartTitle}</h2>
          <p className="text-sm text-muted-foreground">
            {chartDescription}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleView}
          >
            {showMultiYear ? "Vue mensuelle" : "Vue annuelle"}
          </Button>
          <AddRecurringExpenseDialog vehicleId={vehicleId} />
        </div>
      </div>
      <VehicleExpensesBarChart 
        data={chartData} 
        isLoading={isLoading} 
        mode={showMultiYear ? "yearly" : "monthly"}
      />
    </div>
  );
};
