
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RetailerForm } from "./RetailerForm";
import { ReactNode } from "react";

interface RetailerDialogProps {
  trigger: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRetailerSaved: () => void;
}

export const RetailerDialog = ({ trigger, open, onOpenChange, onRetailerSaved }: RetailerDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une enseigne</DialogTitle>
        </DialogHeader>
        <RetailerForm onSuccess={onRetailerSaved} />
      </DialogContent>
    </Dialog>
  );
};
