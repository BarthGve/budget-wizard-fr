
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "./useCurrentUser";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

/**
 * Hook optimisé principal pour le dashboard
 * Consolide toutes les requêtes en une seule et gère le temps réel
 */
export const useDashboardOptimized = () => {
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const realtimeChannelRef = useRef<any>(null);

  // Requête unique consolidée avec Promise.all
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard-optimized", currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) throw new Error("Utilisateur non authentifié");

      console.log("🚀 Chargement optimisé du dashboard consolidé");
      
      // Requêtes parallèles optimisées
      const [
        contributorsResult,
        recurringExpensesResult,
        monthlySavingsResult,
        creditsResult,
        vehiclesResult,
        savingsProjectsResult,
        profileResult
      ] = await Promise.all([
        // Contributors avec tri optimisé
        supabase
          .from("contributors")
          .select("*")
          .eq("profile_id", currentUser.id)
          .order("total_contribution", { ascending: false }),
        
        // Recurring expenses avec limitation
        supabase
          .from("recurring_expenses")
          .select("*")
          .eq("profile_id", currentUser.id)
          .order("amount", { ascending: false })
          .limit(100),
        
        // Monthly savings
        supabase
          .from("monthly_savings")
          .select("*")
          .eq("profile_id", currentUser.id)
          .order("amount", { ascending: false }),
        
        // Credits actifs prioritaires
        supabase
          .from("credits")
          .select("*")
          .eq("profile_id", currentUser.id)
          .order("date_derniere_mensualite", { ascending: true }),
        
        // Véhicules actifs
        supabase
          .from("vehicles")
          .select("*")
          .eq("profile_id", currentUser.id)
          .order("created_at", { ascending: false }),
        
        // Projets d'épargne non dépassés
        supabase
          .from("projets_epargne")
          .select("*")
          .eq("profile_id", currentUser.id)
          .neq("statut", "dépassé")
          .order("created_at", { ascending: false }),

        // Profil utilisateur
        supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single()
      ]);

      // Vérification des erreurs
      const errors = [
        contributorsResult.error,
        recurringExpensesResult.error,
        monthlySavingsResult.error,
        creditsResult.error,
        vehiclesResult.error,
        savingsProjectsResult.error,
        profileResult.error
      ].filter(Boolean);

      if (errors.length > 0) {
        console.error("Erreurs lors du chargement consolidé:", errors);
        throw new Error("Erreur lors du chargement des données");
      }

      console.log("✅ Dashboard consolidé chargé avec succès");

      return {
        contributors: contributorsResult.data || [],
        recurringExpenses: recurringExpensesResult.data || [],
        monthlySavings: monthlySavingsResult.data || [],
        credits: creditsResult.data || [],
        vehicles: vehiclesResult.data || [],
        savingsProjects: savingsProjectsResult.data || [],
        profile: profileResult.data
      };
    },
    enabled: !!currentUser?.id,
    staleTime: 1000 * 60 * 2, // 2 minutes de cache
    gcTime: 1000 * 60 * 10, // 10 minutes en mémoire
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2
  });

  // Canal temps réel unique consolidé
  useEffect(() => {
    if (!currentUser?.id) return;

    // Nettoyer le canal existant
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current);
    }

    console.log("🔄 Configuration du canal temps réel consolidé");

    // Canal unique pour toutes les tables du dashboard
    const channel = supabase
      .channel(`dashboard-consolidated-${currentUser.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contributors', filter: `profile_id=eq.${currentUser.id}` },
        () => {
          console.log("👥 Contributeur modifié - invalidation cache consolidé");
          queryClient.invalidateQueries({ queryKey: ["dashboard-optimized"] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'recurring_expenses', filter: `profile_id=eq.${currentUser.id}` },
        () => {
          console.log("💳 Charge récurrente modifiée - invalidation cache consolidé");
          queryClient.invalidateQueries({ queryKey: ["dashboard-optimized"] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'monthly_savings', filter: `profile_id=eq.${currentUser.id}` },
        () => {
          console.log("💰 Épargne modifiée - invalidation cache consolidé");
          queryClient.invalidateQueries({ queryKey: ["dashboard-optimized"] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'credits', filter: `profile_id=eq.${currentUser.id}` },
        () => {
          console.log("🏦 Crédit modifié - invalidation cache consolidé");
          queryClient.invalidateQueries({ queryKey: ["dashboard-optimized"] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projets_epargne', filter: `profile_id=eq.${currentUser.id}` },
        () => {
          console.log("🎯 Projet d'épargne modifié - invalidation cache consolidé");
          queryClient.invalidateQueries({ queryKey: ["dashboard-optimized"] });
        }
      )
      .subscribe((status) => {
        console.log(`Canal consolidé: ${status}`);
      });

    realtimeChannelRef.current = channel;

    return () => {
      console.log("🛑 Fermeture du canal consolidé");
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
    };
  }, [currentUser?.id, queryClient]);

  // Fonction de rafraîchissement optimisée
  const refreshDashboard = useCallback(async () => {
    console.log("🔄 Rafraîchissement consolidé du dashboard");
    try {
      await refetch();
      toast.success("Données actualisées");
    } catch (error) {
      console.error("Erreur lors du rafraîchissement consolidé:", error);
      toast.error("Erreur lors de l'actualisation");
    }
  }, [refetch]);

  return {
    dashboardData: data,
    isLoading,
    error,
    refreshDashboard,
    // Propriétés individuelles pour compatibilité avec l'existant
    contributors: data?.contributors || [],
    recurringExpenses: data?.recurringExpenses || [],
    monthlySavings: data?.monthlySavings || [],
    credits: data?.credits || [],
    vehicles: data?.vehicles || [],
    savingsProjects: data?.savingsProjects || [],
    profile: data?.profile
  };
};
