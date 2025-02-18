
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { CreditForm } from "./CreditForm";
import { Credit } from "./types";

interface CreditDialogProps {
  credit?: Credit;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreditDialog({ 
  credit, 
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange 
}: CreditDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setUncontrolledOpen;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {credit ? "Modifier le crédit" : "Ajouter un crédit"}
          </DialogTitle>
          <DialogDescription>
            {credit 
              ? "Modifiez les informations de votre crédit. Les modifications seront appliquées immédiatement."
              : "Ajoutez un nouveau crédit en remplissant les informations ci-dessous. Un logo sera automatiquement ajouté si disponible."}
          </DialogDescription>
        </DialogHeader>
        <CreditForm
          credit={credit}
          onSuccess={() => onOpenChange?.(false)}
          onCancel={() => onOpenChange?.(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
