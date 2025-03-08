
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDashboardQueries = (userId: string | undefined) => {
  const { data: dashboardData, refetch: refetchDashboard } = useQuery({
    queryKey: ["dashboard-data", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID requis");

      try {
        // Requêtes parallèles pour optimiser le chargement
        const [
          { data: contributors, error: contributorsError },
          { data: monthlySavings, error: savingsError },
          { data: profile, error: profileError },
          { data: recurringExpenses, error: expensesError }
        ] = await Promise.all([
          supabase
            .from("contributors")
            .select("*")
            .eq("profile_id", userId)
            .order("created_at"),
          supabase
            .from("monthly_savings")
            .select("*")
            .eq("profile_id", userId)
            .order("created_at"),
          supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single(),
          supabase
            .from("recurring_expenses")
            .select("*")
            .eq("profile_id", userId)
            .order("created_at")
        ]);

        // Gestion centralisée des erreurs
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
        console.error("Error fetching dashboard data:", error);
        toast.error("Erreur lors du chargement des données: " + (error.message || "Erreur inconnue"));
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // Cache de 2 minutes pour réduire les requêtes inutiles
    gcTime: 1000 * 60 * 5, // Garde en cache pour 5 minutes après être devenu inactif
    refetchOnWindowFocus: false, // Désactive le rechargement sur focus de fenêtre
    refetchOnReconnect: true, // Active le rechargement à la reconnexion réseau
    retry: (failureCount, error) => {
      // Limiter les tentatives de reconnexion pour les erreurs critiques
      if (error instanceof Error && error.message.includes("réseau")) {
        return failureCount < 3;
      }
      return failureCount < 1;
    }
  });

  return {
    dashboardData,
    refetchDashboard
  };
};
