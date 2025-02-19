
import { Button } from "@/components/ui/button";
import { MoreVertical, SquarePen, Trash2, Info } from "lucide-react";
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
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDelete = async () => {
    await onDeleteExpense(expense.id);
    setShowDeleteDialog(false);
    setDropdownOpen(false);
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem onClick={() => {
            setShowDetailsDialog(true);
            setDropdownOpen(false);
          }}>
            <Info className="mr-2 h-4 w-4"/>
            Détails
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            setShowEditDialog(true);
            setDropdownOpen(false);
          }}>
             <SquarePen className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
       
          <DropdownMenuItem 
            className="text-destructive"
            onClick={() => {
              setShowDeleteDialog(true);
              setDropdownOpen(false);
            }}
          >
             <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RecurringExpenseDetails 
        expense={expense}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />

      <RecurringExpenseDialog 
        expense={expense}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
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
              onClick={handleDelete}
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
