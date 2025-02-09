
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
  const { error: insertError } = await supabase.from("contributors").insert([
    {
      name: newContributor.name,
      email: newContributor.email,
      total_contribution: contribution,
      percentage_contribution: (contribution / totalBudget) * 100,
      profile_id: userId,
    },
  ]);

  if (insertError) throw insertError;

  // Ensuite, mettre à jour les pourcentages de tous les contributeurs existants
  const updatePromises = currentContributors.map((contributor) => {
    const newPercentage = (contributor.total_contribution / totalBudget) * 100;
    return supabase
      .from("contributors")
      .update({ percentage_contribution: newPercentage })
      .eq("id", contributor.id);
  });

  await Promise.all(updatePromises);
};

export const updateContributorService = async (
  contributor: Contributor,
  currentContributors: Contributor[]
) => {
  console.log("Updating contributor:", contributor);
  console.log("Current contributors:", currentContributors);

  // Calculer le nouveau budget total
  const totalBudget = currentContributors.reduce(
    (sum, c) =>
      sum +
      (c.id === contributor.id
        ? contributor.total_contribution
        : c.total_contribution),
    0
  );

  console.log("Total budget:", totalBudget);

  // Mettre à jour tous les contributeurs avec leurs nouveaux pourcentages
  const updatePromises = currentContributors.map(async (c) => {
    const isUpdatedContributor = c.id === contributor.id;
    const contribution = isUpdatedContributor
      ? contributor.total_contribution
      : c.total_contribution;
    const percentage = (contribution / totalBudget) * 100;

    console.log(`Updating contributor ${c.id}:`, {
      contribution,
      percentage,
      isUpdatedContributor,
    });

    const updateData = isUpdatedContributor
      ? {
          total_contribution: contribution,
          percentage_contribution: percentage,
          ...(c.is_owner
            ? {}
            : {
                name: contributor.name,
                email: contributor.email,
              }),
        }
      : {
          percentage_contribution: percentage,
        };

    console.log("Update data:", updateData);

    const { data, error } = await supabase
      .from("contributors")
      .update(updateData)
      .eq("id", c.id)
      .select();

    if (error) {
      console.error(`Error updating contributor ${c.id}:`, error);
      throw error;
    }

    console.log(`Updated contributor ${c.id}:`, data);
    return data;
  });

  await Promise.all(updatePromises);
};

export const deleteContributorService = async (
  contributorId: string,
  currentContributors: Contributor[]
) => {
  const contributorToDelete = currentContributors.find((c) => c.id === contributorId);
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

  // Mettre à jour les pourcentages des contributeurs restants
  const updatePromises = remainingContributors.map((contributor) => {
    const newPercentage = (contributor.total_contribution / totalBudget) * 100;
    return supabase
      .from("contributors")
      .update({ percentage_contribution: newPercentage })
      .eq("id", contributor.id);
  });

  await Promise.all(updatePromises);
};
