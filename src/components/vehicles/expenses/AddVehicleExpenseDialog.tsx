
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExpenseForm } from "./form/ExpenseForm";
import { ExpenseInitialValues } from "@/hooks/useExpenseForm";

interface AddVehicleExpenseDialogProps {
  vehicleId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isEditMode?: boolean;
  expenseId?: string;
  initialValues?: ExpenseInitialValues;
  onSuccess?: () => void;
  hideDialogWrapper?: boolean;
}

export const AddVehicleExpenseDialog = ({ 
  vehicleId, 
  open, 
  onOpenChange,
  isEditMode = false,
  expenseId,
  initialValues,
  onSuccess,
  hideDialogWrapper = false
}: AddVehicleExpenseDialogProps) => {
  
  // Contenu du formulaire
  const formContent = (
    <ExpenseForm
      vehicleId={vehicleId}
      isEditMode={isEditMode}
      expenseId={expenseId}
      initialValues={initialValues}
      onSuccess={onSuccess}
      onCancel={() => onOpenChange && onOpenChange(false)}
    />
  );

  // Si hideDialogWrapper est true, on retourne uniquement le contenu du formulaire
  if (hideDialogWrapper) {
    return formContent;
  }

  // Sinon, on enveloppe le formulaire dans un dialogue
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Modifier' : 'Ajouter'} une dépense</DialogTitle>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};
