
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Investment {
  id: string;
  investment_date: string;
  amount: number;
}

interface CurrentYearInvestmentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investments: Investment[];
  onSuccess: () => void;
}

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
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !editDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {editDate ? format(editDate, 'dd MMMM yyyy', { locale: fr }) : "Sélectionner une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={editDate}
                          onSelect={setEditDate}
                          initialFocus
                          locale={fr}
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    format(new Date(investment.investment_date), 'dd MMMM yyyy', { locale: fr })
                  )}
                </TableCell>
                <TableCell>
                  {editingId === investment.id ? (
                    <Input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="max-w-[150px]"
                    />
                  ) : (
                    new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(investment.amount)
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingId === investment.id ? (
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => handleUpdate(investment.id)} size="sm">
                        Sauvegarder
                      </Button>
                      <Button onClick={cancelEditing} variant="outline" size="sm">
                        Annuler
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => startEditing(investment)}
                        variant="ghost"
                        size="icon"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(investment.id)}
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
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
