
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useCallback, memo } from "react";
import { Credit } from "@/components/credits/types";
import { CreditDialog } from "@/components/credits/CreditDialog";
import { CreditSummaryCards } from "@/components/credits/CreditSummaryCards";
import { CreditsList } from "@/components/credits/CreditsList";
import StyledLoader from "@/components/ui/StyledLoader";

// Optimisation avec memo pour éviter les re-renders inutiles
const Credits = memo(() => {
  console.log("Rendering Credits page");
  const queryClient = useQueryClient();
  
  // Configuration optimisée de la requête pour les crédits avec un long staleTime
  const {
    data: credits = [],
    isLoading: isLoadingCredits
  } = useQuery({
    queryKey: ["credits"],
    queryFn: async () => {
      console.log("Fetching credits data");
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour voir vos crédits");
        throw new Error("Not authenticated");
      }
      const {
        data,
        error
      } = await supabase.from("credits").select("*").eq('profile_id', user.id).order('created_at', {
        ascending: false
      });
      if (error) {
        console.error("Error fetching credits:", error);
        toast.error("Erreur lors du chargement des crédits");
        throw error;
      }
      console.log("Credits data fetched successfully", data?.length);
      return data as Credit[];
    },
    staleTime: 1000 * 60 * 15, // Augmenté: Cache valide pendant 15 minutes pour réduire les requêtes réseau
    gcTime: 1000 * 60 * 30, // Augmenté: Garde en cache pendant 30 minutes
    refetchOnWindowFocus: false, 
    refetchInterval: false,
    refetchOnMount: false, // Changé: Ne pas refetch automatiquement au montage pour éviter les rechargements
    refetchOnReconnect: false,
  });
  
  // Configuration optimisée pour les statistiques mensuelles avec un long staleTime
  const {
    data: monthlyStats = {
      credits_rembourses_count: 0,
      total_mensualites_remboursees: 0
    },
    isLoading: isLoadingStats
  } = useQuery({
    queryKey: ["credits-monthly-stats"],
    queryFn: async () => {
      console.log("Fetching monthly stats");
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const {
        data,
        error
      } = await supabase.rpc('get_credits_stats_current_month', {
        p_profile_id: user.id
      });
      if (error) {
        console.error("Error fetching monthly stats:", error);
        toast.error("Erreur lors du chargement des statistiques mensuelles");
        throw error;
      }
      console.log("Monthly stats fetched successfully");
      return data?.[0] || {
        credits_rembourses_count: 0,
        total_mensualites_remboursees: 0
      };
    },
    staleTime: 1000 * 60 * 15, // Augmenté: Cache valide pendant 15 minutes
    gcTime: 1000 * 60 * 30, // Augmenté: Garde en cache pendant 30 minutes
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnMount: false, // Changé: Ne pas refetch automatiquement au montage
    refetchOnReconnect: false,
  });

  // Calculer les valeurs dérivées avec useMemo pour éviter des recalculs inutiles
  const { activeCredits, totalActiveMensualites } = useMemo(() => {
    console.log("Calculating derived values from credits");
    if (!credits || credits.length === 0) {
      return {
        activeCredits: [],
        totalActiveMensualites: 0
      };
    }
    
    return credits.reduce((acc, credit) => ({
      activeCredits: credit.statut === 'actif' ? [...acc.activeCredits, credit] : acc.activeCredits,
      totalActiveMensualites: credit.statut === 'actif' ? acc.totalActiveMensualites + credit.montant_mensualite : acc.totalActiveMensualites
    }), {
      activeCredits: [] as Credit[],
      totalActiveMensualites: 0
    });
  }, [credits]);

  // Optimiser le rappel de la fonction avec useCallback et la stabiliser
  const handleCreditDeleted = useCallback(() => {
    console.log("Credit deleted, invalidating queries");
    queryClient.invalidateQueries({
      queryKey: ["credits"]
    });
    queryClient.invalidateQueries({
      queryKey: ["credits-monthly-stats"]
    });
  }, [queryClient]);

  const isLoading = isLoadingCredits || isLoadingStats;
  
  if (isLoading) {
    return <StyledLoader />;
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">Crédits</h1>
            <p className="text-muted-foreground">
              Gérez vos crédits et leurs échéances
            </p>
          </div>
          <CreditDialog 
            trigger={
              <Button className="text-primary-foreground bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un crédit
              </Button>
            } 
          />
        </div>

        <CreditSummaryCards 
          activeCredits={activeCredits} 
          repaidThisMonth={monthlyStats.credits_rembourses_count} 
          totalActiveMensualites={totalActiveMensualites} 
          totalRepaidMensualitesThisMonth={monthlyStats.total_mensualites_remboursees} 
        />

        <div className="space-y-6">
          <div>
            <h2 className="font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in text-2xl mb-4">Crédits en cours</h2>
            <CreditsList 
              credits={activeCredits} 
              onCreditDeleted={handleCreditDeleted} 
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}, (prevProps, nextProps) => {
  // Optimisé: Ajout d'une fonction d'égalité pour le composant principal
  // Cette fonction retournera toujours true car ce composant n'a pas de props
  // mais c'est une bonne pratique d'uniformiser l'approche
  return true;
});

// Ajouter un displayName pour faciliter le débogage
Credits.displayName = "CreditsPage";

export default Credits;
