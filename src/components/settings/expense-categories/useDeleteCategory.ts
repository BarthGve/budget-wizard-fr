
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteCategory, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("recurring_expense_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expense-categories"] });
      toast.success("Catégorie supprimée avec succès");
    },
    onError: (error: any) => {
      console.error("Error deleting category:", error);
      toast.error(error.message || "Erreur lors de la suppression de la catégorie");
    },
  });

  return { deleteCategory, isDeleting };
};
