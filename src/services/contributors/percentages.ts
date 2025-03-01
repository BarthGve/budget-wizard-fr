
import { Contributor } from "@/types/contributor";
import { isEncryptionEnabled, decryptValue, getUserEncryptionKey } from "@/services/encryption";
import { supabase } from "@/integrations/supabase/client";

/**
 * Calcule les pourcentages de contribution pour tous les contributeurs
 * Cette fonction est nécessaire car avec le chiffrement, les calculs doivent être faits côté client
 */
export const calculateContributorPercentages = async (
  contributors: Contributor[]
): Promise<Contributor[]> => {
  if (!contributors || contributors.length === 0) {
    return [];
  }

  // Si le premier contributeur n'est pas chiffré, nous n'avons pas besoin de recalculer
  // car les pourcentages sont déjà calculés par le trigger Supabase
  if (contributors[0] && !contributors[0].is_encrypted) {
    return contributors;
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("Erreur d'authentification lors du calcul des pourcentages:", userError);
    return contributors;
  }

  const encryptionEnabled = await isEncryptionEnabled();
  if (!encryptionEnabled) {
    // Si le chiffrement n'est pas activé, retourner les données telles quelles
    return contributors;
  }

  console.log("Calcul des pourcentages de contribution côté client avec données chiffrées");

  // Calculer le total des contributions
  const userKey = await getUserEncryptionKey(user.id);
  let totalContribution = 0;

  // Déchiffrer et additionner toutes les contributions
  for (const contributor of contributors) {
    if (contributor.is_encrypted && contributor.total_contribution_encrypted) {
      const decryptedValue = decryptValue(contributor.total_contribution_encrypted, userKey, true) as number;
      totalContribution += decryptedValue;
    } else {
      totalContribution += contributor.total_contribution;
    }
  }

  console.log(`Total des contributions déchiffrées: ${totalContribution}`);

  // Calculer les pourcentages pour chaque contributeur
  return contributors.map(contributor => {
    let contributionValue = contributor.total_contribution;
    
    // Si les données sont chiffrées, utiliser la valeur déchiffrée
    if (contributor.is_encrypted && contributor.total_contribution_encrypted) {
      contributionValue = decryptValue(contributor.total_contribution_encrypted, userKey, true) as number;
    }
    
    const percentage = totalContribution > 0 
      ? (contributionValue / totalContribution) * 100 
      : 0;
    
    return {
      ...contributor,
      percentage_contribution: percentage
    };
  });
};

/**
 * Met à jour les pourcentages de contribution dans la base de données
 * Cette fonction n'est utilisée que lorsque le chiffrement est activé
 */
export const updateContributorPercentagesInDB = async (
  contributors: Contributor[]
): Promise<void> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("Erreur d'authentification lors de la mise à jour des pourcentages:", userError);
    return;
  }

  const encryptionEnabled = await isEncryptionEnabled();
  if (!encryptionEnabled) {
    // Si le chiffrement n'est pas activé, ne rien faire car les triggers s'en chargent
    return;
  }

  console.log("Mise à jour des pourcentages dans la BDD pour les données chiffrées");

  // Mettre à jour chaque contributeur individuellement
  for (const contributor of contributors) {
    try {
      const { error } = await supabase
        .from("contributors")
        .update({ percentage_contribution: contributor.percentage_contribution })
        .eq("id", contributor.id)
        .eq("profile_id", user.id);
      
      if (error) {
        console.error(`Erreur lors de la mise à jour du pourcentage pour ${contributor.id}:`, error);
      }
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du pourcentage pour ${contributor.id}:`, error);
    }
  }
};
