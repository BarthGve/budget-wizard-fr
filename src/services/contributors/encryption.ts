
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
    .eq("profile_id", user.id)
    .eq("is_encrypted", false);
  
  if (error) throw error;
  if (!contributors || contributors.length === 0) return;
  
  // Générer la clé de chiffrement de l'utilisateur
  const userKey = await getUserEncryptionKey(user.id);
  
  // Préparer les mises à jour en lot
  const updates = contributors.map(contributor => ({
    id: contributor.id,
    total_contribution_encrypted: encryptValue(contributor.total_contribution, userKey),
    is_encrypted: true
  }));
  
  // Mettre à jour les contributeurs en lot
  for (const update of updates) {
    const { error: updateError } = await supabase
      .from("contributors")
      .update({
        total_contribution_encrypted: update.total_contribution_encrypted,
        is_encrypted: true
      })
      .eq("id", update.id)
      .eq("profile_id", user.id);
    
    if (updateError) throw updateError;
  }
  
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
  
  // Mettre à jour le profil utilisateur pour activer le chiffrement
  const { error } = await supabase
    .from("profiles")
    .update({ encryption_enabled: true })
    .eq("id", user.id);
  
  if (error) throw error;
};

/**
 * Service pour vérifier si le chiffrement est activé pour l'utilisateur
 */
export const checkEncryptionStatus = async (): Promise<boolean> => {
  return await isEncryptionEnabled();
};
