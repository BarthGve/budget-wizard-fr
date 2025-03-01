
import { supabase } from "@/integrations/supabase/client";
import { encryptValue, getUserEncryptionKey, isEncryptionEnabled } from "@/services/encryption";

/**
 * Service pour migrer les données existantes vers le format chiffré
 */
export const migrateContributorsToEncrypted = async (): Promise<void> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error("Erreur d'authentification:", userError);
    throw userError;
  }
  if (!user) throw new Error("Non authentifié");
  
  console.log("Début de la migration des données vers le format chiffré");
  
  // Récupérer tous les contributeurs de l'utilisateur
  const { data: contributors, error } = await supabase
    .from("contributors")
    .select("*")
    .eq("profile_id", user.id);
  
  if (error) {
    console.error("Erreur lors de la récupération des contributeurs:", error);
    throw error;
  }
  
  if (!contributors || contributors.length === 0) {
    console.log("Aucun contributeur à migrer");
    return;
  }
  
  console.log(`Migration de ${contributors.length} contributeurs`);
  console.log("Contributeurs à migrer:", contributors.map(c => ({
    id: c.id,
    name: c.name,
    contribution: c.total_contribution,
    is_encrypted: c.is_encrypted
  })));
  
  // Générer la clé de chiffrement de l'utilisateur
  const userKey = await getUserEncryptionKey(user.id);
  
  // Mettre à jour les contributeurs un par un pour s'assurer que chaque mise à jour est réussie
  for (const contributor of contributors) {
    try {
      // Chiffrer la valeur de contribution
      const encryptedValue = encryptValue(contributor.total_contribution, userKey);
      
      console.log(`Migration du contributeur ${contributor.id}:`, {
        originalValue: contributor.total_contribution,
        encryptedValue: encryptedValue.substring(0, 20) + '...'
      });
      
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
      
      console.log(`Contributeur ${contributor.id} migré avec succès`);
    } catch (error) {
      console.error(`Erreur lors de la migration du contributeur ${contributor.id}:`, error);
      throw error;
    }
  }
  
  console.log(`Migration réussie pour ${contributors.length} contributeurs`);
  
  // Vérifier que la migration a fonctionné
  const { data: updatedContributors, error: verificationError } = await supabase
    .from("contributors")
    .select("id, is_encrypted, total_contribution_encrypted, total_contribution")
    .eq("profile_id", user.id);
    
  if (verificationError) {
    console.error("Erreur lors de la vérification de la migration:", verificationError);
  } else {
    console.log("État après migration:", updatedContributors?.map(c => ({
      id: c.id,
      is_encrypted: c.is_encrypted,
      has_encrypted_data: !!c.total_contribution_encrypted
    })));
  }
  
  // Activer le chiffrement dans le profil utilisateur
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ encryption_enabled: true })
    .eq("id", user.id);
  
  if (profileError) {
    console.error("Erreur lors de la mise à jour du profil:", profileError);
    throw profileError;
  }
  
  console.log("Chiffrement activé dans le profil utilisateur");
};

/**
 * Service pour activer le chiffrement pour un utilisateur
 */
export const enableEncryption = async (): Promise<void> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Non authentifié");
  
  console.log("Activation du chiffrement pour l'utilisateur", user.id);
  
  // Migrer les données existantes
  await migrateContributorsToEncrypted();
  
  // Le profil est déjà mis à jour dans la fonction migrateContributorsToEncrypted
  console.log("Chiffrement activé avec succès");
};

/**
 * Service pour vérifier si le chiffrement est activé pour l'utilisateur
 */
export const checkEncryptionStatus = async (): Promise<boolean> => {
  const status = await isEncryptionEnabled();
  console.log("État actuel du chiffrement:", status);
  return status;
};
