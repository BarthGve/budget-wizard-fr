
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RecurringExpenseDialog } from "./RecurringExpenseDialog";
import { RecurringExpenseDetails } from "./RecurringExpenseDetails";
import { RecurringExpense } from "./types";
import { useState } from "react";

interface TableRowActionsProps {
  expense: RecurringExpense;
  onDeleteExpense: (id: string) => Promise<void>;
}

export const TableRowActions = ({ expense, onDeleteExpense }: TableRowActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const handleSelect = (callback: () => void) => (event: Event) => {
    event.preventDefault();
    callback();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem onSelect={handleSelect(() => setShowDetailsDialog(true))}>
            Détails
          </DropdownMenuItem>
          <RecurringExpenseDialog
            expense={expense}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Modifier
              </DropdownMenuItem>
            }
          />
          <DropdownMenuItem>
            Dupliquer
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-destructive"
            onSelect={handleSelect(() => setShowDeleteDialog(true))}
          >
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RecurringExpenseDetails 
        expense={expense}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la charge</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette charge ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDeleteExpense(expense.id);
                setShowDeleteDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
