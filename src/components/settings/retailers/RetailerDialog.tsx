
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RetailerForm } from "./RetailerForm";
import { Retailer } from "./types";

interface RetailerDialogProps {
  trigger: React.ReactNode;
  retailer?: Retailer;
  onRetailerSaved: () => void;
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
  const isControlled = controlledOpen !== undefined;

  return (
    <Dialog 
      open={controlledOpen} 
      onOpenChange={controlledOnOpenChange}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {retailer ? "Modifier l'enseigne" : "Ajouter une enseigne"}
          </DialogTitle>
        </DialogHeader>
        <RetailerForm
          retailer={retailer}
          onSuccess={() => {
            onRetailerSaved();
            if (controlledOnOpenChange) {
              controlledOnOpenChange(false);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
