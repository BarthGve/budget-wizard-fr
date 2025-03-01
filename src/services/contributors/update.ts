
import { supabase } from "@/integrations/supabase/client";
import { Contributor } from "@/types/contributor";
import { encryptValue, getUserEncryptionKey, isEncryptionEnabled } from "@/services/encryption";
import { calculateContributorPercentages, updateContributorPercentagesInDB } from "./percentages";
import { fetchContributorsService } from "./fetch";

/**
 * Updates an existing contributor
 */
export const updateContributorService = async (contributor: Contributor) => {
  console.log("Début de la mise à jour du contributeur:", contributor);
  
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
  console.log("Chiffrement activé:", encryptionEnabled);
  
  // Préparer les données de base à mettre à jour
  let updateData: any = contributor.is_owner
    ? {}
    : {
        name: contributor.name,
        email: contributor.email ? contributor.email.trim() : null,
      };
  
  // Le champ total_contribution est toujours nécessaire pour les triggers
  updateData.total_contribution = contributor.total_contribution;
  
  // Si le chiffrement est activé, chiffrer les données sensibles
  if (encryptionEnabled) {
    try {
      const userKey = await getUserEncryptionKey(user.id);
      const encryptedValue = encryptValue(contributor.total_contribution, userKey);
      
      console.log("Chiffrement activé pour la mise à jour:", {
        contributorId: contributor.id,
        originalValue: contributor.total_contribution,
        encryptedValue: encryptedValue.substring(0, 20) + '...'
      });
      
      updateData.total_contribution_encrypted = encryptedValue;
      updateData.is_encrypted = true;
    } catch (error) {
      console.error("Erreur lors du chiffrement:", error);
      throw new Error("Impossible de chiffrer les données");
    }
  } else {
    // Si le chiffrement n'est pas activé, s'assurer que les champs sont correctement réinitialisés
    updateData.total_contribution_encrypted = null;
    updateData.is_encrypted = false;
  }

  console.log("Mise à jour d'un contributeur:", {
    id: contributor.id,
    encryptionEnabled: encryptionEnabled,
    updateData: updateData
  });

  const { error: updateError } = await supabase
    .from("contributors")
    .update(updateData)
    .eq("id", contributor.id)
    .eq("profile_id", user.id);

  if (updateError) {
    console.error("Erreur lors de la mise à jour:", updateError);
    throw updateError;
  }

  console.log("Mise à jour réussie, récupération des données mises à jour");
  
  // Récupérer tous les contributeurs et mettre à jour les pourcentages si le chiffrement est activé
  const contributors = await fetchContributorsService();
  
  if (encryptionEnabled) {
    const contributorsWithPercentages = await calculateContributorPercentages(contributors);
    await updateContributorPercentagesInDB(contributorsWithPercentages);
    return contributorsWithPercentages;
  }
  
  return contributors;
};
