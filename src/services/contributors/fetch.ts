
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
    console.log("Encryption disabled, using original values");
    return data || [];
  }
  
  // Si le chiffrement est activé, déchiffrer les données
  const userKey = await getUserEncryptionKey(user.id);
  
  console.log("Fetching contributors with encryption enabled");
  
  return (data || []).map(contributor => {
    try {
      // Déchiffrer seulement les données qui sont marquées comme chiffrées
      // et qui ont une valeur chiffrée
      if (contributor.is_encrypted && contributor.total_contribution_encrypted) {
        console.log(`Decrypting data for contributor ${contributor.id}`);
        return {
          ...contributor,
          total_contribution: decryptValue(contributor.total_contribution_encrypted, userKey, true) as number
        };
      }
      
      // Si les données ne sont pas chiffrées, utiliser les valeurs originales
      console.log(`Using original value for contributor ${contributor.id} (not encrypted)`);
      return contributor;
    } catch (error) {
      console.error(`Error decrypting data for contributor ${contributor.id}:`, error);
      return contributor;
    }
  });
};
