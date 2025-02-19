
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
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PaginationControls } from "./expenses/PaginationControls";
import { SortableTableHeader } from "./expenses/SortableTableHeader";
import { TableActions } from "./expenses/TableActions";

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
      setSortField(field as keyof PropertyExpense);
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

  return (
    <div className="space-y-4">
      <Table>
        <TableCaption>Liste des dépenses</TableCaption>
        <TableHeader>
          <TableRow>
            <SortableTableHeader
              field="date"
              label="Date"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHeader
              field="category"
              label="Catégorie"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHeader
              field="description"
              label="Description"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHeader
              field="amount"
              label="Montant"
              currentSortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              className="text-right"
            />
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
                <TableActions
                  onEdit={() => onExpenseEdit(expense)}
                  onDelete={() => handleDelete(expense.id)}
                />
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
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
