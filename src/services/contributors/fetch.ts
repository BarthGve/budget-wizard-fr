
import { supabase } from "@/integrations/supabase/client";
import { Contributor } from "@/types/contributor";
import { decryptValue, getUserEncryptionKey, isEncryptionEnabled } from "@/services/encryption";

/**
 * Fetches all contributors for the current user
 */
export const fetchContributorsService = async (): Promise<Contributor[]> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Non authentifié");

  const { data, error } = await supabase
    .from("contributors")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: true });

  if (error) throw error;
  
  // Vérifier si le chiffrement est activé
  const encryptionEnabled = await isEncryptionEnabled();
  
  if (!encryptionEnabled) {
    return data || [];
  }
  
  // Si le chiffrement est activé, déchiffrer les données
  const userKey = await getUserEncryptionKey(user.id);
  
  return (data || []).map(contributor => {
    // Déchiffrer seulement les données qui sont marquées comme chiffrées
    if (contributor.is_encrypted && contributor.total_contribution_encrypted) {
      return {
        ...contributor,
        total_contribution: decryptValue(contributor.total_contribution_encrypted, userKey, true) as number
      };
    }
    return contributor;
  });
};
