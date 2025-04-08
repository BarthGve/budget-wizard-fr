
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useDashboardData } from "@/hooks/useDashboardData";
import { calculateGlobalBalance } from "@/utils/dashboardCalculations";
import { Credit } from "@/components/credits/types";
import { mergeDashboardPreferences } from "@/utils/dashboard-preferences";
import { Profile } from "@/types/profile";
import { useAuthContext } from "@/context/AuthProvider";

// Hook pour la récupération et le calcul des données du dashboard
export const useDashboardPageData = () => {
  const { contributors, recurringExpenses, monthlySavings, refetch } = useDashboardData();
  const { user, isAuthenticated } = useAuthContext();

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
    refetchOnReconnect: true,
    enabled: isAuthenticated
  });

  // Récupérer le profil utilisateur
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!user || !isAuthenticated) {
        console.log("useDashboardPageData: Pas d'utilisateur authentifié");
        return null;
      }

      console.log("useDashboardPageData: Récupération du profil pour", user.id);
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const { data: isAdmin } = await supabase.rpc('has_role', {
        user_id: user.id,
        role: 'admin'
      });

      // S'assurer que dashboard_preferences est formaté correctement
      if (profile) {
        // Traiter les préférences du tableau de bord
        if (profile.dashboard_preferences) {
          try {
            // Si les préférences sont stockées en tant que chaîne, les parser
            if (typeof profile.dashboard_preferences === 'string') {
              profile.dashboard_preferences = JSON.parse(profile.dashboard_preferences);
            }
          } catch (e) {
            console.error("Erreur lors du parsing des préférences du tableau de bord:", e);
            profile.dashboard_preferences = null;
          }
        }
        
        // Ajouter l'email s'il est manquant
        if (!profile.email && user.email) {
          profile.email = user.email;
        }
      }

      // Retourner le profil avec le statut admin
      return { 
        ...profile, 
        isAdmin
      } as Profile & { isAdmin: boolean };
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: isAuthenticated && !!user
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
    refetch,
    isLoading: profileLoading
  };
};
