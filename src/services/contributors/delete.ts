
import { supabase } from "@/integrations/supabase/client";
import { fetchContributorsService } from "./fetch";

/**
 * Deletes a contributor by ID
 */
export const deleteContributorService = async (contributorId: string) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Non authentifié");

  const { error: deleteError } = await supabase
    .from("contributors")
    .delete()
    .eq("id", contributorId)
    .eq("profile_id", user.id);

  if (deleteError) throw deleteError;

  return await fetchContributorsService();
};
