
import { supabase } from "@/integrations/supabase/client";
import { Contributor } from "@/types/contributor";
import { decryptValue, getUserEncryptionKey, isEncryptionEnabled } from "@/services/encryption";

/**
 * Fetches all contributors for the current user
 */
export const fetchContributorsService = async (): Promise<Contributor[]> => {
  console.log("Début de la récupération des contributeurs");
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error("Erreur d'authentification:", userError);
    throw userError;
  }
  if (!user) throw new Error("Non authentifié");

  const { data, error } = await supabase
    .from("contributors")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Erreur lors de la récupération des contributeurs:", error);
    throw error;
  }
  
  if (!data || data.length === 0) {
    console.log("Aucun contributeur trouvé");
    return [];
  }
  
  // Vérifier si le chiffrement est activé
  const encryptionEnabled = await isEncryptionEnabled();
  
  if (!encryptionEnabled) {
    console.log("Chiffrement désactivé, utilisation des valeurs originales");
    return data;
  }
  
  console.log("Chiffrement activé, vérification des données à déchiffrer");
  console.log("Données récupérées:", data.map(c => ({
    id: c.id,
    name: c.name,
    is_encrypted: c.is_encrypted,
    has_encrypted_data: !!c.total_contribution_encrypted
  })));
  
  // Si le chiffrement est activé, déchiffrer les données
  const userKey = await getUserEncryptionKey(user.id);
  
  return data.map(contributor => {
    try {
      // Déchiffrer seulement les données qui sont marquées comme chiffrées
      // et qui ont une valeur chiffrée
      if (contributor.is_encrypted && contributor.total_contribution_encrypted) {
        console.log(`Déchiffrement des données pour le contributeur ${contributor.id}`);
        
        try {
          const decryptedValue = decryptValue(contributor.total_contribution_encrypted, userKey);
          
          if (typeof decryptedValue === 'number') {
            console.log(`Valeur déchiffrée pour le contributeur ${contributor.id}: ${decryptedValue}`);
            
            return {
              ...contributor,
              total_contribution: decryptedValue
            };
          } else {
            console.error(`Déchiffrement incorrect pour le contributeur ${contributor.id}, type reçu:`, typeof decryptedValue);
            return contributor;
          }
        } catch (decryptError) {
          console.error(`Erreur lors du déchiffrement pour le contributeur ${contributor.id}:`, decryptError);
          return contributor;
        }
      }
      
      // Si les données ne sont pas chiffrées, utiliser les valeurs originales
      console.log(`Utilisation de la valeur originale pour le contributeur ${contributor.id} (non chiffré)`);
      return contributor;
    } catch (error) {
      console.error(`Erreur lors du traitement des données pour le contributeur ${contributor.id}:`, error);
      return contributor;
    }
  });
};
