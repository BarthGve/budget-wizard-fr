import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExpenseForm } from "./ExpenseForm";
import { toast } from "@/hooks/useToastWrapper";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface EditExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: any;
  onExpenseUpdated: () => void;
}

export function EditExpenseDialog({ 
  open, 
  onOpenChange, 
  expense, 
  onExpenseUpdated 
}: EditExpenseDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (formData: any) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from("expenses")
        .update({
          amount: formData.amount,
          date: formData.date,
          comment: formData.comment
        })
        .eq("id", expense.id);

      if (error) {
        console.error("Error updating expense:", error);
        toast.error("Erreur lors de la mise à jour de la dépense");
        return;
      }

      // Invalidation de toutes les requêtes liées aux dépenses
      queryClient.invalidateQueries({ 
        queryKey: ["expenses"],
        exact: false
      });
      
      // Invalidation des requêtes spécifiques au détaillant
      queryClient.invalidateQueries({ 
        queryKey: ["retailer-expenses", expense.retailer_id],
        exact: false
      });
      
      // Invalidation des données du tableau de bord
      queryClient.invalidateQueries({
        queryKey: ["dashboard-data"],
        exact: false
      });

      onExpenseUpdated();
    } catch (error) {
      console.error("Error in update operation:", error);
      toast.error("Une erreur s'est produite");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isSubmitting) {
        onOpenChange(isOpen);
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier la dépense</DialogTitle>
        </DialogHeader>
        {expense && (
          <ExpenseForm
            onSubmit={handleSubmit}
            defaultValues={{
              amount: expense.amount,
              date: expense.date,
              comment: expense.comment || "",
              retailerId: expense.retailer_id
            }}
            submitLabel="Mettre à jour"
            disableRetailerSelect
            buttonClassName={isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
            renderCustomActions={(isFormSubmitting) => (
              <button 
                type="submit" 
                className={`w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-500
                transition-colors duration-200 shadow-sm focus-visible:ring-blue-500 py-2 px-4 rounded
                ${isSubmitting ? "opacity-80 cursor-not-allowed" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "En cours..." : "Mettre à jour"}
              </button>
            )}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
