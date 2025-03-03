import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format";
import { ExpenseActionsDropdown } from "@/components/recurring-expenses/dialogs/ExpenseActionsDropdown";
import { TablePagination } from "@/components/recurring-expenses/table/TablePagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Expense {
  id: string;
  date: string;
  amount: number;
  comment?: string;
  retailer_id: string;
}

interface RetailerExpensesTableProps {
  expenses: Expense[];
  isLoading: boolean;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
  onViewDetails?: (expense: Expense) => void;
}

export function RetailerExpensesTable({
  expenses,
  isLoading,
  onEditExpense,
  onDeleteExpense,
  onViewDetails
}: RetailerExpensesTableProps) {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <p className="text-center py-8 text-muted-foreground">
        Aucune dépense enregistrée pour cette année
      </p>
    );
  }

  // Calculate pagination
  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(expenses.length / itemsPerPage);
  const paginatedExpenses = itemsPerPage === -1
    ? expenses
    : expenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {expenses.length} dépense{expenses.length !== 1 ? 's' : ''} au total
        </div>
        <Select value={String(itemsPerPage)} onValueChange={(value) => {
          setItemsPerPage(Number(value));
          setCurrentPage(1);
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lignes par page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 par page</SelectItem>
            <SelectItem value="25">25 par page</SelectItem>
            <SelectItem value="-1">Tout afficher</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Commentaire</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  {new Date(expense.date).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(expense.amount)}
                </TableCell>
                <TableCell>
                  {expense.comment || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <ExpenseActionsDropdown
                    onViewDetails={() => onViewDetails && onViewDetails(expense)}
                    onEdit={() => onEditExpense(expense)}
                    onDelete={() => onDeleteExpense(expense.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
