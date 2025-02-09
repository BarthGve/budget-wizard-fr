
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
    .select("*")
    .single();

  if (insertError) throw insertError;
  if (!insertedContributor) throw new Error("Erreur lors de l'ajout du contributeur");

  for (const contributor of currentContributors) {
    const newPercentage = (contributor.total_contribution / totalBudget) * 100;
    const { error: updateError } = await supabase
      .from("contributors")
      .update({ percentage_contribution: newPercentage })
      .eq("id", contributor.id);

    if (updateError) throw updateError;
  }

  return await fetchContributorsService();
};

export const updateContributorService = async (
  contributor: Contributor,
  currentContributors: Contributor[]
) => {
  const { data: existingContributor, error: checkError } = await supabase
    .from("contributors")
    .select("*")
    .eq("id", contributor.id)
    .maybeSingle();

  if (checkError) throw checkError;
  if (!existingContributor) {
    throw new Error(`Contributeur non trouvé avec l'ID: ${contributor.id}`);
  }

  const totalBudget = currentContributors.reduce(
    (sum, c) =>
      sum +
      (c.id === contributor.id
        ? contributor.total_contribution
        : c.total_contribution),
    0
  );

  // Mettre à jour séparément la contribution et les autres champs
  const { error: updateError } = await supabase
    .from("contributors")
    .update({
      total_contribution: contributor.total_contribution,
      percentage_contribution: (contributor.total_contribution / totalBudget) * 100,
    })
    .eq("id", contributor.id);

  if (updateError) throw updateError;

  // Si ce n'est pas le propriétaire, mettre à jour le nom et l'email
  if (!existingContributor.is_owner) {
    const { error: updateNameEmailError } = await supabase
      .from("contributors")
      .update({
        name: contributor.name,
        email: contributor.email,
      })
      .eq("id", contributor.id);

    if (updateNameEmailError) throw updateNameEmailError;
  }

  // Mettre à jour les pourcentages des autres contributeurs
  for (const c of currentContributors) {
    if (c.id !== contributor.id) {
      const newPercentage = (c.total_contribution / totalBudget) * 100;
      const { error } = await supabase
        .from("contributors")
        .update({ percentage_contribution: newPercentage })
        .eq("id", c.id);

      if (error) throw error;
    }
  }

  return await fetchContributorsService();
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

  const { error: deleteError } = await supabase
    .from("contributors")
    .delete()
    .eq("id", contributorId);

  if (deleteError) throw deleteError;

  const remainingContributors = currentContributors.filter(
    (c) => c.id !== contributorId
  );
  const totalBudget = remainingContributors.reduce(
    (sum, c) => sum + c.total_contribution,
    0
  );

  for (const contributor of remainingContributors) {
    const newPercentage = (contributor.total_contribution / totalBudget) * 100;
    const { error } = await supabase
      .from("contributors")
      .update({ percentage_contribution: newPercentage })
      .eq("id", contributor.id);

    if (error) throw error;
  }

  return await fetchContributorsService();
};
