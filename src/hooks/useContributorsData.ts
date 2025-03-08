
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Contributor, NewContributor } from "@/types/contributor";
import { useEffect, useRef } from "react";
import { 
  fetchContributorsService, 
  addContributorService, 
  updateContributorService, 
  deleteContributorService 
} from "@/services/contributors";

export const useContributorsData = () => {
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);

  // Optimisation de l'écouteur Supabase avec cleanup approprié
  useEffect(() => {
    // Nettoyage du canal existant si nécessaire
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Utiliser un ID unique pour le canal
    const channelId = `contributors-${Math.random().toString(36).substring(2, 9)}`;
    
    // Configuration de l'abonnement aux changements
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contributors'
        },
        (payload) => {
          // Invalidation ciblée pour éviter les rechargements complets
          queryClient.invalidateQueries({ 
            queryKey: ["contributors"],
            exact: true,
            refetchType: 'active'
          });
        }
      )
      .subscribe();

    // Stocker la référence au canal pour le nettoyage
    channelRef.current = channel;

    // Nettoyage lors du démontage du composant
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [queryClient]); // Dépendance stable

  // Utilisation optimisée de useQuery pour les contributeurs
  const { data: contributors = [], isLoading } = useQuery({
    queryKey: ["contributors"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Vous devez être connecté pour voir vos contributeurs");
        throw new Error("Not authenticated");
      }

      return await fetchContributorsService();
    },
    staleTime: 1000 * 60 * 5, // Augmenté à 5 minutes pour réduire les refetch inutiles
    refetchOnWindowFocus: false,
    refetchOnMount: true,  // Seulement lors du premier montage
    refetchOnReconnect: false, // Désactivé pour éviter les rechargements intempestifs
  });

  // Fonction d'ajout d'un contributeur avec mise à jour optimiste
  const handleAddContributor = async (newContributor: NewContributor) => {
    const optimisticId = `temp-${Date.now()}`;
    const currentContributors = Array.isArray(contributors) ? contributors : [];
    const contributionValue = parseFloat(newContributor.total_contribution);
    
    // Mise à jour optimiste plus propre
    queryClient.setQueryData(["contributors"], [
      { 
        ...newContributor, 
        id: optimisticId, 
        total_contribution: contributionValue, 
        percentage_contribution: 0, // Ajouter un pourcentage initial à 0
        is_owner: false,
        profile_id: "temp" 
      },
      ...currentContributors
    ]);

    try {
      const updatedContributors = await addContributorService(newContributor);
      queryClient.setQueryData(["contributors"], updatedContributors);
      toast.success("Contributeur ajouté avec succès");
    } catch (error) {
      console.error("Error adding contributor:", error);
      toast.error("Erreur lors de l'ajout du contributeur");
      // Revenir à l'état précédent en cas d'erreur
      queryClient.setQueryData(["contributors"], currentContributors);
    }
  };

  // Fonction de mise à jour d'un contributeur avec approche optimiste
  const handleUpdateContributor = async (contributor: Contributor) => {
    // Sauvegarde de l'état précédent
    const previousData = queryClient.getQueryData(["contributors"]);
    const currentContributors = Array.isArray(contributors) ? contributors : [];
    
    // Mise à jour optimiste
    queryClient.setQueryData(["contributors"], 
      currentContributors.map(item => item.id === contributor.id ? contributor : item)
    );
    
    try {
      const updatedContributors = await updateContributorService(contributor);
      queryClient.setQueryData(["contributors"], updatedContributors);
      toast.success("Contributeur mis à jour avec succès");
    } catch (error) {
      console.error("Error updating contributor:", error);
      toast.error("Erreur lors de la mise à jour du contributeur");
      // Revenir à l'état précédent
      queryClient.setQueryData(["contributors"], previousData);
    }
  };

  // Fonction de suppression d'un contributeur avec gestion optimiste
  const handleDeleteContributor = async (id: string) => {
    // Sauvegarde de l'état précédent
    const previousData = queryClient.getQueryData(["contributors"]);
    const currentContributors = Array.isArray(contributors) ? contributors : [];
    
    // Mise à jour optimiste
    queryClient.setQueryData(["contributors"], 
      currentContributors.filter(item => item.id !== id)
    );
    
    try {
      const updatedContributors = await deleteContributorService(id);
      queryClient.setQueryData(["contributors"], updatedContributors);
      toast.success("Contributeur supprimé avec succès");
    } catch (error) {
      console.error("Error deleting contributor:", error);
      toast.error("Erreur lors de la suppression du contributeur");
      // Revenir à l'état précédent
      queryClient.setQueryData(["contributors"], previousData);
    }
  };

  return {
    contributors,
    isLoading,
    handleAddContributor,
    handleUpdateContributor,
    handleDeleteContributor
  };
};
