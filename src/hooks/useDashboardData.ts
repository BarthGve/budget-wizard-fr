
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDashboardData = () => {
  // Utilisation d'une clé partagée pour le user
  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!user) throw new Error("Non authentifié");
      return user;
    },
    staleTime: 1000 * 60 * 5, // Cache de 5 minutes pour l'utilisateur
  });

  // Optimisation des requêtes avec staleTime et regroupement des données
  const { data: dashboardData, refetch: refetchDashboard } = useQuery({
    queryKey: ["dashboard-data", currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) throw new Error("User ID requis");

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
          .eq("profile_id", currentUser.id)
          .order("created_at"),
        supabase
          .from("monthly_savings")
          .select("*")
          .eq("profile_id", currentUser.id)
          .order("created_at"),
        supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single(),
        supabase
          .from("recurring_expenses")
          .select("*")
          .eq("profile_id", currentUser.id)
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
    enabled: !!currentUser?.id,
    staleTime: 1000 * 60 * 2, // Cache de 2 minutes pour les données du dashboard
    retry: 1 // Limite les tentatives de reconnexion
  });

  const refetch = () => {
    refetchDashboard();
  };

  return {
    contributors: dashboardData?.contributors || [],
    monthlySavings: dashboardData?.monthlySavings || [],
    profile: dashboardData?.profile,
    recurringExpenses: dashboardData?.recurringExpenses || [],
    refetch,
  };
};
