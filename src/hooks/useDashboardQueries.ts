
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDashboardQueries = (userId: string | undefined) => {
  const { data: dashboardData, refetch: refetchDashboard, isLoading, error } = useQuery({
    queryKey: ["dashboard-data", userId],
    queryFn: async () => {
      if (!userId) {
        console.log("Pas d'ID utilisateur fourni pour useDashboardQueries");
        throw new Error("User ID requis");
      }

      console.log("Récupération des données du dashboard pour l'utilisateur:", userId);
      
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
        if (contributorsError) {
          console.error("Erreur contributors:", contributorsError);
          throw contributorsError;
        }
        if (savingsError) {
          console.error("Erreur savings:", savingsError);
          throw savingsError;
        }
        if (profileError) {
          console.error("Erreur profile:", profileError);
          throw profileError;
        }
        if (expensesError) {
          console.error("Erreur expenses:", expensesError);
          throw expensesError;
        }

        console.log("Données du dashboard récupérées avec succès:", { 
          contributorsCount: contributors?.length, 
          savingsCount: monthlySavings?.length,
          expensesCount: recurringExpenses?.length,
          profile: profile ? "ok" : "non trouvé"
        });

        return {
          contributors: contributors || [],
          monthlySavings: monthlySavings || [],
          profile,
          recurringExpenses: recurringExpenses || []
        };
      } catch (error: any) {
        console.error("Erreur lors de la récupération des données du dashboard:", error);
        toast.error("Erreur lors du chargement des données: " + (error.message || "Erreur inconnue"));
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 15, // 15 secondes pour actualiser plus souvent
    gcTime: 1000 * 60 * 5, // 5 minutes de cache
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      console.log(`Tentative de reconnexion ${failureCount} après erreur:`, error);
      
      // Limiter les tentatives pour les erreurs critiques
      if (error instanceof Error && error.message.includes("réseau")) {
        return failureCount < 3;
      }
      return failureCount < 2;
    }
  });

  return {
    dashboardData,
    refetchDashboard,
    isLoading,
    error
  };
};
