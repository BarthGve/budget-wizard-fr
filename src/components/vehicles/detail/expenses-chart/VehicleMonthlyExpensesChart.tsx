import { VehicleExpensesBarChart } from "./VehicleExpensesBarChart";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AddRecurringExpenseDialog } from "../AddRecurringExpenseDialog";
interface VehicleMonthlyExpensesChartProps {
  vehicleId: string;
}
export const VehicleMonthlyExpensesChart = ({
  vehicleId
}: VehicleMonthlyExpensesChartProps) => {
  return <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          
          
        </div>
        <div className="flex gap-2">
          <AddRecurringExpenseDialog vehicleId={vehicleId} />
        </div>
      </div>
      
      {/* Nous passons uniquement l'ID du véhicule comme requis par le composant */}
      <VehicleExpensesBarChart vehicleId={vehicleId} />
    </div>;
};