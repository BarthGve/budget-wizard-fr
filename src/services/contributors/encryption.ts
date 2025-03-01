
import { supabase } from "@/integrations/supabase/client";
import { encryptValue, getUserEncryptionKey, isEncryptionEnabled } from "@/services/encryption";

/**
 * Service pour migrer les données existantes vers le format chiffré
 */
export const migrateContributorsToEncrypted = async (): Promise<void> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Non authentifié");
  
  // Récupérer tous les contributeurs de l'utilisateur
  const { data: contributors, error } = await supabase
    .from("contributors")
    .select("*")
    .eq("profile_id", user.id);
  
  if (error) throw error;
  if (!contributors || contributors.length === 0) return;
  
  // Générer la clé de chiffrement de l'utilisateur
  const userKey = await getUserEncryptionKey(user.id);
  
  // Mettre à jour les contributeurs un par un pour s'assurer que chaque mise à jour est réussie
  for (const contributor of contributors) {
    // Chiffrer la valeur de contribution
    const encryptedValue = encryptValue(contributor.total_contribution, userKey);
    
    // Mettre à jour le contributeur avec la valeur chiffrée et marquer comme chiffré
    const { error: updateError } = await supabase
      .from("contributors")
      .update({
        total_contribution_encrypted: encryptedValue,
        is_encrypted: true
      })
      .eq("id", contributor.id)
      .eq("profile_id", user.id);
    
    if (updateError) {
      console.error(`Erreur lors de la mise à jour du contributeur ${contributor.id}:`, updateError);
      throw updateError;
    }
  }
  
  console.log(`Migration réussie pour ${contributors.length} contributeurs`);
  
  // Activer le chiffrement dans le profil utilisateur
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ encryption_enabled: true })
    .eq("id", user.id);
  
  if (profileError) throw profileError;
};

/**
 * Service pour activer le chiffrement pour un utilisateur
 */
export const enableEncryption = async (): Promise<void> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Non authentifié");
  
  // Migrer les données existantes
  await migrateContributorsToEncrypted();
  
  // Le profil est déjà mis à jour dans la fonction migrateContributorsToEncrypted
};

/**
 * Service pour vérifier si le chiffrement est activé pour l'utilisateur
 */
export const checkEncryptionStatus = async (): Promise<boolean> => {
  return await isEncryptionEnabled();
};
