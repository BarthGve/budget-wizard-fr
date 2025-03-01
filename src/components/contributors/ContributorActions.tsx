
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Contributor } from "@/types/contributor";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useContributorActions = () => {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddContributor = async (newContributor: any) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    const optimisticId = `temp-${Date.now()}`;
    queryClient.setQueryData(["contributors"], (old: Contributor[] = []) => [
      { ...newContributor, id: optimisticId, total_contribution: parseFloat(newContributor.total_contribution) } as Contributor,
      ...old
    ]);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Conversion du string en number pour total_contribution
      const contributorToAdd = {
        ...newContributor,
        profile_id: user.id,
        total_contribution: parseFloat(newContributor.total_contribution)
      };

      const { data, error } = await supabase
        .from("contributors")
        .insert([contributorToAdd])
        .select()
        .single();

      if (error) throw error;

      // Mise à jour avec les vraies données du serveur sans invalider la requête
      queryClient.setQueryData(["contributors"], (old: Contributor[] = []) => 
        old.map(item => item.id === optimisticId ? data : item)
      );

      toast.success("Contributeur ajouté avec succès");
    } catch (error) {
      console.error("Error adding contributor:", error);
      toast.error("Erreur lors de l'ajout du contributeur");
      
      // Revenir à l'état précédent en cas d'erreur
      queryClient.invalidateQueries({ queryKey: ["contributors"] });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateContributor = async (contributor: Contributor) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    // Sauvegarde de l'état précédent
    const previousData = queryClient.getQueryData(["contributors"]);
    
    // Mise à jour optimiste
    queryClient.setQueryData(["contributors"], (old: Contributor[] = []) => 
      old.map(item => item.id === contributor.id ? contributor : item)
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
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteContributor = async (id: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    // Sauvegarde de l'état précédent
    const previousData = queryClient.getQueryData(["contributors"]);
    
    // Mise à jour optimiste
    queryClient.setQueryData(["contributors"], (old: Contributor[] = []) => 
      old.filter(item => item.id !== id)
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
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleAddContributor,
    handleUpdateContributor,
    handleDeleteContributor,
    isProcessing
  };
};
