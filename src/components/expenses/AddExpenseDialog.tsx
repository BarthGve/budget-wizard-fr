
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExpenseForm } from "./ExpenseForm";
import { AddExpenseDialogProps } from "./types";

export function AddExpenseDialog({ 
  onExpenseAdded, 
  preSelectedRetailer, 
  open, 
  onOpenChange,
  hideDialogWrapper = false 
}: AddExpenseDialogProps & { hideDialogWrapper?: boolean }) {
  // Si hideDialogWrapper est vrai, on n'affiche pas le Dialog wrapper
  if (hideDialogWrapper) {
    return (
      <ExpenseForm 
        onExpenseAdded={onExpenseAdded} 
        preSelectedRetailer={preSelectedRetailer} 
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter une dépense</DialogTitle>
        </DialogHeader>
        <ExpenseForm 
          onExpenseAdded={onExpenseAdded} 
          preSelectedRetailer={preSelectedRetailer} 
        />
      </DialogContent>
    </Dialog>
  );
}
