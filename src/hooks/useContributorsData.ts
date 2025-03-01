
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Contributor, NewContributor } from "@/types/contributor";
import { useEffect } from "react";

export const useContributorsData = () => {
  const queryClient = useQueryClient();

  // Configuration d'un écouteur Supabase unique avec cleanup approprié
  useEffect(() => {
    const channelId = `contributors-realtime-${Date.now()}`;
    console.log(`Setting up realtime subscription with channel ID: ${channelId}`);
    
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'contributors'
        },
        () => {
          // Invalider uniquement la requête des contributeurs sans recharger toute la page
          queryClient.invalidateQueries({ queryKey: ["contributors"] });
        }
      )
      .subscribe((status) => {
        console.log(`Supabase realtime status for contributors: ${status}`);
      });

    return () => {
      console.log(`Cleaning up channel: ${channelId}`);
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Utilisation de useQuery pour récupérer les contributeurs
  const { data: contributors = [], isLoading } = useQuery({
    queryKey: ["contributors"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Vous devez être connecté pour voir vos contributeurs");
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from("contributors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching contributors:", error);
        toast.error("Erreur lors du chargement des contributeurs");
        throw error;
      }

      return data as Contributor[];
    }
  });

  // Fonction d'ajout d'un contributeur avec mise à jour optimiste
  const handleAddContributor = async (newContributor: NewContributor) => {
    const optimisticId = `temp-${Date.now()}`;
    // Ensure contributors is treated as an array
    const currentContributors = Array.isArray(contributors) ? contributors : [];
    
    // Parse the string to number for total_contribution
    const contributionValue = parseFloat(newContributor.total_contribution);
    
    queryClient.setQueryData(["contributors"], [
      { ...newContributor, id: optimisticId, total_contribution: contributionValue },
      ...currentContributors
    ]);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("contributors")
        .insert([{ 
          ...newContributor,
          total_contribution: contributionValue, // Ensure we use the numeric value
          profile_id: user.id 
        }])
        .select()
        .single();

      if (error) throw error;

      // Mise à jour avec les vraies données du serveur
      const updatedContributors = Array.isArray(contributors) ? contributors : [];
      
      queryClient.setQueryData(["contributors"], 
        updatedContributors.map(item => item.id === optimisticId ? data : item)
      );

      toast.success("Contributeur ajouté avec succès");
    } catch (error) {
      console.error("Error adding contributor:", error);
      toast.error("Erreur lors de l'ajout du contributeur");
      
      // Revenir à l'état précédent en cas d'erreur
      queryClient.invalidateQueries({ queryKey: ["contributors"] });
    }
  };

  // Fonction de mise à jour d'un contributeur avec mise à jour optimiste
  const handleUpdateContributor = async (contributor: Contributor) => {
    // Sauvegarde de l'état précédent
    const previousData = queryClient.getQueryData(["contributors"]);
    
    // Ensure contributors is treated as an array
    const currentContributors = Array.isArray(contributors) ? contributors : [];
    
    // Mise à jour optimiste
    queryClient.setQueryData(["contributors"], 
      currentContributors.map(item => item.id === contributor.id ? contributor : item)
    );
    
    try {
      const { error } = await supabase
        .from("contributors")
        .update(contributor)
        .eq("id", contributor.id);

      if (error) throw error;
      
      toast.success("Contributeur mis à jour avec succès");
    } catch (error) {
      console.error("Error updating contributor:", error);
      toast.error("Erreur lors de la mise à jour du contributeur");
      
      // Revenir à l'état précédent en cas d'erreur
      queryClient.setQueryData(["contributors"], previousData);
    }
  };

  // Fonction de suppression d'un contributeur avec mise à jour optimiste
  const handleDeleteContributor = async (id: string) => {
    // Sauvegarde de l'état précédent
    const previousData = queryClient.getQueryData(["contributors"]);
    
    // Ensure contributors is treated as an array
    const currentContributors = Array.isArray(contributors) ? contributors : [];
    
    // Mise à jour optimiste
    queryClient.setQueryData(["contributors"], 
      currentContributors.filter(item => item.id !== id)
    );
    
    try {
      const { error } = await supabase
        .from("contributors")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Contributeur supprimé avec succès");
    } catch (error) {
      console.error("Error deleting contributor:", error);
      toast.error("Erreur lors de la suppression du contributeur");
      
      // Revenir à l'état précédent en cas d'erreur
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
