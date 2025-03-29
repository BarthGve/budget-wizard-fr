
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
  const isMobile = useIsMobile();

  // Si on est sur mobile, on affiche un sheet à la place d'un dialog
  if (isMobile) {
    return (
      <>
        {/* Dialogue de dépense de carburant (version mobile) */}
        {selectedVehicle && (
          <Sheet open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
            <SheetContent 
              side="bottom"
              className={cn(
                "px-0 py-0 rounded-t-xl",
                "border-t shadow-lg",
                "max-h-[90vh] overflow-y-auto",
                "dark:bg-gray-900"
              )}
            >
              <div className={cn(
                "absolute inset-x-0 top-0 h-1.5 w-12 mx-auto my-2",
                "bg-gray-300 dark:bg-gray-600 rounded-full"
              )} />
              
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
            </SheetContent>
          </Sheet>
        )}

        {/* Dialogue de dépense d'enseigne (version mobile) */}
        {selectedRetailer && (
          <Sheet open={retailerExpenseDialogOpen} onOpenChange={setRetailerExpenseDialogOpen}>
            <SheetContent 
              side="bottom"
              className={cn(
                "px-0 py-0 rounded-t-xl",
                "border-t shadow-lg",
                "max-h-[90vh] overflow-y-auto",
                "dark:bg-gray-900"
              )}
            >
              <div className={cn(
                "absolute inset-x-0 top-0 h-1.5 w-12 mx-auto my-2",
                "bg-gray-300 dark:bg-gray-600 rounded-full"
              )} />
              
              <AddExpenseDialog 
                onExpenseAdded={handleRetailerExpenseSuccess}
                preSelectedRetailer={selectedRetailer}
                open={retailerExpenseDialogOpen}
                onOpenChange={setRetailerExpenseDialogOpen}
                hideDialogWrapper={true}
                hideTitleBar={true}
              />
            </SheetContent>
          </Sheet>
        )}
      </>
    );
  }

  // Version desktop avec Dialog standard
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
