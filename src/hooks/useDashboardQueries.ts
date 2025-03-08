
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

        console.log("Dashboard data fetched successfully:", { 
          contributorsCount: contributors?.length, 
          savingsCount: monthlySavings?.length,
          expensesCount: recurringExpenses?.length
        });

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
    staleTime: 1000 * 15, // Réduire à 15 secondes pour actualiser plus souvent
    gcTime: 1000 * 60 * 5, // Garde en cache pour 5 minutes après être devenu inactif
    refetchOnWindowFocus: true, // Refetch quand la fenêtre prend le focus
    refetchOnReconnect: true, // Refetch à la reconnexion
    retry: (failureCount, error) => {
      // Limiter les tentatives de reconnexion pour les erreurs critiques
      if (error instanceof Error && error.message.includes("réseau")) {
        return failureCount < 3;
      }
      return failureCount < 2; // Augmenter les tentatives de reconnexion
    }
  });

  return {
    dashboardData,
    refetchDashboard
  };
};
