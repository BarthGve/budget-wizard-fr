
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "./types";
import { toast } from "sonner";

export const useCategories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["recurring-expense-categories"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from("recurring_expense_categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Category[];
    },
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes to prevent unnecessary refetches
    refetchOnWindowFocus: false, // Disable refetching when window gains focus
    refetchOnReconnect: false, // Désactiver le refetch à la reconnexion
  });

  return { categories, isLoading };
};
