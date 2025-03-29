
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AddVehicleExpenseDialog } from "@/components/vehicles/expenses/AddVehicleExpenseDialog";
import { AddExpenseDialog } from "@/components/expenses/AddExpenseDialog";
import { type Retailer } from "./useFloatingActionButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
 * Sur mobile, ils s'affichent comme des sheets du bas vers le haut
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
      {/* Dialogue de dépense de carburant */}
      {selectedVehicle && (
        <AddVehicleExpenseDialog
          vehicleId={selectedVehicle}
          open={expenseDialogOpen}
          onOpenChange={setExpenseDialogOpen}
          onSuccess={handleExpenseSuccess}
          onCancel={handleExpenseCancel}
          colorScheme="gray"
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
      )}

      {/* Dialogue de dépense d'enseigne */}
      {selectedRetailer && (
        <AddExpenseDialog 
          onExpenseAdded={handleRetailerExpenseSuccess}
          preSelectedRetailer={selectedRetailer}
          open={retailerExpenseDialogOpen}
          onOpenChange={setRetailerExpenseDialogOpen}
        />
      )}
    </>
  );
};
