
import { useState, memo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { CreditForm } from "./CreditForm";
import { Credit } from "./types";

interface CreditDialogProps {
  credit?: Credit;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CreditDialog = memo(({ 
  credit, 
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange 
}: CreditDialogProps) => {
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
}, (prevProps, nextProps) => {
  // Optimisation: Vérifiez uniquement les propriétés qui affectent le rendu
  if (prevProps.open !== nextProps.open) return false;
  if ((!prevProps.credit && nextProps.credit) || (prevProps.credit && !nextProps.credit)) return false;
  if (prevProps.credit && nextProps.credit && prevProps.credit.id !== nextProps.credit.id) return false;
  
  // Les children du trigger sont difficiles à comparer, donc si le trigger change, on re-render pour être sûr
  if (prevProps.trigger !== nextProps.trigger) return false;
  
  return true;
});

CreditDialog.displayName = "CreditDialog";
