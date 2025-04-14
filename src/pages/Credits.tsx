
import { memo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Credit } from "@/components/credits/types";
import { CreditsContainer } from "@/components/credits/components/CreditsContainer";
import { useCreditsRealtimeListener } from "@/hooks/useCreditsRealtimeListener";
import { useAuthContext } from "@/context/AuthProvider";
import { CreditsSkeleton } from "@/components/credits/skeletons/CreditsSkeleton";

const Credits = memo(function Credits() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthContext();
  
  // Utiliser notre écouteur temps réel pour les crédits
  useCreditsRealtimeListener();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate, isAuthenticated]);
  
  // Préchargement des données au montage du composant
  useEffect(() => {
    if (isAuthenticated && user) {
      // Précharger les données immédiatement
      queryClient.prefetchQuery({
        queryKey: ["credits"],
        queryFn: async () => {
          const { data, error } = await supabase
            .from("credits")
            .select("*")
            .eq('profile_id', user.id)
            .order('created_at', { ascending: false });
          
          if (error) {
            console.error("Erreur lors du préchargement des crédits:", error);
            return [];
          }
          
          return data as Credit[];
        }
      });
    }
  }, [queryClient, isAuthenticated, user]);
  
  const {
    data: credits = [],
    isLoading: isLoadingCredits
  } = useQuery({
    queryKey: ["credits"],
    queryFn: async () => {
      if (!user) {
        toast.error("Vous devez être connecté pour voir vos crédits");
        throw new Error("Not authenticated");
      }
      
      console.log("Credits.tsx: Récupération des crédits pour", user.id);
      const { data, error } = await supabase
        .from("credits")
        .select("*")
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching credits:", error);
        toast.error("Erreur lors du chargement des crédits");
        throw error;
      }
      
      return data as Credit[];
    },
    staleTime: 1000 * 15, // Harmonisé avec CreditsFetcher à 15 secondes
    refetchOnWindowFocus: true, // Activer le rechargement lors du focus
    refetchOnMount: true, // Exécuter à chaque montage
    refetchOnReconnect: true
  });
  
  const {
    data: monthlyStats = {
      credits_rembourses_count: 0,
      total_mensualites_remboursees: 0
    },
    isLoading: isLoadingStats
  } = useQuery({
    queryKey: ["credits-monthly-stats"],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      
      console.log("Credits.tsx: Récupération des statistiques mensuelles");
      const { data, error } = await supabase
        .rpc('get_credits_stats_current_month', {
          p_profile_id: user.id
        });
      
      if (error) {
        console.error("Error fetching monthly stats:", error);
        toast.error("Erreur lors du chargement des statistiques mensuelles");
        throw error;
      }
      
      return data?.[0] || {
        credits_rembourses_count: 0,
        total_mensualites_remboursees: 0
      };
    },
    staleTime: 1000 * 15, // Harmonisé avec les autres requêtes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled: !!user // N'exécuter que si l'utilisateur est authentifié
  });

  const handleCreditDeleted = useCallback(() => {
    // Utilisation de invalidateQueries avec options précises
    queryClient.invalidateQueries({
      queryKey: ["credits"],
      exact: true
    });
    queryClient.invalidateQueries({
      queryKey: ["credits-monthly-stats"],
      exact: true
    });
    
    toast.success("Le crédit a été supprimé avec succès");
  }, [queryClient]);

  const isLoading = isLoadingCredits || isLoadingStats;
  
  if (isLoading) {
    return <CreditsSkeleton />;
  }
  
  return (
    <CreditsContainer 
      credits={credits}
      monthlyStats={monthlyStats}
      onCreditDeleted={handleCreditDeleted}
    />
  );
});

export default Credits;
