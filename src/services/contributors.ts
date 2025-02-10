
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
  if (newContributor.email) {
    const { data: existingContributor, error: existingError } = await supabase
      .from("contributors")
      .select("id")
      .eq("email", newContributor.email)
      .maybeSingle();

    if (existingError) throw existingError;
    if (existingContributor) {
      throw new Error("Un contributeur avec cet email existe déjà");
    }
  }

  const contribution = parseFloat(newContributor.total_contribution);
  const totalBudget =
    currentContributors.reduce((sum, c) => sum + c.total_contribution, 0) +
    contribution;

  console.log("Adding new contributor:", {
    contribution,
    totalBudget,
    currentContributors,
  });

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

  await updateContributorsPercentages(currentContributors, totalBudget);
  
  return await fetchContributorsService();
};

export const updateContributorService = async (
  contributor: Contributor,
  currentContributors: Contributor[]
) => {
  console.log("Starting update for contributor:", {
    contributor,
    currentContributors,
  });

  const totalBudget = currentContributors.reduce(
    (sum, c) =>
      sum + (c.id === contributor.id ? contributor.total_contribution : c.total_contribution),
    0
  );

  console.log("Calculated total budget:", totalBudget);

  // Mettre à jour la contribution et le pourcentage
  const newPercentage = (contributor.total_contribution / totalBudget) * 100;
  console.log("Updating contribution and percentage:", {
    contribution: contributor.total_contribution,
    percentage: newPercentage,
  });

  const { error: updateError } = await supabase
    .from("contributors")
    .update({
      total_contribution: contributor.total_contribution,
      percentage_contribution: newPercentage,
    })
    .eq("id", contributor.id);

  if (updateError) {
    console.error("Error updating contribution:", updateError);
    throw updateError;
  }

  // Si ce n'est pas le propriétaire, mettre à jour le nom et l'email
  if (!contributor.is_owner) {
    console.log("Updating non-owner details");
    const { error: updateDetailsError } = await supabase
      .from("contributors")
      .update({
        name: contributor.name,
        email: contributor.email,
      })
      .eq("id", contributor.id);

    if (updateDetailsError) {
      console.error("Error updating details:", updateDetailsError);
      throw updateDetailsError;
    }
  }

  // Mettre à jour les pourcentages des autres contributeurs
  const othersToUpdate = currentContributors.filter(c => c.id !== contributor.id);
  console.log("Updating percentages for other contributors:", othersToUpdate);
  
  await updateContributorsPercentages(othersToUpdate, totalBudget);

  return await fetchContributorsService();
};

const updateContributorsPercentages = async (contributors: Contributor[], totalBudget: number) => {
  console.log("Updating percentages for contributors:", {
    contributors,
    totalBudget,
  });

  for (const c of contributors) {
    const newPercentage = (c.total_contribution / totalBudget) * 100;
    console.log("Updating percentage for contributor:", {
      contributorId: c.id,
      contribution: c.total_contribution,
      newPercentage,
    });

    const { error } = await supabase
      .from("contributors")
      .update({ percentage_contribution: newPercentage })
      .eq("id", c.id);

    if (error) {
      console.error("Error updating percentage:", error);
      throw error;
    }
  }
};

export const deleteContributorService = async (
  contributorId: string,
  currentContributors: Contributor[]
) => {
  console.log("Attempting to delete contributor:", contributorId);

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

  console.log("Updating percentages after deletion:", {
    remainingContributors,
    totalBudget,
  });

  await updateContributorsPercentages(remainingContributors, totalBudget);

  return await fetchContributorsService();
};

