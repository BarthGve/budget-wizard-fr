
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Contributor, NewContributor } from "@/types/contributor";
import { toast } from "sonner";

export const useContributors = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [editingContributor, setEditingContributor] = useState<Contributor | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchContributors = async () => {
    try {
      const { data, error } = await supabase
        .from("contributors")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;

      setContributors(data || []);
    } catch (error: any) {
      console.error("Error fetching contributors:", error);
      toast.error("Erreur lors du chargement des contributeurs");
    } finally {
      setIsLoading(false);
    }
  };

  const addContributor = async (newContributor: NewContributor) => {
    const contribution = parseFloat(newContributor.total_contribution);
    if (!newContributor.name || !newContributor.email || isNaN(contribution)) {
      toast.error("Veuillez remplir tous les champs correctement");
      return;
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (!user) {
        toast.error("Vous devez être connecté pour ajouter un contributeur");
        return;
      }

      // Check if email already exists
      const { data: existingContributor } = await supabase
        .from("contributors")
        .select("id")
        .eq("email", newContributor.email)
        .single();

      if (existingContributor) {
        toast.error("Un contributeur avec cet email existe déjà");
        return;
      }

      // Calculate new percentage contributions
      const totalBudget = contributors.reduce(
        (sum, c) => sum + c.total_contribution,
        0
      ) + contribution;

      const { error: insertError } = await supabase
        .from("contributors")
        .insert([
          {
            name: newContributor.name,
            email: newContributor.email,
            total_contribution: contribution,
            percentage_contribution: (contribution / totalBudget) * 100,
            profile_id: user.id,
          },
        ]);

      if (insertError) throw insertError;

      // Update percentages for all contributors
      await Promise.all(
        contributors.map((c) =>
          supabase
            .from("contributors")
            .update({
              percentage_contribution: (c.total_contribution / totalBudget) * 100,
            })
            .eq("id", c.id)
        )
      );

      toast.success("Le contributeur a été ajouté avec succès");
      fetchContributors();
    } catch (error: any) {
      console.error("Error adding contributor:", error);
      toast.error("Erreur lors de l'ajout du contributeur");
    }
  };

  const updateContributor = async (contributor: Contributor) => {
    try {
      const totalBudget = contributors.reduce(
        (sum, c) =>
          sum +
          (c.id === contributor.id
            ? contributor.total_contribution
            : c.total_contribution),
        0
      );

      const updatedContributors = contributors.map((c) => ({
        ...c,
        percentage_contribution:
          ((c.id === contributor.id
            ? contributor.total_contribution
            : c.total_contribution) /
            totalBudget) *
          100,
      }));

      // Update the edited contributor
      const { error: updateError } = await supabase
        .from("contributors")
        .update({
          name: contributor.name,
          email: contributor.email,
          total_contribution: contributor.total_contribution,
          percentage_contribution:
            (contributor.total_contribution / totalBudget) * 100,
        })
        .eq("id", contributor.id);

      if (updateError) throw updateError;

      // Update percentages for all other contributors
      await Promise.all(
        updatedContributors
          .filter((c) => c.id !== contributor.id)
          .map((c) =>
            supabase
              .from("contributors")
              .update({ percentage_contribution: c.percentage_contribution })
              .eq("id", c.id)
          )
      );

      setEditingContributor(null);
      toast.success("Le contributeur a été mis à jour avec succès");
      fetchContributors();
    } catch (error: any) {
      console.error("Error updating contributor:", error);
      toast.error("Erreur lors de la mise à jour du contributeur");
    }
  };

  const deleteContributor = async (id: string) => {
    try {
      const contributorToDelete = contributors.find((c) => c.id === id);
      if (!contributorToDelete) return;

      if (contributorToDelete.is_owner) {
        toast.error("Impossible de supprimer le propriétaire");
        return;
      }

      const { error: deleteError } = await supabase
        .from("contributors")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      const remainingContributors = contributors.filter((c) => c.id !== id);
      const totalBudget = remainingContributors.reduce(
        (sum, c) => sum + c.total_contribution,
        0
      );

      // Update percentages for remaining contributors
      await Promise.all(
        remainingContributors.map((c) =>
          supabase
            .from("contributors")
            .update({
              percentage_contribution: (c.total_contribution / totalBudget) * 100,
            })
            .eq("id", c.id)
        )
      );

      toast.success("Le contributeur a été supprimé avec succès");
      fetchContributors();
    } catch (error: any) {
      console.error("Error deleting contributor:", error);
      toast.error("Erreur lors de la suppression du contributeur");
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
