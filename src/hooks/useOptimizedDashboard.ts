
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "./useCurrentUser";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

/**
 * Hook optimisé pour le dashboard avec requêtes parallèles et mise en cache intelligente
 */
export const useOptimizedDashboard = () => {
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const realtimeChannelRef = useRef<any>(null);

  // Requête unique optimisée avec Promise.all pour charger toutes les données en parallèle
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["optimized-dashboard", currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) throw new Error("Utilisateur non authentifié");

      console.log("🚀 Chargement optimisé du dashboard");
      
      // Requêtes parallèles avec jointures optimisées
      const [
        contributorsResult,
        recurringExpensesResult,
        monthlySavingsResult,
        creditsResult,
        vehiclesResult,
        savingsProjectsResult
      ] = await Promise.all([
        // Contributors avec optimisation
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
          .limit(50),
        
        // Monthly savings
        supabase
          .from("monthly_savings")
          .select("*")
          .eq("profile_id", currentUser.id)
          .order("amount", { ascending: false }),
        
        // Credits actifs seulement
        supabase
          .from("credits")
          .select("*")
          .eq("profile_id", currentUser.id)
          .eq("statut", "actif")
          .order("date_derniere_mensualite", { ascending: true }),
        
        // Véhicules actifs
        supabase
          .from("vehicles")
          .select("*")
          .eq("profile_id", currentUser.id)
          .order("created_at", { ascending: false }),
        
        // Projets d'épargne actifs
        supabase
          .from("projets_epargne")
          .select("*")
          .eq("profile_id", currentUser.id)
          .neq("statut", "dépassé")
          .order("created_at", { ascending: false })
      ]);

      // Vérifier les erreurs
      const errors = [
        contributorsResult.error,
        recurringExpensesResult.error,
        monthlySavingsResult.error,
        creditsResult.error,
        vehiclesResult.error,
        savingsProjectsResult.error
      ].filter(Boolean);

      if (errors.length > 0) {
        console.error("Erreurs lors du chargement:", errors);
        throw new Error("Erreur lors du chargement des données");
      }

      console.log("✅ Dashboard optimisé chargé avec succès");

      return {
        contributors: contributorsResult.data || [],
        recurringExpenses: recurringExpensesResult.data || [],
        monthlySavings: monthlySavingsResult.data || [],
        credits: creditsResult.data || [],
        vehicles: vehiclesResult.data || [],
        savingsProjects: savingsProjectsResult.data || []
      };
    },
    enabled: !!currentUser?.id,
    staleTime: 1000 * 60 * 2, // 2 minutes de cache
    gcTime: 1000 * 60 * 10, // 10 minutes en mémoire
    refetchOnWindowFocus: false, // Éviter les refetch inutiles
    refetchOnMount: false,
    retry: 2
  });

  // Canal temps réel unique et optimisé
  useEffect(() => {
    if (!currentUser?.id) return;

    // Nettoyer le canal existant
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current);
    }

    // Canal unique pour toutes les tables du dashboard
    const channel = supabase
      .channel(`dashboard-${currentUser.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contributors', filter: `profile_id=eq.${currentUser.id}` },
        () => {
          console.log("📊 Contributeur modifié - invalidation cache");
          queryClient.invalidateQueries({ queryKey: ["optimized-dashboard"] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'recurring_expenses', filter: `profile_id=eq.${currentUser.id}` },
        () => {
          console.log("💳 Charge récurrente modifiée - invalidation cache");
          queryClient.invalidateQueries({ queryKey: ["optimized-dashboard"] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'monthly_savings', filter: `profile_id=eq.${currentUser.id}` },
        () => {
          console.log("💰 Épargne modifiée - invalidation cache");
          queryClient.invalidateQueries({ queryKey: ["optimized-dashboard"] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'credits', filter: `profile_id=eq.${currentUser.id}` },
        () => {
          console.log("🏦 Crédit modifié - invalidation cache");
          queryClient.invalidateQueries({ queryKey: ["optimized-dashboard"] });
        }
      )
      .subscribe();

    realtimeChannelRef.current = channel;

    return () => {
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
    };
  }, [currentUser?.id, queryClient]);

  // Fonction de rafraîchissement optimisée
  const refreshDashboard = useCallback(async () => {
    console.log("🔄 Rafraîchissement manuel du dashboard");
    try {
      await refetch();
      toast.success("Données actualisées");
    } catch (error) {
      console.error("Erreur lors du rafraîchissement:", error);
      toast.error("Erreur lors de l'actualisation");
    }
  }, [refetch]);

  return {
    dashboardData: data,
    isLoading,
    error,
    refreshDashboard,
    // Propriétés individuelles pour compatibilité
    contributors: data?.contributors || [],
    recurringExpenses: data?.recurringExpenses || [],
    monthlySavings: data?.monthlySavings || [],
    credits: data?.credits || [],
    vehicles: data?.vehicles || [],
    savingsProjects: data?.savingsProjects || []
  };
};
