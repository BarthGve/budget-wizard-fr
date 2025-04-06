
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useDashboardData } from "@/hooks/useDashboardData";
import { calculateGlobalBalance } from "@/utils/dashboardCalculations";
import { Credit } from "@/components/credits/types";
import { useAuthContext } from "@/hooks/useAuthContext";

// Hook pour la récupération et le calcul des données du dashboard
export const useDashboardPageData = () => {
  const { user } = useAuthContext();
  const { contributors, recurringExpenses, monthlySavings, refetch, isLoading: isDashboardLoading } = useDashboardData();

  // Récupérer les crédits
  const { data: credits, isLoading: isCreditsLoading } = useQuery({
    queryKey: ["credits", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log("Récupération des crédits pour l'utilisateur:", user.id);
      const { data, error } = await supabase
        .from("credits")
        .select("*")
        .eq("profile_id", user.id);

      if (error) {
        console.error("Erreur lors de la récupération des crédits:", error);
        return [];
      }

      return data as Credit[];
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: !!user?.id
  });

  // Récupérer le profil utilisateur
  const { data: userProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      console.log("Récupération du profil pour l'utilisateur:", user.id);
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const { data: isAdmin } = await supabase.rpc('has_role', {
        user_id: user.id,
        role: 'admin'
      });

      return { 
        ...profile, 
        isAdmin
      };
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: !!user?.id
  });

  // Calculer les totaux
  const totalRevenue = useMemo(() => 
    contributors?.reduce((sum, contributor) => sum + contributor.total_contribution, 0) || 0,
    [contributors]
  );

  // Calculer le solde global
  const globalBalance = useMemo(() => 
    calculateGlobalBalance(totalRevenue, recurringExpenses, monthlySavings, credits),
    [totalRevenue, recurringExpenses, monthlySavings, credits]
  );

  // Déterminer si les données sont en cours de chargement
  const isLoading = isDashboardLoading || isCreditsLoading || isProfileLoading;

  return {
    userProfile,
    globalBalance,
    isLoading,
    refetch
  };
};
