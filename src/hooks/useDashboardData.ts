
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCallback } from "react";

export const useDashboardData = () => {
  const queryClient = useQueryClient();

  // Fonction réutilisable pour la gestion des erreurs
  const handleError = useCallback((error: any, message: string) => {
    console.error(`Error ${message}:`, error);
    toast.error(`Erreur lors du chargement ${message}`);
    throw error;
  }, []);

  // Requête optimisée pour récupérer toutes les données en une seule fois
  const { data: dashboardData, error: dashboardError } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error("Non authentifié");

        // Utilisation d'une seule requête avec des jointures pour récupérer toutes les données
        const [
          { data: contributors, error: contributorsError },
          { data: monthlySavings, error: savingsError },
          { data: profile, error: profileError },
          { data: recurringExpenses, error: expensesError }
        ] = await Promise.all([
          supabase
            .from("contributors")
            .select("*")
            .eq("profile_id", user.id)
            .order("created_at", { ascending: true }),
          supabase
            .from("monthly_savings")
            .select("*")
            .eq("profile_id", user.id)
            .order("created_at", { ascending: true }),
          supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single(),
          supabase
            .from("recurring_expenses")
            .select("*")
            .eq("profile_id", user.id)
            .order("created_at", { ascending: true })
        ]);

        if (contributorsError) throw contributorsError;
        if (savingsError) throw savingsError;
        if (profileError) throw profileError;
        if (expensesError) throw expensesError;

        return {
          contributors: contributors || [],
          monthlySavings: monthlySavings || [],
          profile,
          recurringExpenses: recurringExpenses || []
        };
      } catch (error: any) {
        handleError(error, "du tableau de bord");
        return {
          contributors: [],
          monthlySavings: [],
          profile: null,
          recurringExpenses: []
        };
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  });

  if (dashboardError) {
    handleError(dashboardError, "des données du tableau de bord");
  }

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
  }, [queryClient]);

  return {
    contributors: dashboardData?.contributors || [],
    monthlySavings: dashboardData?.monthlySavings || [],
    profile: dashboardData?.profile,
    recurringExpenses: dashboardData?.recurringExpenses || [],
    refetch,
  };
};
