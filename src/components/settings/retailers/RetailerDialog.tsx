
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RetailerForm } from "./RetailerForm";
import { Retailer } from "./types";

export interface RetailerDialogProps {
  trigger?: React.ReactNode;
  retailer?: Retailer;
  onRetailerSaved?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function RetailerDialog({ 
  trigger, 
  retailer, 
  onRetailerSaved,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange 
}: RetailerDialogProps) {
  return (
    <Dialog 
      open={controlledOpen} 
      onOpenChange={controlledOnOpenChange}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {retailer ? "Modifier l'enseigne" : "Ajouter une enseigne"}
          </DialogTitle>
        </DialogHeader>
        <RetailerForm
          retailer={retailer}
          onSuccess={() => {
            if (onRetailerSaved) {
              onRetailerSaved();
            }
            if (controlledOnOpenChange) {
              controlledOnOpenChange(false);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
