
import { supabase } from "@/integrations/supabase/client";
import { Contributor } from "@/types/contributor";
import { encryptValue, getUserEncryptionKey, isEncryptionEnabled } from "@/services/encryption";
import { fetchContributorsService } from "./fetch";

/**
 * Updates an existing contributor
 */
export const updateContributorService = async (contributor: Contributor) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Non authentifié");

  // Pour la mise à jour, on vérifie aussi l'unicité de l'email s'il est modifié
  if (contributor.email && contributor.email.trim() !== '') {
    const { data: existingContributor, error: existingError } = await supabase
      .from("contributors")
      .select("id")
      .eq("email", contributor.email.trim())
      .eq("profile_id", user.id)
      .neq("id", contributor.id) // On exclut le contributeur actuel
      .maybeSingle();

    if (existingError) throw existingError;
    if (existingContributor) {
      throw new Error("Un contributeur avec cet email existe déjà");
    }
  }

  // Vérifier si le chiffrement est activé
  const encryptionEnabled = await isEncryptionEnabled();
  
  let updateData: any = contributor.is_owner
    ? { total_contribution: contributor.total_contribution }
    : {
        name: contributor.name,
        email: contributor.email ? contributor.email.trim() : null,
        total_contribution: contributor.total_contribution,
      };
  
  // Si le chiffrement est activé, chiffrer les données sensibles
  if (encryptionEnabled) {
    const userKey = await getUserEncryptionKey(user.id);
    updateData.total_contribution_encrypted = encryptValue(contributor.total_contribution, userKey);
    updateData.is_encrypted = true;
  }

  const { error: updateError } = await supabase
    .from("contributors")
    .update(updateData)
    .eq("id", contributor.id)
    .eq("profile_id", user.id);

  if (updateError) throw updateError;

  return await fetchContributorsService();
};
