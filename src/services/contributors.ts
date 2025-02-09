
import { supabase } from "@/integrations/supabase/client";
import { Contributor, NewContributor } from "@/types/contributor";

export const fetchContributorsService = async () => {
  const { data, error } = await supabase
    .from("contributors")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
};

export const addContributorService = async (
  newContributor: NewContributor,
  userId: string,
  currentContributors: Contributor[]
) => {
  const { data: existingContributor, error: existingError } = await supabase
    .from("contributors")
    .select("id")
    .eq("email", newContributor.email)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existingContributor) {
    throw new Error("Un contributeur avec cet email existe déjà");
  }

  const contribution = parseFloat(newContributor.total_contribution);
  const totalBudget =
    currentContributors.reduce((sum, c) => sum + c.total_contribution, 0) +
    contribution;

  // D'abord, insérer le nouveau contributeur
  const { data: insertedContributor, error: insertError } = await supabase
    .from("contributors")
    .insert([
      {
        name: newContributor.name,
        email: newContributor.email,
        total_contribution: contribution,
        percentage_contribution: (contribution / totalBudget) * 100,
        profile_id: userId,
      },
    ])
    .select()
    .maybeSingle();

  if (insertError) throw insertError;
  if (!insertedContributor) throw new Error("Erreur lors de l'ajout du contributeur");

  // Ensuite, mettre à jour les pourcentages de tous les contributeurs existants
  for (const contributor of currentContributors) {
    const newPercentage = (contributor.total_contribution / totalBudget) * 100;
    const { error: updateError } = await supabase
      .from("contributors")
      .update({ percentage_contribution: newPercentage })
      .eq("id", contributor.id);

    if (updateError) throw updateError;
  }

  // Récupérer la liste mise à jour des contributeurs
  return await fetchContributorsService();
};

export const updateContributorService = async (
  contributor: Contributor,
  currentContributors: Contributor[]
) => {
  try {
    // Vérifier d'abord si le contributeur existe
    const { data: existingContributor, error: checkError } = await supabase
      .from("contributors")
      .select("*")
      .eq("id", contributor.id)
      .maybeSingle();

    if (checkError) throw checkError;
    if (!existingContributor) {
      throw new Error(`Contributeur non trouvé avec l'ID: ${contributor.id}`);
    }

    // Calculer le nouveau budget total avec la contribution mise à jour
    const totalBudget = currentContributors.reduce(
      (sum, c) =>
        sum +
        (c.id === contributor.id
          ? contributor.total_contribution
          : c.total_contribution),
      0
    );

    // Préparer les données de mise à jour
    const updateData = {
      ...(!existingContributor.is_owner && {
        name: contributor.name,
        email: contributor.email,
      }),
      total_contribution: contributor.total_contribution,
      percentage_contribution: (contributor.total_contribution / totalBudget) * 100,
    };

    // Mettre à jour le contributeur principal
    const { error: updateError } = await supabase
      .from("contributors")
      .update(updateData)
      .eq("id", contributor.id);

    if (updateError) throw updateError;

    // Mettre à jour les pourcentages des autres contributeurs de manière séquentielle
    const otherContributors = currentContributors.filter(
      (c) => c.id !== contributor.id
    );

    for (const c of otherContributors) {
      const newPercentage = (c.total_contribution / totalBudget) * 100;
      const { error } = await supabase
        .from("contributors")
        .update({ percentage_contribution: newPercentage })
        .eq("id", c.id);

      if (error) throw error;
    }

    // Récupérer et retourner la liste mise à jour des contributeurs
    return await fetchContributorsService();
  } catch (error: any) {
    console.error("Error in updateContributorService:", error);
    throw error;
  }
};

export const deleteContributorService = async (
  contributorId: string,
  currentContributors: Contributor[]
) => {
  const contributorToDelete = currentContributors.find(
    (c) => c.id === contributorId
  );
  if (!contributorToDelete) throw new Error("Contributeur non trouvé");
  if (contributorToDelete.is_owner) {
    throw new Error("Impossible de supprimer le propriétaire");
  }

  // D'abord supprimer le contributeur
  const { error: deleteError } = await supabase
    .from("contributors")
    .delete()
    .eq("id", contributorId);

  if (deleteError) throw deleteError;

  // Calculer le nouveau budget total sans le contributeur supprimé
  const remainingContributors = currentContributors.filter(
    (c) => c.id !== contributorId
  );
  const totalBudget = remainingContributors.reduce(
    (sum, c) => sum + c.total_contribution,
    0
  );

  // Mettre à jour les pourcentages des contributeurs restants de manière séquentielle
  for (const contributor of remainingContributors) {
    const newPercentage = (contributor.total_contribution / totalBudget) * 100;
    const { error } = await supabase
      .from("contributors")
      .update({ percentage_contribution: newPercentage })
      .eq("id", contributor.id);

    if (error) throw error;
  }

  // Récupérer la liste mise à jour des contributeurs
  return await fetchContributorsService();
};
