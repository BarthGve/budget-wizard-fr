
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { InvestmentEditForm } from "./investment-table/InvestmentEditForm";
import { InvestmentActions } from "./investment-table/InvestmentActions";
import { CurrentYearInvestmentsDialogProps, Investment } from "./types/investments";

export const CurrentYearInvestmentsDialog = ({
  open,
  onOpenChange,
  investments,
  onSuccess
}: CurrentYearInvestmentsDialogProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState<Date>();
  const [editAmount, setEditAmount] = useState("");

  const startEditing = (investment: Investment) => {
    setEditingId(investment.id);
    setEditDate(new Date(investment.investment_date));
    setEditAmount(investment.amount.toString());
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditDate(undefined);
    setEditAmount("");
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stock_investments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Investissement supprimé avec succès");
      onSuccess();
    } catch (error: any) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editDate || !editAmount) {
      toast.error("Tous les champs sont requis");
      return;
    }

    try {
      const { error } = await supabase
        .from('stock_investments')
        .update({
          investment_date: format(editDate, 'yyyy-MM-dd'),
          amount: Number(editAmount)
        })
        .eq('id', id);

      if (error) throw error;

      toast.success("Investissement mis à jour avec succès");
      cancelEditing();
      onSuccess();
    } catch (error: any) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Investissements de l'année en cours</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investments.map((investment) => (
              <TableRow key={investment.id}>
                <TableCell>
                  {editingId === investment.id ? (
                    <InvestmentEditForm
                      editDate={editDate}
                      setEditDate={setEditDate}
                      editAmount={editAmount}
                      setEditAmount={setEditAmount}
                      onSave={() => handleUpdate(investment.id)}
                      onCancel={cancelEditing}
                    />
                  ) : (
                    format(new Date(investment.investment_date), 'dd MMMM yyyy', { locale: fr })
                  )}
                </TableCell>
                <TableCell>
                  {editingId === investment.id ? (
                    <span></span>
                  ) : (
                    new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(investment.amount)
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingId === investment.id ? (
                    <span></span>
                  ) : (
                    <InvestmentActions
                      onEdit={() => startEditing(investment)}
                      onDelete={() => handleDelete(investment.id)}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};
