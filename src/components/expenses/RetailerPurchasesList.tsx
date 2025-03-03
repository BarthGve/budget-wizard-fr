
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatCurrency } from "@/utils/format";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { EditExpenseDialog } from "@/components/expenses/EditExpenseDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Expense {
  id: string;
  date: string;
  amount: number;
  comment?: string;
}

interface RetailerPurchasesListProps {
  expenses: Expense[];
  onExpenseUpdated: () => void;
  retailerId: string;
}

export function RetailerPurchasesList({ expenses, onExpenseUpdated, retailerId }: RetailerPurchasesListProps) {
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!selectedExpense || isDeleting) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', selectedExpense);

      if (error) throw error;

      toast.success("Dépense supprimée avec succès");
      onExpenseUpdated();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error("Erreur lors de la suppression de la dépense");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedExpense(null);
    }
  };

  const currentExpense = selectedExpense 
    ? expenses.find(e => e.id === selectedExpense)
    : null;

  if (expenses.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Aucun achat pour cette année
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Commentaire</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  {format(new Date(expense.date), "d MMMM yyyy", { locale: fr })}
                </TableCell>
                <TableCell>{formatCurrency(expense.amount)}</TableCell>
                <TableCell>{expense.comment || "-"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedExpense(expense.id);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setSelectedExpense(expense.id);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette dépense</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette dépense ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {currentExpense && (
        <EditExpenseDialog
          expense={currentExpense}
          retailerId={retailerId}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={onExpenseUpdated}
        />
      )}
    </>
  );
}
