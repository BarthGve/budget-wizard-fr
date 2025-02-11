
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatCurrency } from "@/utils/format";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface PropertyExpense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  charges: "Charges",
  impots: "Impôts",
  travaux: "Travaux",
  assurance: "Assurance",
  autres: "Autres",
};

interface ExpensesListProps {
  expenses: PropertyExpense[];
  onExpenseDeleted: () => void;
  onExpenseEdit: (expense: PropertyExpense) => void;
}

export function ExpensesList({ expenses, onExpenseDeleted, onExpenseEdit }: ExpensesListProps) {
  const handleDelete = async (expenseId: string) => {
    try {
      const { error } = await supabase
        .from('property_expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;

      toast.success("Dépense supprimée avec succès");
      onExpenseDeleted();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error("Erreur lors de la suppression de la dépense");
    }
  };

  return (
    <Table>
      <TableCaption>Liste des dépenses</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Catégorie</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Montant</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell>
              {format(new Date(expense.date), "d MMMM yyyy", { locale: fr })}
            </TableCell>
            <TableCell>{CATEGORY_LABELS[expense.category] || expense.category}</TableCell>
            <TableCell>{expense.description}</TableCell>
            <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onExpenseEdit(expense)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action ne peut pas être annulée. Cette dépense sera définitivement supprimée.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(expense.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {expenses.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              Aucune dépense enregistrée
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
