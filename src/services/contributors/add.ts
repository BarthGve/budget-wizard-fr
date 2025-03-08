
import { supabase } from "@/integrations/supabase/client";
import { Contributor, NewContributor } from "@/types/contributor";
import { getAuthenticatedUserId } from "./base";
import { recalculatePercentages } from "./percentages";
import { fetchContributorsService } from "./fetch";

export const addContributorService = async (
  newContributor: NewContributor
): Promise<Contributor[]> => {
  const userId = await getAuthenticatedUserId();

  // On ne vérifie l'unicité de l'email que s'il est fourni
  if (newContributor.email && newContributor.email.trim() !== '') {
    const { data: existingContributor, error: existingError } = await supabase
      .from("contributors")
      .select("id")
      .eq("email", newContributor.email.trim())
      .eq("profile_id", userId)
      .maybeSingle();

    if (existingError) throw existingError;
    if (existingContributor) {
      throw new Error("Un contributeur avec cet email existe déjà");
    }
  }

  const contribution = parseFloat(newContributor.total_contribution);

  const { data: insertedContributor, error: insertError } = await supabase
    .from("contributors")
    .insert([
      {
        name: newContributor.name,
        email: newContributor.email ? newContributor.email.trim() : null, // On s'assure que l'email est null si vide
        total_contribution: contribution,
        percentage_contribution: 0, // Initialiser à 0, sera recalculé après
        profile_id: userId,
      },
    ])
    .select()
    .single();

  if (insertError) throw insertError;
  if (!insertedContributor) throw new Error("Erreur lors de l'ajout du contributeur");

  // Recalculer les pourcentages manuellement
  await recalculatePercentages(userId);

  return await fetchContributorsService();
};
