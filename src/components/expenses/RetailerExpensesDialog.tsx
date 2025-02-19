
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/format";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableActions } from "@/components/properties/expenses/TableActions";
import { PaginationControls } from "@/components/properties/expenses/PaginationControls";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RetailerExpensesDialogProps {
  retailer: {
    id: string;
    name: string;
  };
  expenses: Array<{
    id: string;
    date: string;
    amount: number;
    comment?: string;
  }>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseUpdated: () => void;
}

export function RetailerExpensesDialog({ 
  retailer, 
  expenses, 
  open, 
  onOpenChange,
  onExpenseUpdated 
}: RetailerExpensesDialogProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const totalPages = Math.ceil(expenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = expenses.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (expenseId: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;

      toast.success("Dépense supprimée avec succès");
      onExpenseUpdated();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error("Erreur lors de la suppression de la dépense");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Dépenses - {retailer.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Commentaire</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    {format(new Date(expense.date), "d MMMM yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell>{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>{expense.comment || "-"}</TableCell>
                  <TableCell>
                    <TableActions
                      onEdit={() => {
                        // TODO: Implement edit functionality
                        console.log("Edit expense:", expense.id);
                      }}
                      onDelete={() => handleDelete(expense.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
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
      </DialogContent>
    </Dialog>
  );
}
