
import { useState } from "react";
import { Contributor, NewContributor } from "@/types/contributor";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useContributors = () => {
  const [editingContributor, setEditingContributor] = useState<Contributor | null>(null);
  const queryClient = useQueryClient();

  const { data: contributors = [], isLoading } = useQuery({
    queryKey: ["contributors"],
    queryFn: async () => {
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
    },
    staleTime: 60 * 1000, // 1 minute
  });

  const addContributor = async (newContributor: NewContributor) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour ajouter un contributeur");
        return null;
      }

      const { data, error } = await supabase
        .from("contributors")
        .insert([{ ...newContributor, profile_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour le cache localement pour une UX plus fluide
      queryClient.setQueryData(["contributors"], (old: Contributor[] = []) => 
        [...old, data]
      );
      
      return data;
    } catch (error: any) {
      console.error("Error adding contributor:", error);
      toast.error(error.message || "Erreur lors de l'ajout du contributeur");
      return null;
    }
  };

  const updateContributor = async (contributor: Contributor) => {
    try {
      const { data, error } = await supabase
        .from("contributors")
        .update(contributor)
        .eq("id", contributor.id)
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour le cache localement
      queryClient.setQueryData(["contributors"], (old: Contributor[] = []) => 
        old.map(item => item.id === data.id ? data : item)
      );
      
      setEditingContributor(null);
      
      return data;
    } catch (error: any) {
      console.error("Error updating contributor:", error);
      toast.error(error.message || "Erreur lors de la mise à jour du contributeur");
      return null;
    }
  };

  const deleteContributor = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contributors")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Mettre à jour le cache localement
      queryClient.setQueryData(["contributors"], (old: Contributor[] = []) => 
        old.filter(item => item.id !== id)
      );
      
      return true;
    } catch (error: any) {
      console.error("Error deleting contributor:", error);
      toast.error(error.message || "Erreur lors de la suppression du contributeur");
      return false;
    }
  };

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
