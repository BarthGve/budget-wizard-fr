
import { supabase } from "@/integrations/supabase/client";
import { Contributor, NewContributor } from "@/types/contributor";
import { calculateContributorsPercentages } from "@/utils/contributorCalculations";

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

  await updateContributorsPercentages(currentContributors, totalBudget);
};

export const updateContributorService = async (
  contributor: Contributor,
  currentContributors: Contributor[]
) => {
  const totalBudget = currentContributors.reduce(
    (sum, c) =>
      sum +
      (c.id === contributor.id
        ? contributor.total_contribution
        : c.total_contribution),
    0
  );

  const updatedContributors = calculateContributorsPercentages(
    currentContributors,
    contributor,
    totalBudget
  );

  const updateData = contributor.is_owner
    ? {
        total_contribution: contributor.total_contribution,
        percentage_contribution: (contributor.total_contribution / totalBudget) * 100,
      }
    : {
        name: contributor.name,
        email: contributor.email,
        total_contribution: contributor.total_contribution,
        percentage_contribution: (contributor.total_contribution / totalBudget) * 100,
      };

  const { error: updateError } = await supabase
    .from("contributors")
    .update(updateData)
    .eq("id", contributor.id);

  if (updateError) throw updateError;

  await updateContributorsPercentages(
    updatedContributors.filter((c) => c.id !== contributor.id),
    totalBudget
  );
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

  await updateContributorsPercentages(remainingContributors, totalBudget);
};

const updateContributorsPercentages = async (
  contributors: Contributor[],
  totalBudget: number
) => {
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
};
