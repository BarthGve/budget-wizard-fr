
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Contributor, NewContributor } from "@/types/contributor";
import { toast } from "sonner";
import {
  fetchContributorsService,
  addContributorService,
  updateContributorService,
  deleteContributorService,
} from "@/services/contributors";

export const useContributors = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [editingContributor, setEditingContributor] = useState<Contributor | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchContributors = async () => {
    try {
      const data = await fetchContributorsService();
      setContributors(data);
    } catch (error: any) {
      console.error("Error fetching contributors:", error);
      toast.error("Erreur lors du chargement des contributeurs");
    } finally {
      setIsLoading(false);
    }
  };

  const addContributor = async (newContributor: NewContributor) => {
    if (!newContributor.name || isNaN(parseFloat(newContributor.total_contribution))) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (!user) {
        toast.error("Vous devez être connecté pour ajouter un contributeur");
        return;
      }

      const updatedContributors = await addContributorService(newContributor, user.id);
      setContributors(updatedContributors);
      toast.success("Le contributeur a été ajouté avec succès");
    } catch (error: any) {
      console.error("Error adding contributor:", error);
      toast.error(error.message || "Erreur lors de l'ajout du contributeur");
    }
  };

  const updateContributor = async (contributor: Contributor) => {
    try {
      // Optimistic update for better UX
      const optimisticContributors = contributors.map(c => 
        c.id === contributor.id ? contributor : c
      );
      setContributors(optimisticContributors);
      
      // Actual update in the database
      const updatedContributors = await updateContributorService(contributor);
      
      // Update state with the response from the server
      setContributors(updatedContributors);
      setEditingContributor(null);
      toast.success("Le contributeur a été mis à jour avec succès");
    } catch (error: any) {
      console.error("Error updating contributor:", error);
      toast.error("Erreur lors de la mise à jour du contributeur");
      
      // Revert optimistic update if there's an error
      fetchContributors();
    }
  };

  const deleteContributor = async (id: string) => {
    try {
      // Optimistic removal
      const filteredContributors = contributors.filter(c => c.id !== id);
      setContributors(filteredContributors);
      
      // Actual delete
      const updatedContributors = await deleteContributorService(id);
      
      // Update with server data
      setContributors(updatedContributors);
      toast.success("Le contributeur a été supprimé avec succès");
    } catch (error: any) {
      console.error("Error deleting contributor:", error);
      toast.error(error.message || "Erreur lors de la suppression du contributeur");
      
      // Revert optimistic delete
      fetchContributors();
    }
  };

  useEffect(() => {
    fetchContributors();
  }, []);

  return {
    contributors,
    isLoading,
    editingContributor,
    setEditingContributor,
    addContributor,
    updateContributor,
    deleteContributor,
  };
};
