
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
import { Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState, useMemo } from "react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof PropertyExpense>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const itemsPerPage = 5;

  const handleSort = (field: keyof PropertyExpense) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => {
      if (sortField === "amount") {
        return sortDirection === "asc" 
          ? a[sortField] - b[sortField]
          : b[sortField] - a[sortField];
      }
      return sortDirection === "asc"
        ? String(a[sortField]).localeCompare(String(b[sortField]))
        : String(b[sortField]).localeCompare(String(a[sortField]));
    });
  }, [expenses, sortField, sortDirection]);

  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedExpenses.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedExpenses, currentPage]);

  const totalPages = Math.ceil(expenses.length / itemsPerPage);

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

  const SortIcon = ({ field }: { field: keyof PropertyExpense }) => {
    if (field !== sortField) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    );
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableCaption>Liste des dépenses</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:text-primary transition-colors"
              onClick={() => handleSort("date")}
            >
              Date <SortIcon field="date" />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-primary transition-colors"
              onClick={() => handleSort("category")}
            >
              Catégorie <SortIcon field="category" />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-primary transition-colors"
              onClick={() => handleSort("description")}
            >
              Description <SortIcon field="description" />
            </TableHead>
            <TableHead 
              className="text-right cursor-pointer hover:text-primary transition-colors"
              onClick={() => handleSort("amount")}
            >
              Montant <SortIcon field="amount" />
            </TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedExpenses.map((expense) => (
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

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          <span className="flex items-center px-4">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}
