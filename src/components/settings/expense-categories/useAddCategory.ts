
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAddCategory = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const { mutate: addCategory, isPending: isAdding } = useMutation({
    mutationFn: async (name: string) => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { error } = await supabase
        .from("recurring_expense_categories")
        .insert({ name, profile_id: user?.id });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expense-categories"] });
      toast.success("Catégorie ajoutée avec succès");
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      console.error("Error adding category:", error);
      toast.error(error.message || "Erreur lors de l'ajout de la catégorie");
    },
  });

  return { addCategory, isAdding };
};
