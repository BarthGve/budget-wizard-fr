
import { supabase } from "@/integrations/supabase/client";
import { Contributor } from "@/types/contributor";
import { encryptValue, getUserEncryptionKey } from "@/services/encryption";

/**
 * Migre les données des contributeurs existants vers des données chiffrées
 */
export const migrateContributorsToEncrypted = async (): Promise<boolean> => {
  try {
    console.log("Début de la migration des données des contributeurs");
    
    // 1. Récupérer l'utilisateur actuel
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Erreur d'authentification:", userError);
      return false;
    }
    if (!user) {
      console.error("Utilisateur non authentifié");
      return false;
    }
    
    // 2. Récupérer tous les contributeurs de l'utilisateur
    const { data: contributors, error: contributorsError } = await supabase
      .from("contributors")
      .select("*")
      .eq("profile_id", user.id);
    
    if (contributorsError) {
      console.error("Erreur lors de la récupération des contributeurs:", contributorsError);
      return false;
    }
    
    if (!contributors || contributors.length === 0) {
      console.log("Aucun contributeur à migrer");
      // Mettre à jour quand même le profil pour activer le chiffrement
      await updateEncryptionFlag(user.id, true);
      return true;
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
    
    // 3. Chiffrer les données pour chaque contributeur
    for (const contributor of contributors) {
      try {
        // Chiffrer les données
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
          .eq("id", contributor.id);
        
        if (updateError) {
          console.error(`Erreur lors de la mise à jour du contributeur ${contributor.id}:`, updateError);
        }
      } catch (error) {
        console.error(`Erreur lors du chiffrement des données pour le contributeur ${contributor.id}:`, error);
      }
    }
    
    // 4. Mettre à jour les pourcentages côté client
    const { data: updatedContributors, error: verificationError } = await supabase
      .from("contributors")
      .select("*")
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
    await updateEncryptionFlag(user.id, true);
    
    return true;
  } catch (error) {
    console.error("Erreur globale lors de la migration:", error);
    return false;
  }
};

/**
 * Met à jour le flag d'activation du chiffrement dans le profil utilisateur
 */
export const updateEncryptionFlag = async (userId: string, enabled: boolean): Promise<void> => {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ encryption_enabled: enabled })
      .eq("id", userId);
    
    if (error) {
      console.error("Erreur lors de la mise à jour du flag de chiffrement:", error);
    } else {
      console.log(`Flag de chiffrement mis à jour: ${enabled}`);
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du flag de chiffrement:", error);
  }
};
