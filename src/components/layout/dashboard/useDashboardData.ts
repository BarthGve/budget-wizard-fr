
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useDashboardData } from "@/hooks/useDashboardData";
import { calculateGlobalBalance } from "@/utils/dashboardCalculations";
import { Credit } from "@/components/credits/types";

// Hook pour la récupération et le calcul des données du dashboard
export const useDashboardPageData = () => {
  const { contributors, recurringExpenses, monthlySavings, refetch } = useDashboardData();

  // Récupérer les crédits
  const { data: credits } = useQuery({
    queryKey: ["credits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("credits")
        .select("*");

      if (error) {
        console.error("Error fetching credits:", error);
        return [];
      }

      return data as Credit[];
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });

  // Récupérer le profil utilisateur
  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

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
    refetchOnReconnect: true
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

  return {
    userProfile,
    globalBalance,
    refetch
  };
};
