
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteCategory, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      // Vérifier si la catégorie est utilisée par des dépenses récurrentes
      const { data: expenses, error: checkError } = await supabase
        .from("recurring_expenses")
        .select("id")
        .eq("category", id)
        .limit(1);

      if (checkError) throw checkError;

      // Si la catégorie est utilisée, empêcher la suppression
      if (expenses && expenses.length > 0) {
        throw new Error("Cette catégorie est utilisée par des dépenses récurrentes et ne peut pas être supprimée");
      }

      // Procéder à la suppression si la catégorie n'est pas utilisée
      const { error } = await supabase
        .from("recurring_expense_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expense-categories"] });
      toast.success("Catégorie supprimée avec succès", {
        position: "bottom-right"
      });
    },
    onError: (error: any) => {
      console.error("Error deleting category:", error);
      toast.error(error.message || "Erreur lors de la suppression de la catégorie", {
        position: "bottom-right"
      });
    },
  });

  return { deleteCategory, isDeleting };
};
