
import { supabase } from "@/integrations/supabase/client";
import { Contributor } from "@/types/contributor";
import { getAuthenticatedUserId } from "./base";
import { recalculatePercentages } from "./percentages";
import { fetchContributorsService } from "./fetch";

export const updateContributorService = async (contributor: Contributor): Promise<Contributor[]> => {
  const userId = await getAuthenticatedUserId();

  // Pour la mise à jour, on vérifie aussi l'unicité de l'email s'il est modifié
  if (contributor.email && contributor.email.trim() !== '') {
    const { data: existingContributor, error: existingError } = await supabase
      .from("contributors")
      .select("id")
      .eq("email", contributor.email.trim())
      .eq("profile_id", userId)
      .neq("id", contributor.id) // On exclut le contributeur actuel
      .maybeSingle();

    if (existingError) throw existingError;
    if (existingContributor) {
      throw new Error("Un contributeur avec cet email existe déjà");
    }
  }

  const updateData = contributor.is_owner
    ? { total_contribution: contributor.total_contribution }
    : {
        name: contributor.name,
        email: contributor.email ? contributor.email.trim() : null,
        total_contribution: contributor.total_contribution,
      };

  const { error: updateError } = await supabase
    .from("contributors")
    .update(updateData)
    .eq("id", contributor.id)
    .eq("profile_id", userId);

  if (updateError) throw updateError;

  // Recalculer les pourcentages manuellement
  await recalculatePercentages(userId);

  return await fetchContributorsService();
};
