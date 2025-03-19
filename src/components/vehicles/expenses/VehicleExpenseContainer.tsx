
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useVehicleExpenses } from "@/hooks/useVehicleExpenses";
import { VehicleExpenseList } from "./VehicleExpenseList";
import { AddVehicleExpenseDialog } from "./AddVehicleExpenseDialog";

interface VehicleExpenseContainerProps {
  vehicleId: string;
}

export const VehicleExpenseContainer = ({ vehicleId }: VehicleExpenseContainerProps) => {
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
  const { expenses, isLoading } = useVehicleExpenses(vehicleId);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Dépenses du véhicule</CardTitle>
        <Button onClick={() => setShowAddExpenseDialog(true)} size="sm">
          <PlusIcon className="h-4 w-4 mr-2" />
          Ajouter une dépense
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : expenses && expenses.length > 0 ? (
          <VehicleExpenseList expenses={expenses} />
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Aucune dépense enregistrée pour ce véhicule.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setShowAddExpenseDialog(true)}
            >
              Ajouter votre première dépense
            </Button>
          </div>
        )}
      </CardContent>

      {showAddExpenseDialog && (
        <AddVehicleExpenseDialog 
          vehicleId={vehicleId}
          open={showAddExpenseDialog}
          onOpenChange={setShowAddExpenseDialog}
        />
      )}
    </Card>
  );
};
