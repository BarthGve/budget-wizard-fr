
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/format";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/properties/expenses/PaginationControls";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditExpenseDialog } from "./EditExpenseDialog";
import { useQueryClient } from "@tanstack/react-query";

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
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const itemsPerPage = 5;
  
  const totalPages = Math.ceil(expenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = expenses.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (expenseId: string) => {
    if (isDeleting) return;
    
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;

      // Invalidation des requêtes pour forcer le rafraîchissement
      queryClient.invalidateQueries({ 
        queryKey: ["expenses"],
        exact: false
      });
      
      queryClient.invalidateQueries({ 
        queryKey: ["retailer-expenses", retailer.id],
        exact: false
      });
      
      queryClient.invalidateQueries({
        queryKey: ["dashboard-data"],
        exact: false
      });

      toast.success("Dépense supprimée avec succès");
      onExpenseUpdated();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error("Erreur lors de la suppression de la dépense");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    setSelectedExpense(null);
    onExpenseUpdated();
  };

  const currentExpense = selectedExpense 
    ? expenses.find(e => e.id === selectedExpense)
    : null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">
              Dépenses - {retailer.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
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
                {paginatedExpenses.map((expense) => (
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
                        <DropdownMenuContent align="end" className="w-[200px] bg-white dark:bg-gray-800">
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedExpense(expense.id);
                              setShowEditDialog(true);
                            }}
                          >
                            <SquarePen className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(expense.id)}
                            disabled={isDeleting}
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

      {currentExpense && (
        <EditExpenseDialog 
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          expense={{
            ...currentExpense,
            retailer_id: retailer.id
          }}
          onExpenseUpdated={handleEditSuccess}
        />
      )}
    </>
  );
}
