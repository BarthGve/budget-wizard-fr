
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EditExpenseDialogProps {
  expense: {
    id: string;
    date: string;
    amount: number;
    comment?: string;
  };
  retailerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditExpenseDialog({
  expense,
  retailerId,
  open,
  onOpenChange,
  onSuccess,
}: EditExpenseDialogProps) {
  const form = useForm({
    defaultValues: {
      date: format(new Date(expense.date), "yyyy-MM-dd"),
      amount: expense.amount.toString(),
      comment: expense.comment || "",
    },
  });

  const onSubmit = async (values: any) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("Vous devez être connecté pour modifier une dépense");
        return;
      }

      const { error } = await supabase
        .from("expenses")
        .update({
          date: values.date,
          amount: Number(values.amount),
          comment: values.comment.trim() || null,
        })
        .eq("id", expense.id);

      if (error) throw error;

      toast.success("Dépense modifiée avec succès");
      onSuccess();
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Erreur lors de la modification de la dépense");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la dépense</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              rules={{ required: "La date est requise" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      max={format(new Date(), "yyyy-MM-dd")}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              rules={{ 
                required: "Le montant est requis",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Montant invalide"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaire (facultatif)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ajouter un commentaire..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
