
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Category } from "./types";

export const useUpdateCategory = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const { mutate: updateCategory, isPending: isUpdating } = useMutation({
    mutationFn: async (category: Category) => {
      const { error } = await supabase
        .from("recurring_expense_categories")
        .update({ name: category.name })
        .eq("id", category.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expense-categories"] });
      toast({
        title: "Succès",
        description: "Catégorie mise à jour avec succès"
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      console.error("Error updating category:", error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la mise à jour de la catégorie",
        variant: "destructive"
      });
    },
  });

  return { updateCategory, isUpdating };
};
