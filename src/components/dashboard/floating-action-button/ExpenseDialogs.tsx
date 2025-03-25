
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AddVehicleExpenseDialog } from "@/components/vehicles/expenses/AddVehicleExpenseDialog";
import { AddExpenseDialog } from "@/components/expenses/AddExpenseDialog";
import { type Retailer } from "./useFloatingActionButton";

interface ExpenseDialogsProps {
  selectedVehicle: string | null;
  selectedRetailer: Retailer | null;
  expenseDialogOpen: boolean;
  retailerExpenseDialogOpen: boolean;
  setExpenseDialogOpen: (open: boolean) => void;
  setRetailerExpenseDialogOpen: (open: boolean) => void;
  handleExpenseSuccess: () => void;
  handleExpenseCancel: () => void;
  handleRetailerExpenseSuccess: () => void;
}

/**
 * Dialogues modaux pour l'ajout de dépenses
 */
export const ExpenseDialogs = ({
  selectedVehicle,
  selectedRetailer,
  expenseDialogOpen,
  retailerExpenseDialogOpen,
  setExpenseDialogOpen,
  setRetailerExpenseDialogOpen,
  handleExpenseSuccess,
  handleExpenseCancel,
  handleRetailerExpenseSuccess
}: ExpenseDialogsProps) => {
  return (
    <>
      {selectedVehicle && (
        <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
          <DialogContent className="sm:max-w-[500px] p-0 border-0 overflow-hidden bg-transparent shadow-2xl">
            <AddVehicleExpenseDialog
              vehicleId={selectedVehicle}
              hideDialogWrapper={true}
              onSuccess={handleExpenseSuccess}
              onCancel={handleExpenseCancel}
              initialValues={{
                vehicleId: selectedVehicle,
                expenseType: "carburant",
                date: new Date().toISOString().split('T')[0],
                amount: "",
                mileage: "",
                fuelVolume: "",
                maintenanceType: "",
                repairType: "",
                comment: ""
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {selectedRetailer && (
        <Dialog open={retailerExpenseDialogOpen} onOpenChange={setRetailerExpenseDialogOpen}>
          <DialogContent className="sm:max-w-[500px] p-0 border-0 overflow-hidden bg-transparent shadow-2xl">
            <AddExpenseDialog 
              onExpenseAdded={handleRetailerExpenseSuccess}
              preSelectedRetailer={selectedRetailer}
              open={retailerExpenseDialogOpen}
              onOpenChange={setRetailerExpenseDialogOpen}
              hideDialogWrapper={true}
              hideTitleBar={true}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
