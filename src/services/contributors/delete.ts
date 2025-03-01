
import { supabase } from "@/integrations/supabase/client";
import { Contributor } from "@/types/contributor";
import { getAuthenticatedUserId } from "./base";
import { recalculatePercentages } from "./percentages";
import { fetchContributorsService } from "./fetch";

export const deleteContributorService = async (contributorId: string): Promise<Contributor[]> => {
  const userId = await getAuthenticatedUserId();

  const { error: deleteError } = await supabase
    .from("contributors")
    .delete()
    .eq("id", contributorId)
    .eq("profile_id", userId);

  if (deleteError) throw deleteError;

  // Recalculer les pourcentages manuellement
  await recalculatePercentages(userId);

  return await fetchContributorsService();
};
