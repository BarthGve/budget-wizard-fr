
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDashboardQueries = (userId: string | undefined) => {
  const { data: dashboardData, refetch: refetchDashboard } = useQuery({
    queryKey: ["dashboard-data", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID requis");

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
        console.error("Error fetching contributors:", contributorsError);
        toast.error("Erreur lors du chargement des contributeurs");
        throw contributorsError;
      }
      if (savingsError) {
        console.error("Error fetching monthly savings:", savingsError);
        toast.error("Erreur lors du chargement de l'épargne mensuelle");
        throw savingsError;
      }
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast.error("Erreur lors du chargement du profil");
        throw profileError;
      }
      if (expensesError) {
        console.error("Error fetching recurring expenses:", expensesError);
        toast.error("Erreur lors du chargement des charges récurrentes");
        throw expensesError;
      }

      return {
        contributors: contributors || [],
        monthlySavings: monthlySavings || [],
        profile,
        recurringExpenses: recurringExpenses || []
      };
    },
    enabled: !!userId,
    staleTime: 1000 * 30, // Réduire le cache à 30 secondes pour être plus réactif
    retry: 1 // Limite les tentatives de reconnexion
  });

  return {
    dashboardData,
    refetchDashboard
  };
};
