
import { useState } from "react";
import { RecurringExpense } from "../types";
import { DeleteExpenseConfirmDialog } from "../dialogs/DeleteExpenseConfirmDialog";
import { RecurringExpenseDialog } from "../RecurringExpenseDialog";
import { Dialog } from "@/components/ui/dialog";
import { RecurringExpenseDetails } from "../RecurringExpenseDetails";

export interface TableDialogProps {
  expenseToDelete: RecurringExpense | null;
  selectedExpense: RecurringExpense | null;
  showEditDialog: boolean;
  showDetailsDialog: boolean;
  allExpenses?: RecurringExpense[]; // Ajout de la liste complète des charges
  setExpenseToDelete: (expense: RecurringExpense | null) => void;
  setShowEditDialog: (show: boolean) => void;
  setShowDetailsDialog: (show: boolean) => void;
  onDeleteExpense: (id: string) => Promise<void>;
}

export const TableDialogs = ({
  expenseToDelete,
  selectedExpense,
  showEditDialog,
  showDetailsDialog,
  allExpenses = [],
  setExpenseToDelete,
  setShowEditDialog,
  setShowDetailsDialog,
  onDeleteExpense
}: TableDialogProps) => {
  // Fonction pour obtenir les détails complets d'une charge
  // en utilisant la liste complète des charges si disponible
  const getCompleteExpenseDetails = (expense: RecurringExpense | null) => {
    if (!expense) return null;
    
    // Si nous avons la liste complète, essayons de trouver une version plus complète de la charge
    if (allExpenses && allExpenses.length > 0) {
      const completeExpense = allExpenses.find(e => e.id === expense.id);
      if (completeExpense) {
        return completeExpense;
      }
    }
    
    // Sinon retourner la charge telle quelle
    return expense;
  };

  const handleConfirmDelete = () => {
    if (expenseToDelete) {
      onDeleteExpense(expenseToDelete.id);
      setExpenseToDelete(null);
    }
  };

  // Obtenir les détails complets pour la charge sélectionnée
  const expenseWithFullDetails = getCompleteExpenseDetails(selectedExpense);

  return (
    <>
      <DeleteExpenseConfirmDialog
        open={!!expenseToDelete}
        onOpenChange={(open) => {
          if (!open) setExpenseToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        expenseName={expenseToDelete?.name}
      />

      {/* Dialog pour éditer une charge récurrente */}
      <RecurringExpenseDialog
        expense={expenseWithFullDetails || undefined}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      {/* Dialog pour afficher les détails */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        {expenseWithFullDetails && <RecurringExpenseDetails expense={expenseWithFullDetails} />}
      </Dialog>
    </>
  );
};
